-- ============================================================
-- Migration: Rename collateral 'HARTANAH' -> 'PROPERTY'
-- ============================================================
-- Jalankan skrip ini dalam Supabase SQL Editor.
-- Skrip ini selamat dijalankan berulang kali (idempotent).
-- ============================================================

-- 1. Kemaskini nilai teks pada applications dahulu
UPDATE applications
SET collateral = 'PROPERTY'
WHERE collateral = 'HARTANAH';

-- 2. Kemaskini rekod dalam jadual collaterals
--    (jika 'PROPERTY' sudah wujud, gabungkan dan padam yang pendua)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM collaterals WHERE name = 'HARTANAH') THEN
    IF EXISTS (SELECT 1 FROM collaterals WHERE name = 'PROPERTY') THEN
      UPDATE applications
      SET collateral_id = (SELECT id FROM collaterals WHERE name = 'PROPERTY')
      WHERE collateral_id = (SELECT id FROM collaterals WHERE name = 'HARTANAH');

      DELETE FROM collaterals WHERE name = 'HARTANAH';
    ELSE
      UPDATE collaterals SET name = 'PROPERTY' WHERE name = 'HARTANAH';
    END IF;
  END IF;
END $$;

-- 3. Selaraskan hubungan collateral_id dengan nama terkini
UPDATE applications a
SET collateral_id = c.id
FROM collaterals c
WHERE a.collateral = c.name;

-- 4. Verifikasi
SELECT name, description FROM collaterals ORDER BY name;
SELECT collateral, COUNT(*) AS jumlah FROM applications GROUP BY collateral ORDER BY jumlah DESC;
