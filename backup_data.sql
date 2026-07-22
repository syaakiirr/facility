-- ============================================================
-- KaKeFa Facilities Dashboard — BACKUP DATA
-- Generated: 2026-07-19
-- ============================================================
-- CARA GUNA:
--   1. Buka Supabase Dashboard → SQL Editor
--   2. Run query ini untuk BACKUP (export as JSON/CSV):
--
--   PILIHAN A — Export terus dari Supabase Dashboard:
--     Table Editor → Pilih jadual → klik "Export" (atas kanan) → Download CSV
--
--   PILIHAN B — Run query di bawah dalam SQL Editor untuk lihat semua data:
-- ============================================================

-- ============================================================
-- SEMAK BILANGAN REKOD SEBELUM BACKUP
-- ============================================================
SELECT 'applications' AS table_name, COUNT(*) AS total_records FROM applications
UNION ALL
SELECT 'banks', COUNT(*) FROM banks
UNION ALL
SELECT 'bos_review', COUNT(*) FROM bos_review;

-- ============================================================
-- EXPORT SEMUA DATA — APPLICATIONS
-- ============================================================
SELECT * FROM applications ORDER BY created_at ASC;

-- ============================================================
-- EXPORT SEMUA DATA — BANKS
-- ============================================================
SELECT * FROM banks ORDER BY name ASC;

-- ============================================================
-- EXPORT SEMUA DATA — BOS REVIEW
-- ============================================================
SELECT * FROM bos_review ORDER BY created_at ASC;
