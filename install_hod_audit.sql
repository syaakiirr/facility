-- Complete Facilities HOD + Audit installer for muhdsyakir01@gmail.com.
-- Generated from the four migration sources below; run this entire file in Supabase SQL Editor.
-- One transaction: failure rolls back the whole installation. Safe to rerun.
BEGIN;

-- Source: prepare_review_audit.sql
-- Prerequisites for an existing Facilities database. No application data is seeded or deleted.

DO $$
BEGIN
  IF to_regclass('public.applications') IS NULL THEN
    RAISE EXCEPTION 'Facilities applications table is missing. Open the Supabase project used by this app before running this installer.';
  END IF;
  IF (SELECT count(*) FROM auth.users WHERE lower(email) = 'muhdsyakir01@gmail.com') <> 1 THEN
    RAISE EXCEPTION 'Expected one registered Auth user with email muhdsyakir01@gmail.com. Check Authentication > Users in the app Supabase project first.';
  END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('super_admin', 'staff')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.page_permissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('super_admin', 'staff')),
  page_key text NOT NULL,
  is_allowed boolean DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  UNIQUE (role, page_key)
);

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin');
$$;

INSERT INTO public.profiles(id, email, role)
SELECT id, email, 'staff' FROM auth.users
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles(id, email, role)
SELECT id, email, 'super_admin' FROM auth.users WHERE lower(email) = 'muhdsyakir01@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'super_admin', email = EXCLUDED.email, updated_at = now();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_permissions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.profiles, public.page_permissions TO authenticated;

DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.profiles;
CREATE POLICY "Authenticated users can read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid() AND role = 'staff');
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admin can update any profile" ON public.profiles;
CREATE POLICY "Super admin can update any profile" ON public.profiles FOR UPDATE TO authenticated
  USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Authenticated users can read page_permissions" ON public.page_permissions;
CREATE POLICY "Authenticated users can read page_permissions" ON public.page_permissions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Super admin can insert page_permissions" ON public.page_permissions;
CREATE POLICY "Super admin can insert page_permissions" ON public.page_permissions FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin());
DROP POLICY IF EXISTS "Super admin can update page_permissions" ON public.page_permissions;
CREATE POLICY "Super admin can update page_permissions" ON public.page_permissions FOR UPDATE TO authenticated
  USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

INSERT INTO public.page_permissions(role, page_key, is_allowed) VALUES
  ('staff', 'dashboard', true), ('staff', 'applications', true), ('staff', 'companies', true),
  ('staff', 'banks', true), ('staff', 'reports', true), ('staff', 'collateral', true),
  ('staff', 'bos_review', false), ('staff', 'review_history', false),
  ('staff', 'audit_trail', false), ('staff', 'settings', false)
ON CONFLICT (role, page_key) DO NOTHING;

-- Source: add_change_requests_table.sql
-- ============================================================
-- Pending change approval workflow
-- Perubahan oleh role selain admin (staff) untuk applications,
-- companies, banks & collaterals disimpan di sini sebagai PENDING.
-- Bila HOD (super_admin) Approve, bsarulah perubahan itu di-apply
-- ke table sebenar. Kalau Reject, perubahan dibuang.
-- ============================================================

CREATE TABLE IF NOT EXISTS change_requests (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity             TEXT NOT NULL CHECK (entity IN ('application','company','bank','collateral')),
  action             TEXT NOT NULL CHECK (action IN ('CREATE','UPDATE','DELETE')),
  record_id          UUID,
  payload            JSONB NOT NULL DEFAULT '{}'::jsonb,
  summary            TEXT,
  status             TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','APPROVED','REJECTED')),
  requested_by       UUID,
  requested_by_email TEXT,
  reviewed_by        UUID,
  reviewed_by_email  TEXT,
  review_notes       TEXT,
  before_payload     JSONB,
  applied_record_id  UUID,
  restored_by        UUID,
  restored_by_email  TEXT,
  restored_at        TIMESTAMPTZ,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_change_requests_status ON change_requests(status);
CREATE INDEX IF NOT EXISTS idx_change_requests_entity ON change_requests(entity);

ALTER TABLE change_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users only" ON change_requests;
CREATE POLICY "Authenticated users only" ON change_requests
  FOR ALL USING (auth.role() = 'authenticated');
GRANT SELECT, INSERT, UPDATE, DELETE ON public.change_requests TO authenticated;

-- Source: add_application_edit_review.sql
-- Run after setup_database.sql and add_change_requests_table.sql.
-- Apply this migration before deploying the updated JavaScript.

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$;


ALTER TABLE change_requests ADD COLUMN IF NOT EXISTS before_payload jsonb;
ALTER TABLE change_requests ADD COLUMN IF NOT EXISTS applied_record_id uuid;
ALTER TABLE change_requests ADD COLUMN IF NOT EXISTS restored_by uuid;
ALTER TABLE change_requests ADD COLUMN IF NOT EXISTS restored_by_email text;
ALTER TABLE change_requests ADD COLUMN IF NOT EXISTS restored_at timestamptz;

CREATE OR REPLACE FUNCTION public.can_review_application_edits()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND
      (p.role = 'super_admin' OR EXISTS (
        SELECT 1 FROM page_permissions pp WHERE pp.role = p.role
          AND pp.page_key = 'bos_review' AND pp.is_allowed = true
      ))
  );
$$;

-- A user's editable profile must not allow them to grant themselves approval rights.
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT
  WITH CHECK (id = auth.uid() AND role = 'staff');

-- Restrictive policies also constrain the existing permissive FOR ALL policies.
DROP POLICY IF EXISTS "Application edits require review RPC" ON applications;
CREATE POLICY "Application edits require review RPC" ON applications
  AS RESTRICTIVE FOR UPDATE TO authenticated USING (false);

