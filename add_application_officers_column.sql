-- ============================================================
-- Officers per application.
-- Each application can have many officers, stored as a JSONB
-- array of { name, position, contact, office }.
-- ============================================================

ALTER TABLE applications ADD COLUMN IF NOT EXISTS officers JSONB DEFAULT '[]'::jsonb;
