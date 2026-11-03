-- ============================================================
-- Script: Semak & Padam Rekod Duplicate dalam Applications
-- ============================================================
-- CARA GUNA:
-- 1. Buka Supabase SQL Editor
-- 2. Jalankan BAHAGIAN 1 untuk semak rekod yang duplicate
-- 3. Jalankan BAHAGIAN 2 untuk padam rekod duplicate (kekalkan yang terkini)
-- ============================================================

-- BAHAGIAN 1: Semak rekod duplicate
SELECT 
  company, 
  bank, 
  name_facility, 
  total_requested, 
  status, 
  COUNT(*) AS jumlah_duplicate
FROM applications
GROUP BY company, bank, name_facility, total_requested, status
HAVING COUNT(*) > 1;

-- BAHAGIAN 2: Padam rekod pendua (Simpan rekod yang paling terkini dikemaskini)
DELETE FROM applications a
WHERE a.id NOT IN (
  SELECT DISTINCT ON (company, bank, COALESCE(name_facility, ''), COALESCE(total_requested, 0), status) id
  FROM applications
  ORDER BY company, bank, COALESCE(name_facility, ''), COALESCE(total_requested, 0), status, updated_at DESC, created_at DESC
);

-- BAHAGIAN 3: Verifikasi baki rekod selepas pembersihan
SELECT 
  company, 
  bank, 
  name_facility, 
  total_requested, 
  collateral, 
  status, 
  progress
FROM applications
WHERE collateral = 'PROPERTY' OR company = 'MUAZ MAJU SDN BHD';
