-- ============================================================
-- KaKeFa Facilities Dashboard — CLEAR DATA FOR TESTING
-- Generated: 2026-07-19
-- ============================================================
-- ⚠️  AMARAN: Script ini akan PADAMKAN SEMUA DATA!
-- Pastikan anda sudah BACKUP dulu sebelum run script ini.
--
-- CARA GUNA:
--   1. Buka Supabase Dashboard → SQL Editor
--   2. Pastikan backup sudah selesai (jalankan backup_data.sql dulu)
--   3. Copy & paste KESELURUHAN script ini ke SQL Editor
--   4. Klik "Run" untuk jalankan
-- ============================================================

-- ============================================================
-- STEP 1: SEMAK DATA SEKARANG (sebelum delete)
-- ============================================================
SELECT 'applications' AS table_name, COUNT(*) AS total_records FROM applications
UNION ALL
SELECT 'banks', COUNT(*) FROM banks
UNION ALL
SELECT 'bos_review', COUNT(*) FROM bos_review;

-- ============================================================
-- STEP 2: KOSONGKAN SEMUA DATA
-- ============================================================

-- Kosongkan table applications (semua permohonan)
DELETE FROM applications;

-- Kosongkan table bos_review
DELETE FROM bos_review;

-- JANGAN delete banks — simpan senarai bank dan BFR rate
-- (Uncomment baris bawah kalau nak delete banks juga)
-- DELETE FROM banks;

-- ============================================================
-- STEP 3: RESET AUTO-INCREMENT (optional)
-- Note: UUID tidak perlu reset, tapi kalau guna sequence lain:
-- ============================================================
-- (Tiada sequence untuk di-reset kerana UUID digunakan)

-- ============================================================
-- STEP 4: VERIFY — semak data selepas delete
-- ============================================================
SELECT 'applications' AS table_name, COUNT(*) AS total_records FROM applications
UNION ALL
SELECT 'banks', COUNT(*) FROM banks
UNION ALL
SELECT 'bos_review', COUNT(*) FROM bos_review;

-- ============================================================
-- Selepas kosong, anda boleh:
-- 1. Masukkan data testing baru melalui sistem (UI)
-- 2. Atau jalankan semula setup_database.sql untuk seed data asal
-- ============================================================
