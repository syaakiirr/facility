-- ============================================================
-- Status updates for applications:
--   * SETTLED renamed to DISCHARGED (handled in app logic)
--   * new status CANCELLED BY BANK (approved but bank pulled out)
-- Adds the columns the application form needs to store the
-- discharge-note flag and the bank cancellation reason.
-- ============================================================

ALTER TABLE applications ADD COLUMN IF NOT EXISTS cancel_reason  TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS discharge_note BOOLEAN DEFAULT false;

-- Rename the old SETTLED status to DISCHARGED for existing records.
UPDATE applications SET status = 'DISCHARGED' WHERE status = 'SETTLED';
