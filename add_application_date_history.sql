-- Run in Supabase SQL Editor. Existing application dates are preserved.
BEGIN;
LOCK TABLE public.applications IN SHARE ROW EXCLUSIVE MODE;

CREATE TABLE IF NOT EXISTS public.application_date_history (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  application_id uuid NOT NULL,
  field_name text NOT NULL CHECK (field_name IN ('date_doc_sent', 'date_followup')),
  previous_date date,
  new_date date,
  recorded_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  recorded_by uuid,
  recorded_by_email text,
  source text NOT NULL CHECK (source IN ('change', 'audit', 'baseline')),
  audit_event_id bigint,
  UNIQUE (audit_event_id, field_name)
);
CREATE INDEX IF NOT EXISTS application_date_history_app_idx
  ON public.application_date_history(application_id, recorded_at DESC, id DESC);

ALTER TABLE public.application_date_history ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.application_date_history FROM PUBLIC, authenticated;
GRANT SELECT ON public.application_date_history TO authenticated;
DROP POLICY IF EXISTS "Application readers can read date history" ON public.application_date_history;
CREATE POLICY "Application readers can read date history" ON public.application_date_history
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.applications a WHERE a.id = application_id)
  );

CREATE OR REPLACE FUNCTION public.prevent_application_date_history_mutation()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  RAISE EXCEPTION 'Application date history cannot be edited or deleted';
END;
$$;
DROP TRIGGER IF EXISTS application_date_history_immutable ON public.application_date_history;
CREATE TRIGGER application_date_history_immutable
  BEFORE UPDATE OR DELETE OR TRUNCATE ON public.application_date_history
  FOR EACH STATEMENT EXECUTE FUNCTION public.prevent_application_date_history_mutation();

-- Import committed application changes only, never pending/rejected proposals.
DO $$
BEGIN
  IF to_regclass('public.audit_events') IS NOT NULL THEN
    INSERT INTO public.application_date_history(application_id, field_name, previous_date,
      new_date, recorded_at, recorded_by, recorded_by_email, source, audit_event_id)
    SELECT e.record_id, f.name, (e.before_snapshot ->> f.name)::date,
      (e.after_snapshot ->> f.name)::date, e.occurred_at, e.actor_id, e.actor_email, 'audit', e.id
    FROM public.audit_events e
    CROSS JOIN (VALUES ('date_doc_sent'), ('date_followup')) f(name)
    WHERE e.source_table = 'applications' AND e.action IN ('CREATED', 'UPDATED')
      AND e.record_id IS NOT NULL
      AND (e.before_snapshot ->> f.name) IS DISTINCT FROM (e.after_snapshot ->> f.name)
      AND NOT EXISTS (SELECT 1 FROM public.application_date_history h WHERE h.application_id = e.record_id)
    ON CONFLICT (audit_event_id, field_name) DO NOTHING;
  END IF;
END;
$$;

-- A baseline means "known at installation", not the original meeting/upload time.
INSERT INTO public.application_date_history(application_id, field_name, new_date, source)
SELECT a.id, f.name, (to_jsonb(a) ->> f.name)::date, 'baseline'
FROM public.applications a
CROSS JOIN (VALUES ('date_doc_sent'), ('date_followup')) f(name)
WHERE (to_jsonb(a) ->> f.name) IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM public.application_date_history h
    WHERE h.application_id = a.id AND h.field_name = f.name);

CREATE OR REPLACE FUNCTION public.capture_application_date_history()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  field text;
  prior date;
  subsequent date;
BEGIN
  FOREACH field IN ARRAY ARRAY['date_doc_sent', 'date_followup'] LOOP
    prior := NULL;
    IF TG_OP = 'UPDATE' THEN prior := (to_jsonb(OLD) ->> field)::date; END IF;
    subsequent := (to_jsonb(NEW) ->> field)::date;
    IF prior IS DISTINCT FROM subsequent THEN
      INSERT INTO public.application_date_history(application_id, field_name, previous_date,
        new_date, recorded_by, recorded_by_email, source)
      VALUES (NEW.id, field, prior, subsequent, auth.uid(), auth.jwt() ->> 'email', 'change');
    END IF;
  END LOOP;
  RETURN NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.capture_application_date_history() FROM PUBLIC;
DROP TRIGGER IF EXISTS capture_application_dates ON public.applications;
CREATE TRIGGER capture_application_dates AFTER INSERT OR UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.capture_application_date_history();
COMMIT;
