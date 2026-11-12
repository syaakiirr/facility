-- Run after setup_database.sql and add_change_requests_table.sql.
-- Apply this migration before deploying the updated JavaScript.
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
COMMIT;
