-- Run in Supabase SQL Editor. Existing application dates are preserved.
BEGIN;
LOCK TABLE public.applications IN SHARE ROW EXCLUSIVE MODE;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS date_doc_sent_note text;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS date_followup_note text;

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
ALTER TABLE public.application_date_history ADD COLUMN IF NOT EXISTS note text;
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
      new_date, recorded_at, recorded_by, recorded_by_email, source, audit_event_id, note)
    SELECT e.record_id, f.name, (e.before_snapshot ->> f.name)::date,
      (e.after_snapshot ->> f.name)::date, e.occurred_at, e.actor_id, e.actor_email, 'audit', e.id,
      e.after_snapshot ->> (f.name || '_note')
    FROM public.audit_events e
    CROSS JOIN (VALUES ('date_doc_sent'), ('date_followup')) f(name)
    WHERE e.source_table = 'applications' AND e.action IN ('CREATED', 'UPDATED')
      AND e.record_id IS NOT NULL
      AND ((e.before_snapshot ->> f.name) IS DISTINCT FROM (e.after_snapshot ->> f.name)
        OR (e.before_snapshot ->> (f.name || '_note')) IS DISTINCT FROM (e.after_snapshot ->> (f.name || '_note')))
      AND NOT EXISTS (SELECT 1 FROM public.application_date_history h WHERE h.application_id = e.record_id)
    ON CONFLICT (audit_event_id, field_name) DO NOTHING;
  END IF;
END;
$$;

-- A baseline means "known at installation", not the original meeting/upload time.
INSERT INTO public.application_date_history(application_id, field_name, new_date, source, note)
SELECT a.id, f.name, (to_jsonb(a) ->> f.name)::date, 'baseline', to_jsonb(a) ->> (f.name || '_note')
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
  prior_note text;
  subsequent_note text;
BEGIN
  FOREACH field IN ARRAY ARRAY['date_doc_sent', 'date_followup'] LOOP
    prior := NULL;
    prior_note := NULL;
    IF TG_OP = 'UPDATE' THEN
      prior := (to_jsonb(OLD) ->> field)::date;
      prior_note := to_jsonb(OLD) ->> (field || '_note');
    END IF;
    subsequent := (to_jsonb(NEW) ->> field)::date;
    subsequent_note := to_jsonb(NEW) ->> (field || '_note');
    IF prior IS DISTINCT FROM subsequent OR prior_note IS DISTINCT FROM subsequent_note THEN
      INSERT INTO public.application_date_history(application_id, field_name, previous_date,
        new_date, recorded_by, recorded_by_email, source, note)
      VALUES (NEW.id, field, prior, subsequent, auth.uid(), auth.jwt() ->> 'email', 'change', subsequent_note);
    END IF;
  END LOOP;
  RETURN NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.capture_application_date_history() FROM PUBLIC;
DROP TRIGGER IF EXISTS capture_application_dates ON public.applications;
CREATE TRIGGER capture_application_dates AFTER INSERT OR UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.capture_application_date_history();
CREATE OR REPLACE FUNCTION public.submit_application_edit(
  p_record_id uuid, p_payload jsonb, p_original jsonb, p_summary text
) RETURNS public.change_requests
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  current_record jsonb;
  proposed jsonb;
  original_typed jsonb;
  changes jsonb;
  date_field text;
  result public.change_requests;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Sign in to submit changes'; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND
      (p.role = 'super_admin' OR EXISTS (
        SELECT 1 FROM page_permissions pp WHERE pp.role = p.role
          AND pp.page_key = 'applications' AND pp.is_allowed = true
      ))
  ) THEN RAISE EXCEPTION 'Applications access is required'; END IF;
  IF jsonb_typeof(p_payload) IS DISTINCT FROM 'object'
     OR jsonb_typeof(p_original) IS DISTINCT FROM 'object'
  THEN RAISE EXCEPTION 'Reload the application before editing'; END IF;

  SELECT to_jsonb(a) INTO current_record FROM applications a WHERE id = p_record_id FOR UPDATE;
  IF current_record IS NULL THEN RAISE EXCEPTION 'Application no longer exists'; END IF;
  IF EXISTS (SELECT 1 FROM jsonb_object_keys(p_payload) k
    WHERE k IN ('id', 'created_at', 'updated_at') OR NOT current_record ? k)
  THEN RAISE EXCEPTION 'Invalid application field'; END IF;

  SELECT to_jsonb(r) INTO proposed FROM jsonb_populate_record(NULL::applications, current_record || p_payload) r;
  SELECT to_jsonb(r) INTO original_typed FROM jsonb_populate_record(NULL::applications, p_original) r;
  SELECT COALESCE(jsonb_object_agg(k, proposed -> k), '{}'::jsonb) INTO changes
    FROM jsonb_object_keys(p_payload) k WHERE proposed -> k IS DISTINCT FROM original_typed -> k;
  IF changes = '{}'::jsonb THEN RETURN NULL; END IF;
  -- Review each date together with its note, including same-date note corrections.
  FOREACH date_field IN ARRAY ARRAY['date_doc_sent', 'date_followup'] LOOP
    IF proposed ? (date_field || '_note') AND (changes ? date_field OR changes ? (date_field || '_note')) THEN
      changes := changes || jsonb_build_object(date_field, proposed -> date_field,
        date_field || '_note', CASE WHEN changes ? date_field AND NOT p_payload ? (date_field || '_note')
          THEN 'null'::jsonb ELSE proposed -> (date_field || '_note') END);
    END IF;
  END LOOP;
  IF EXISTS (SELECT 1 FROM jsonb_object_keys(changes) k
    WHERE current_record -> k IS DISTINCT FROM original_typed -> k)
  THEN RAISE EXCEPTION 'This application changed. Reload it and submit your edit again'; END IF;

  INSERT INTO change_requests(entity, action, record_id, payload, before_payload,
    summary, status, requested_by, requested_by_email)
  VALUES ('application', 'UPDATE', p_record_id, changes, current_record, p_summary,
    'PENDING', auth.uid(), auth.jwt() ->> 'email') RETURNING * INTO result;
  RETURN result;
END;
$$;
REVOKE ALL ON FUNCTION public.submit_application_edit(uuid, jsonb, jsonb, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_application_edit(uuid, jsonb, jsonb, text) TO authenticated;
COMMIT;
