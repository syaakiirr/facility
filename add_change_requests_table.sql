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