DROP POLICY IF EXISTS "Application edit requests use RPC insert" ON change_requests;
CREATE POLICY "Application edit requests use RPC insert" ON change_requests
  AS RESTRICTIVE FOR INSERT TO authenticated WITH CHECK (
    NOT (entity = 'application' AND action = 'UPDATE')
    AND status = 'PENDING' AND requested_by = auth.uid()
  );
DROP POLICY IF EXISTS "Application edit requests use RPC update" ON change_requests;
CREATE POLICY "Application edit requests use RPC update" ON change_requests
  AS RESTRICTIVE FOR UPDATE TO authenticated
  USING (NOT (entity = 'application' AND action = 'UPDATE') AND public.can_review_application_edits())
  WITH CHECK (NOT (entity = 'application' AND action = 'UPDATE') AND public.can_review_application_edits());
DROP POLICY IF EXISTS "Application edit requests retain history" ON change_requests;
CREATE POLICY "Application edit requests retain history" ON change_requests
  AS RESTRICTIVE FOR DELETE TO authenticated
  USING (NOT (entity = 'application' AND action = 'UPDATE') AND public.is_super_admin());

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

CREATE OR REPLACE FUNCTION public.review_application_edit(
  p_request_id uuid, p_decision text, p_notes text DEFAULT NULL
) RETURNS public.change_requests
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  request public.change_requests;
  current_record jsonb;
  patch jsonb;
  assignments text;
BEGIN
  IF auth.uid() IS NULL OR NOT public.can_review_application_edits()
  THEN RAISE EXCEPTION 'HOD Review access is required'; END IF;
  SELECT * INTO request FROM change_requests WHERE id = p_request_id FOR UPDATE;
  IF NOT FOUND OR request.entity <> 'application' OR request.action <> 'UPDATE'
  THEN RAISE EXCEPTION 'Application edit request not found'; END IF;
  IF p_decision NOT IN ('APPROVED', 'REJECTED', 'RESTORE') OR p_decision IS NULL
  THEN RAISE EXCEPTION 'Invalid review decision'; END IF;
  IF p_decision = 'RESTORE' THEN
    IF NOT public.is_super_admin() THEN RAISE EXCEPTION 'Only HOD can restore'; END IF;
    IF request.status = 'PENDING' THEN RAISE EXCEPTION 'This request is already pending'; END IF;
  ELSE
    IF request.status <> 'PENDING' THEN RAISE EXCEPTION 'This request has already been reviewed'; END IF;
    IF request.requested_by = auth.uid() THEN RAISE EXCEPTION 'Another reviewer must review your changes'; END IF;
  END IF;

  IF p_decision = 'APPROVED' OR (p_decision = 'RESTORE' AND request.status = 'APPROVED') THEN
    IF request.before_payload IS NULL THEN
      RAISE EXCEPTION 'Original data was not recorded. Reject this legacy edit and resubmit it';
    END IF;
    SELECT to_jsonb(a) INTO current_record FROM applications a WHERE id = request.record_id FOR UPDATE;
    IF current_record IS NULL THEN RAISE EXCEPTION 'Application no longer exists'; END IF;
    IF EXISTS (SELECT 1 FROM jsonb_object_keys(request.payload) k
      WHERE k IN ('id', 'created_at', 'updated_at') OR NOT current_record ? k)
    THEN RAISE EXCEPTION 'Invalid application field'; END IF;
    IF EXISTS (SELECT 1 FROM jsonb_object_keys(request.payload) k
      WHERE current_record -> k IS DISTINCT FROM
        CASE WHEN p_decision = 'APPROVED' THEN request.before_payload -> k ELSE request.payload -> k END)
    THEN RAISE EXCEPTION 'A reviewed field has changed. Reload and submit a new edit'; END IF;

    IF p_decision = 'APPROVED' THEN patch := request.payload;
    ELSE
      SELECT jsonb_object_agg(k, request.before_payload -> k) INTO patch
        FROM jsonb_object_keys(request.payload) k;
    END IF;
    SELECT string_agg(format('%I = r.%I', k, k), ', ') INTO assignments FROM jsonb_object_keys(patch) k;
    IF assignments IS NULL THEN RAISE EXCEPTION 'This request has no changes'; END IF;
    EXECUTE format('UPDATE public.applications a SET %s, updated_at = now()
      FROM jsonb_populate_record(NULL::public.applications, $1) r WHERE a.id = $2', assignments)
      USING current_record || patch, request.record_id;
  END IF;

  IF p_decision = 'RESTORE' THEN
    UPDATE change_requests SET status = 'PENDING', applied_record_id = NULL,
      reviewed_by = NULL, reviewed_by_email = NULL, reviewed_at = NULL, review_notes = NULL,
      restored_by = auth.uid(), restored_by_email = auth.jwt() ->> 'email', restored_at = now()
      WHERE id = request.id RETURNING * INTO request;
  ELSE
    UPDATE change_requests SET status = p_decision, review_notes = p_notes,
      applied_record_id = CASE WHEN p_decision = 'APPROVED' THEN record_id ELSE NULL END,
      reviewed_by = auth.uid(), reviewed_by_email = auth.jwt() ->> 'email', reviewed_at = now()
      WHERE id = request.id RETURNING * INTO request;
  END IF;
  RETURN request;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_application_edit(uuid, jsonb, jsonb, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.review_application_edit(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_application_edit(uuid, jsonb, jsonb, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.review_application_edit(uuid, text, text) TO authenticated;

-- Source: add_audit_trail.sql
-- Apply after add_application_edit_review.sql. Records future committed writes only.

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
SELECT email, role FROM public.profiles WHERE lower(email) = 'muhdsyakir01@gmail.com';
