-- ============================================================
-- Cancellation letter from bank for DECLINED BY COMPANY.
--   * bank_cancellation_letter      : Yes/No answer (radio)
--   * bank_cancellation_letter_path : Cloudinary secure URL
--   * bank_cancellation_letter_name : original uploaded file name
-- Files are stored in Cloudinary (unsigned upload preset).
-- Run this in the Supabase SQL editor before using the feature.
-- ============================================================

ALTER TABLE applications ADD COLUMN IF NOT EXISTS bank_cancellation_letter      BOOLEAN DEFAULT false;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS bank_cancellation_letter_path TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS bank_cancellation_letter_name TEXT;
