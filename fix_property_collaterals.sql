-- ============================================================
-- Migration Script: Pembetulan Cagaran & Rekod Dari Sheet DATABASE property
-- ============================================================
-- Jalankan skrip ini dalam Supabase SQL Editor.
-- Skrip ini memulihkan 8 rekod yang tersalah label sebagai cagaran 'HARTANAH'
-- kepada kemudahan sebenar mengikut fail Excel asal.
-- ============================================================

-- 1. Kemaskini rekod MUAZ MAJU SDN BHD (Affin Bank - Overdraft)
UPDATE applications
SET 
  collateral = '80% SJPP, 20% FD',
  rate_tenure = 'MONTHLY',
  app_details = 'WAITING DOCUMENT'
WHERE company = 'MUAZ MAJU SDN BHD' 
  AND bank = 'Affin Bank' 
  AND name_facility = 'OD-i';

-- 2. Pulihkan syarikat-syarikat keselamatan kepada Overdraft Maybank (80% SJPP)
UPDATE applications
SET 
  category = 'COMPANY',
  type_facility = 'OVERDRAFT',
  name_facility = 'CM CASH LINE-i',
  collateral = '80% SJPP',
  profit_rate = 'BFR + 1%',
  rate_tenure = 'MAX 10 YEARS',
  status = 'ON HOLD',
  app_details = 'PENDING DOCS SUBMISSION (DIRECTOR CONSENT FORM SIGNATURE)',
  property_detail = NULL
WHERE company = 'PATRIOT PROTECTION & SECURITY SDN BHD'
  AND (category = 'PROPERTY' OR collateral IN ('HARTANAH', 'PROPERTY'));

UPDATE applications
SET 
  category = 'COMPANY',
  type_facility = 'OVERDRAFT',
  name_facility = 'CM CASH LINE-i',
  collateral = '80% SJPP',
  profit_rate = 'BFR + 1%',
  rate_tenure = 'MAX 10 YEARS',
  status = 'ON HOLD',
  app_details = 'PENDING DOCS SUBMISSION (DIRECTOR CONSENT FORM SIGNATURE)',
  property_detail = NULL
WHERE company = 'GOLDEN IZZ ENTERPRISE'
  AND (category = 'PROPERTY' OR collateral IN ('HARTANAH', 'PROPERTY'));

UPDATE applications
SET 
  category = 'COMPANY',
  type_facility = 'OVERDRAFT',
  name_facility = 'CM CASH LINE-i',
  collateral = '80% SJPP',
  profit_rate = 'BFR + 1%',
  rate_tenure = 'MAX 10 YEARS',
  status = 'ON HOLD',
  app_details = 'PENDING DOCS SUBMISSION (DIRECTOR CONSENT FORM SIGNATURE)',
  property_detail = NULL
WHERE company = 'COMMITTED SECURITY SDN BHD'
  AND (category = 'PROPERTY' OR collateral IN ('HARTANAH', 'PROPERTY'));

UPDATE applications
SET 
  category = 'COMPANY',
  type_facility = 'OVERDRAFT',
  name_facility = 'CM CASH LINE-i',
  collateral = '80% SJPP',
  profit_rate = 'BFR + 1%',
  rate_tenure = 'MAX 10 YEARS',
  status = 'ON HOLD',
  app_details = 'PENDING DOCS SUBMISSION (DIRECTOR CONSENT FORM SIGNATURE)',
  property_detail = NULL
WHERE company = 'TOUGH SECURITY SDN BHD'
  AND (category = 'PROPERTY' OR collateral IN ('HARTANAH', 'PROPERTY'));

UPDATE applications
SET 
  category = 'COMPANY',
  type_facility = 'OVERDRAFT',
  name_facility = 'CM CASH LINE-i',
  collateral = '80% SJPP',
  profit_rate = 'BFR + 1%',
  rate_tenure = 'MAX 10 YEARS',
  status = 'ON HOLD',
  app_details = 'PENDING DOCS SUBMISSION (DIRECTOR CONSENT FORM SIGNATURE)',
  property_detail = NULL
WHERE company = 'AFRA SERVICES SDN BHD'
  AND (category = 'PROPERTY' OR collateral IN ('HARTANAH', 'PROPERTY'));

UPDATE applications
SET 
  category = 'COMPANY',
  type_facility = 'OVERDRAFT',
  name_facility = 'OD-i',
  collateral = '80% SJPP',
  profit_rate = 'BFR + 1%',
  rate_tenure = 'MONTHLY',
  status = 'IN PROGRESS',
  app_details = 'PROCESSING AT BANK',
  property_detail = NULL
WHERE company = 'COMMITTED FIREARMS SDN BHD'
  AND (category = 'PROPERTY' OR collateral IN ('HARTANAH', 'PROPERTY'));

UPDATE applications
SET 
  category = 'COMPANY',
  type_facility = 'OVERDRAFT',
  name_facility = 'CM CASH LINE-i',
  collateral = '80% SJPP',
  profit_rate = 'BFR + 1%',
  rate_tenure = 'MAX 10 YEARS',
  status = 'IN PROGRESS',
  app_details = 'PROCESSING AT BANK',
  property_detail = NULL
WHERE company = 'NELANG SECURITY SDN BHD'
  AND (category = 'PROPERTY' OR collateral IN ('HARTANAH', 'PROPERTY'));

-- 3. Selaraskan hubungan collateral_id dengan jadual collaterals
UPDATE applications a
SET collateral_id = c.id
FROM collaterals c
WHERE a.collateral = c.name;

-- 4. Semakan Verifikasi Data
SELECT 
  category,
  company,
  bank,
  name_facility,
  collateral,
  property_detail,
  status
FROM applications
ORDER BY category, company;

-- Ringkasan Agihan Cagaran Terkini
SELECT 
  COALESCE(collateral, 'TIADA CAGARAN') AS jenis_cagaran,
  COUNT(*) AS jumlah_permohonan
FROM applications
GROUP BY collateral
ORDER BY jumlah_permohonan DESC;
