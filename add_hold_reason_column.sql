-- Tambah column dekat table applications
ALTER TABLE applications ADD COLUMN IF NOT EXISTS hold_reason TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS fixed_deposit TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS annual_review TEXT;
