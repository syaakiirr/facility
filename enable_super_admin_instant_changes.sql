-- Upgrade an existing HOD review installation. Does not apply old pending requests.
BEGIN;
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
  assignments text;
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

  IF public.is_super_admin() THEN
    SELECT string_agg(format('%I = r.%I', k, k), ', ') INTO assignments FROM jsonb_object_keys(changes) k;
    EXECUTE format('UPDATE public.applications a SET %s, updated_at = now()
      FROM jsonb_populate_record(NULL::public.applications, $1) r WHERE a.id = $2', assignments)
      USING current_record || changes, p_record_id;
    -- Return an applied result without creating an approval request.
    result.entity := 'application';
    result.action := 'UPDATE';
    result.status := 'APPROVED';
    result.record_id := p_record_id;
    result.applied_record_id := p_record_id;
    result.payload := changes;
    RETURN result;
  END IF;

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
