-- Apply after add_application_edit_review.sql. Records future committed writes only.
BEGIN;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$;

CREATE TABLE IF NOT EXISTS public.audit_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  occurred_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  transaction_id text NOT NULL DEFAULT txid_current()::text,
  actor_id uuid,
  actor_email text,
  actor_name text,
  actor_role text,
  source_table text NOT NULL,
  entity text NOT NULL,
  record_id uuid,
  request_id uuid,
  action text NOT NULL,
  summary text,
  field_changes jsonb NOT NULL DEFAULT '{}'::jsonb,
  before_snapshot jsonb,
  after_snapshot jsonb
);
CREATE INDEX IF NOT EXISTS audit_events_time_idx ON public.audit_events (occurred_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS audit_events_record_idx ON public.audit_events (record_id, id DESC);
CREATE INDEX IF NOT EXISTS audit_events_request_idx ON public.audit_events (request_id, id DESC);
CREATE INDEX IF NOT EXISTS audit_events_actor_idx ON public.audit_events (actor_id, id DESC);

ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.audit_events FROM PUBLIC, authenticated;
GRANT SELECT ON public.audit_events TO authenticated;
DROP POLICY IF EXISTS "Audit readers" ON public.audit_events;
CREATE POLICY "Audit readers" ON public.audit_events FOR SELECT TO authenticated USING (
  public.is_super_admin() OR EXISTS (
    SELECT 1 FROM public.profiles p JOIN public.page_permissions pp ON pp.role = p.role
    WHERE p.id = auth.uid() AND pp.page_key = 'audit_trail' AND pp.is_allowed = true
  )
);

CREATE OR REPLACE FUNCTION public.prevent_audit_mutation()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  RAISE EXCEPTION 'Audit events cannot be edited, deleted or truncated';
END;
$$;
DROP TRIGGER IF EXISTS audit_events_immutable ON public.audit_events;
CREATE TRIGGER audit_events_immutable BEFORE UPDATE OR DELETE OR TRUNCATE ON public.audit_events
  FOR EACH STATEMENT EXECUTE FUNCTION public.prevent_audit_mutation();

CREATE OR REPLACE FUNCTION public.capture_audit_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  prior jsonb;
  subsequent jsonb;
  snapshot jsonb;
  actor jsonb;
  differences jsonb;
  event_action text;
  event_entity text;
  event_record uuid;
  event_request uuid;
BEGIN
  IF TG_OP <> 'INSERT' THEN prior := to_jsonb(OLD); END IF;
  IF TG_OP <> 'DELETE' THEN subsequent := to_jsonb(NEW); END IF;
  IF prior IS NOT DISTINCT FROM subsequent THEN RETURN NULL; END IF;
  snapshot := COALESCE(subsequent, prior);
  SELECT to_jsonb(p) INTO actor FROM public.profiles p WHERE p.id = auth.uid();
  SELECT COALESCE(jsonb_object_agg(key, jsonb_build_object(
    'before', prior -> key, 'after', subsequent -> key,
    'before_present', COALESCE(prior ? key, false),
    'after_present', COALESCE(subsequent ? key, false))), '{}'::jsonb)
  INTO differences FROM jsonb_object_keys(COALESCE(prior, '{}'::jsonb) || COALESCE(subsequent, '{}'::jsonb)) key
  WHERE prior -> key IS DISTINCT FROM subsequent -> key
    OR COALESCE(prior ? key, false) <> COALESCE(subsequent ? key, false);

  event_action := CASE TG_OP WHEN 'INSERT' THEN 'CREATED' WHEN 'UPDATE' THEN 'UPDATED' ELSE 'DELETED' END;
  event_entity := CASE TG_TABLE_NAME
    WHEN 'applications' THEN 'application' WHEN 'companies' THEN 'company'
    WHEN 'banks' THEN 'bank' WHEN 'collaterals' THEN 'collateral'
    WHEN 'profiles' THEN 'user_profile' WHEN 'page_permissions' THEN 'page_permission'
    WHEN 'chart_visibility' THEN 'chart_setting' WHEN 'bos_review' THEN 'legacy_proposal'
    ELSE TG_TABLE_NAME END;
  event_record := (snapshot ->> 'id')::uuid;
  IF TG_TABLE_NAME = 'change_requests' THEN
    event_entity := snapshot ->> 'entity';
    event_record := COALESCE(snapshot ->> 'record_id', snapshot ->> 'applied_record_id')::uuid;
    event_request := (snapshot ->> 'id')::uuid;
    event_action := CASE
      WHEN TG_OP = 'INSERT' THEN 'SUBMITTED'
      WHEN TG_OP = 'DELETE' THEN 'REQUEST_DELETED'
      WHEN subsequent ->> 'status' = 'PENDING' AND prior ->> 'status' IN ('APPROVED', 'REJECTED') THEN 'RESTORED'
      WHEN subsequent ->> 'status' IS DISTINCT FROM prior ->> 'status' THEN subsequent ->> 'status'
      ELSE 'REQUEST_UPDATED' END;
  END IF;
  INSERT INTO public.audit_events(actor_id, actor_email, actor_name, actor_role,
    source_table, entity, record_id, request_id, action, summary,
    field_changes, before_snapshot, after_snapshot)
  VALUES (auth.uid(), COALESCE(auth.jwt() ->> 'email', actor ->> 'email'),
    COALESCE(actor ->> 'full_name', actor ->> 'display_name'),
    COALESCE(actor ->> 'role', CASE WHEN auth.uid() IS NULL THEN 'database/system' ELSE 'unknown' END),
    TG_TABLE_NAME, event_entity, event_record, event_request, event_action,
    COALESCE(snapshot ->> 'summary', snapshot ->> 'name_facility', snapshot ->> 'company', snapshot ->> 'name', snapshot ->> 'page_key'),
    differences, prior, subsequent);
  RETURN NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.capture_audit_event() FROM PUBLIC;

DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['applications', 'change_requests', 'companies', 'banks',
    'collaterals', 'profiles', 'page_permissions', 'chart_visibility', 'bos_review'] LOOP
    IF to_regclass('public.' || table_name) IS NOT NULL THEN
      EXECUTE format('DROP TRIGGER IF EXISTS capture_audit ON public.%I', table_name);
      EXECUTE format('CREATE TRIGGER capture_audit AFTER INSERT OR UPDATE OR DELETE ON public.%I
        FOR EACH ROW EXECUTE FUNCTION public.capture_audit_event()', table_name);
    END IF;
  END LOOP;
END;
$$;
INSERT INTO public.page_permissions(role, page_key, is_allowed)
SELECT 'staff', 'audit_trail', false
WHERE NOT EXISTS (SELECT 1 FROM public.page_permissions WHERE role = 'staff' AND page_key = 'audit_trail');
COMMIT;
