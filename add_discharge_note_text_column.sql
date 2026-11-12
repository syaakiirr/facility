-- ============================================================
-- Discharge note details.
-- discharge_note        BOOLEAN  -> whether a discharge note was issued
-- discharge_note_text   TEXT     -> the discharge note details
-- ============================================================

ALTER TABLE applications ADD COLUMN IF NOT EXISTS discharge_note_text TEXT;
