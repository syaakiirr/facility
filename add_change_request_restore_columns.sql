-- ============================================================
-- Restore support for the change-request approval workflow.
-- Jalankan ini kalau table change_requests sudah wujud
-- (CREATE TABLE IF NOT EXISTS tidak akan tambah column baru).
-- ============================================================

ALTER TABLE change_requests ADD COLUMN IF NOT EXISTS before_payload    JSONB;
ALTER TABLE change_requests ADD COLUMN IF NOT EXISTS applied_record_id UUID;
ALTER TABLE change_requests ADD COLUMN IF NOT EXISTS restored_by       UUID;
ALTER TABLE change_requests ADD COLUMN IF NOT EXISTS restored_by_email TEXT;
ALTER TABLE change_requests ADD COLUMN IF NOT EXISTS restored_at       TIMESTAMPTZ;

-- Seed RBAC entry for the new Review History page.
-- Staff denied by default; HOD (super admin) always has access.
DO $$
BEGIN
  IF to_regclass('public.page_permissions') IS NOT NULL THEN
    INSERT INTO page_permissions (role, page_key, is_allowed)
    VALUES ('staff', 'review_history', false)
    ON CONFLICT (role, page_key) DO NOTHING;
  END IF;
END $$;
