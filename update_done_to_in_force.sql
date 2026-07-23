-- Migration Script: Kemaskini status 'DONE' kepada 'IN FORCE'
-- Jalankan skrip ini dalam Supabase SQL Editor jika ada data sedia ada dengan status 'DONE'

UPDATE applications 
SET status = 'IN FORCE' 
WHERE status = 'DONE';

-- Verifikasi perubahan
SELECT id, company, bank, name_facility, status, total_approved 
FROM applications 
WHERE status = 'IN FORCE';
