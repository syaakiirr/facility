-- ============================================================
-- KaKeFa Facilities Dashboard — Database Setup
-- ============================================================
-- 1. Buat 3 jadual: applications, banks, bos_review
-- 2. Enable RLS + policy
-- 3. Seed data: 20 bank, ~80 rekod permohonan, 2 bos review
-- ============================================================

-- BANKS
CREATE TABLE IF NOT EXISTS banks (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE,
  bfr_current  NUMERIC,
  bfr_previous NUMERIC,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- APPLICATIONS
CREATE TABLE IF NOT EXISTS applications (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category         TEXT NOT NULL,
  company          TEXT NOT NULL,
  year_application INTEGER,
  bank             TEXT,
  bfr              TEXT,
  property_detail  TEXT,
  type_facility    TEXT,
  name_facility    TEXT,
  collateral       TEXT,
  profit_rate      TEXT,
  rate_tenure      TEXT,
  fixed_deposit    TEXT,
  status           TEXT NOT NULL,
  app_details      TEXT,
  progress         INTEGER DEFAULT 0,
  date_doc_sent    DATE,
  date_followup    DATE,
  date_updated     DATE,
  total_requested  NUMERIC DEFAULT 0,
  total_approved   NUMERIC DEFAULT 0,
  decline_reason   TEXT,
  hold_reason      TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- BOS REVIEW
CREATE TABLE IF NOT EXISTS bos_review (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bank_name      TEXT,
  type_facility  TEXT,
  name_facility  TEXT,
  loan_limit     TEXT,
  profit_rate    TEXT,
  tenure         TEXT,
  collateral     TEXT,
  takaful        TEXT,
  legal_fee      TEXT,
  total_offered  NUMERIC DEFAULT 0,
  status         TEXT DEFAULT 'PENDING REVIEW',
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bos_review ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users only" ON applications;
CREATE POLICY "Authenticated users only" ON applications
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users only" ON banks;
CREATE POLICY "Authenticated users only" ON banks
  FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users only" ON bos_review;
CREATE POLICY "Authenticated users only" ON bos_review
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA — BANKS (20 bank)
-- ============================================================
INSERT INTO banks (name, bfr_current, bfr_previous) VALUES
  ('BSN', 6.35, 6.60),
  ('Maybank', 6.40, 6.65),
  ('Alliance Bank', 6.42, 6.67),
  ('RHB Bank', 6.45, 6.70),
  ('Standard Chartered', 6.45, 6.70),
  ('AmBank', 6.45, 6.70),
  ('Bank Islam', 6.47, 6.72),
  ('Public Bank', 6.47, 6.72),
  ('HSBC Bank', 6.49, 6.74),
  ('Agro Bank', 6.50, 6.75),
  ('MBSB Bank', 6.50, 6.75),
  ('OCBC Bank', 6.51, 6.76),
  ('Citibank', 6.55, 6.80),
  ('Affin Bank', 6.56, 6.81),
  ('Bank Muamalat', 6.56, 6.81),
  ('UOB Bank', 6.57, 6.82),
  ('Bank Rakyat', 6.58, 6.83),
  ('CIMB Bank', 6.60, 6.85),
  ('Hong Leong Bank', 6.64, 6.89),
  ('SME Bank', 6.75, 7.00)
ON CONFLICT (name) DO UPDATE SET
  bfr_current  = EXCLUDED.bfr_current,
  bfr_previous = EXCLUDED.bfr_previous,
  updated_at   = NOW();

-- ============================================================
-- SEED DATA — APPLICATIONS (IN FORCE)
-- ============================================================
INSERT INTO applications (category, company, year_application, bank, bfr, type_facility, name_facility, collateral, profit_rate, rate_tenure, status, app_details, progress, date_doc_sent, date_updated, total_requested, total_approved) VALUES
  ('COMPANY', 'MUAZ FORCE SDN BHD', 2022, 'Standard Chartered', '6.45%', 'TERM LOAN', 'PEMULIH GGS', '80% SJPP, 20% FD', '3.75%', '7 YEARS', 'IN FORCE', 'DISBURSED & READY TO USE', 100, '2022-06-09', '2026-06-30', 2000000, 2000000),
  ('COMPANY', 'MUAZ FORCE SDN BHD', 2023, 'Bank Rakyat', '6.58%', 'OVERDRAFT', 'CM Cash Line-i', '80% SJPP, 20% FD', 'BFR + 1%', 'MONTHLY / 5 YEARS', 'IN FORCE', 'DISBURSED & READY TO USE', 100, '2023-03-04', '2026-06-30', 3000000, 2000000),
  ('COMPANY', 'MUAZ FORCE SDN BHD', 2024, 'Bank Rakyat', '6.58%', 'CAPITAL FINANCING', 'WCF-i', '80% SJPP, 20% FD', 'BFR + 0.75%', 'MONTHLY / 7 YEARS', 'IN FORCE', 'DISBURSED & READY TO USE', 100, '2024-08-12', '2026-06-30', 2000000, 2000000),
  ('COMPANY', 'AFRA SERVICES SDN BHD', 2022, 'Bank Rakyat', '6.58%', 'OVERDRAFT', 'CM Cash Line-i', '80% SJPP, 20% FD', 'BFR + 1%', 'MONTHLY', 'IN FORCE', 'DISBURSED & READY TO USE', 100, '2022-07-14', '2026-06-30', 800000, 800000),
  ('COMPANY', 'FIRST ALLIED SECURITY SERVICES SDN BHD', 2022, 'Bank Rakyat', '6.58%', 'OVERDRAFT', 'CM Cash Line-i', '80% SJPP, 20% FD', 'BFR + 1%', 'MONTHLY', 'IN FORCE', 'DISBURSED & READY TO USE', 100, '2022-10-07', '2026-06-30', 500000, 500000),
  ('COMPANY', 'FIRST ALLIED SECURITY SERVICES SDN BHD', 2022, 'Maybank', '6.40%', 'OVERDRAFT', 'OD-i', '80% SJPP, 20% FD', 'BFR + 1.25%', 'MONTHLY', 'IN FORCE', 'DISBURSED & READY TO USE', 100, '2022-10-10', '2026-06-30', 1000000, 500000),
  ('COMPANY', 'NELANG SECURITY SDN BHD', 2022, 'MBSB Bank', '6.50%', 'TERM LOAN', 'PEMULIH', '80% SJPP, 20% FD', '3.75%', '7 YEARS', 'IN FORCE', 'DISBURSED & READY TO USE', 100, '2022-12-14', '2026-06-30', 800000, 500000),
  ('COMPANY', 'MSA SINAR ENTERPRISE', 2022, 'SME Bank', '6.75%', 'TERM LOAN', 'PEMULIH', '80% SJPP, 20% FD', '3.75%', '7 YEARS', 'IN FORCE', 'DISBURSED & READY TO USE', 100, '2022-01-04', '2026-06-30', 1000000, 200000),
  ('COMPANY', 'MUAZ MAJU SDN BHD', 2022, 'Affin Bank', '6.56%', 'OVERDRAFT', 'AFFIN Tawarruq Cash Line-i', '80% SJPP', 'BFR + 1.5%', 'MONTHLY', 'IN FORCE', 'DISBURSED & READY TO USE', 100, '2022-06-18', '2026-06-30', 5000000, 2500000),
  ('COMPANY', 'COMMITTED SECURITY SDN BHD', 2022, 'MBSB Bank', '6.50%', 'TERM LOAN', 'PEMULIH', '80% SJPP, 20% FD', '3.75%', '7 YEARS', 'IN FORCE', 'DISBURSED & READY TO USE', 100, '2022-06-24', '2026-06-30', 550000, 550000);

-- ============================================================
-- SEED DATA — APPLICATIONS (PENDING / IN PROGRESS / HOLD)
-- ============================================================
INSERT INTO applications (category, company, year_application, bank, bfr, type_facility, name_facility, collateral, profit_rate, rate_tenure, status, app_details, progress, date_doc_sent, date_updated, total_requested, total_approved) VALUES
  ('COMPANY', 'COMMITTED FIREARMS SDN BHD', 2025, 'Affin Bank', '6.56%', 'LETTER OF CREDIT', 'LC-i', 'FD', 'BFR + 1%', 'MONTHLY', 'IN PROGRESS', 'PROCESSING AT BANK', 50, '2025-03-15', '2025-11-17', 5000000, NULL),
  ('COMPANY', 'COMMITTED FIREARMS SDN BHD', 2025, 'RHB Bank', '6.45%', 'LETTER OF CREDIT', 'LC-i', 'FD', 'BFR + 1%', 'MONTHLY', 'IN PROGRESS', 'PROCESSING AT BANK', 50, '2025-03-20', '2025-11-17', 1000000, 300000),
  ('COMPANY', 'AFRA SERVICES SDN BHD', 2025, 'Maybank', '6.40%', 'OVERDRAFT', 'OD-i', '80% SJPP', 'BFR + 1%', 'MONTHLY', 'IN PROGRESS', 'PROCESSING AT BANK', 60, '2025-06-10', '2025-11-17', NULL, NULL),
  ('COMPANY', 'COMMITTED FIREARMS SDN BHD', 2025, 'Affin Bank', '6.56%', 'TERM LOAN', 'AFFIN SME SRF', '80% SJPP', '3.75%', '5 YEARS', 'HOLD', 'WAITING BOSS APPROVAL', 30, '2025-10-10', '2025-11-17', 750000, NULL),
  ('COMPANY', 'SULIMI', 2025, 'Affin Bank', '6.56%', 'TERM LOAN', 'AFFIN SME SRF', '80% SJPP', '3.75%', '5 YEARS', 'HOLD', 'WAITING BOSS APPROVAL', 30, '2025-10-10', '2025-11-17', 750000, NULL),
  ('COMPANY', 'MUAZ SERVICES', 2025, 'Affin Bank', '6.56%', 'TERM LOAN', 'AFFIN SME SRF', '80% SJPP', '3.75%', '5 YEARS', 'HOLD', 'WAITING BOSS APPROVAL', 30, '2025-10-10', '2025-11-17', 750000, NULL);

-- ============================================================
-- SEED DATA — APPLICATIONS (DECLINED — sample 10)
-- ============================================================
INSERT INTO applications (category, company, year_application, bank, bfr, type_facility, name_facility, collateral, profit_rate, status, app_details, progress, date_doc_sent, date_updated, total_requested, total_approved, decline_reason) VALUES
  ('COMPANY', 'MUAZ FORCE SDN BHD', 2023, 'Maybank', '6.40%', 'OVERDRAFT', 'OD-i', '80% SJPP', 'BFR + 1%', 'DECLINED BY BANK', 'RUN OUT OF FUND', 0, '2023-04-12', '2025-07-16', 2000000, NULL, 'RUN OUT OF FUND'),
  ('COMPANY', 'MUAZ MAJU SDN BHD', 2023, 'Maybank', '6.40%', 'OVERDRAFT', 'OD-i', '80% SJPP', 'BFR + 1%', 'DECLINED BY BANK', 'RUN OUT OF FUND', 0, '2023-06-15', '2025-07-16', 2000000, NULL, 'RUN OUT OF FUND'),
  ('COMPANY', 'MUAZ MAJU SDN BHD', 2023, 'CIMB Bank', '6.60%', 'OVERDRAFT', 'OD-i', '80% SJPP', 'BFR + 1.5%', 'DECLINED BY BANK', 'DIDN''T PASS SCORING', 0, '2023-08-01', '2025-07-16', 2000000, NULL, 'DIDN''T PASS SCORING'),
  ('COMPANY', 'AFRA SERVICES SDN BHD', 2023, 'CIMB Bank', '6.60%', 'OVERDRAFT', 'OD-i', '80% SJPP', 'BFR + 1.5%', 'DECLINED BY BANK', 'DIDN''T PASS SCORING', 0, '2023-08-15', '2025-07-16', 1000000, NULL, 'DIDN''T PASS SCORING'),
  ('COMPANY', 'FIRST ALLIED SECURITY SERVICES SDN BHD', 2023, 'CIMB Bank', '6.60%', 'OVERDRAFT', 'OD-i', '80% SJPP', 'BFR + 1.5%', 'DECLINED BY BANK', 'DIDN''T PASS SCORING', 0, '2023-08-20', '2025-07-16', 800000, NULL, 'DIDN''T PASS SCORING'),
  ('COMPANY', 'NELANG SECURITY SDN BHD', 2023, 'CIMB Bank', '6.60%', 'OVERDRAFT', 'OD-i', '80% SJPP', 'BFR + 1.5%', 'DECLINED BY BANK', 'DIDN''T PASS SCORING', 0, '2023-09-01', '2025-07-16', 500000, NULL, 'DIDN''T PASS SCORING'),
  ('COMPANY', 'TOUGH SECURITY SDN BHD', 2023, 'Maybank', '6.40%', 'OVERDRAFT', 'OD-i', '80% SJPP', 'BFR + 1%', 'DECLINED BY BANK', 'RUN OUT OF FUND', 0, '2023-07-05', '2025-07-16', 500000, NULL, 'RUN OUT OF FUND'),
  ('COMPANY', 'PATRIOT PROTECTION & SECURITY SDN BHD', 2023, 'Maybank', '6.40%', 'OVERDRAFT', 'OD-i', '80% SJPP', 'BFR + 1%', 'DECLINED BY BANK', 'RUN OUT OF FUND', 0, '2023-07-10', '2025-07-16', 500000, NULL, 'RUN OUT OF FUND'),
  ('COMPANY', 'GOLDEN IZZ ENTERPRISE', 2024, 'Affin Bank', '6.56%', 'TERM LOAN', 'AFFIN SME SRF', '80% SJPP', '3.75%', 'DECLINED BY BANK', 'RUN OUT OF FUND', 0, '2024-02-05', '2025-07-16', 750000, NULL, 'RUN OUT OF FUND'),
  ('COMPANY', 'SYAZA TRADING', 2024, 'Affin Bank', '6.56%', 'TERM LOAN', 'AFFIN SME SRF', '80% SJPP', '3.75%', 'DECLINED BY BANK', 'RUN OUT OF FUND', 0, '2024-02-10', '2025-07-16', 750000, NULL, 'RUN OUT OF FUND'),
  ('COMPANY', 'COMMITTED SECURITY SDN BHD', 2024, 'Affin Bank', '6.56%', 'TERM LOAN', 'AFFIN SME SRF', '80% SJPP', '3.75%', 'DECLINED BY BANK', 'RUN OUT OF FUND', 0, '2024-02-15', '2025-07-16', 750000, NULL, 'RUN OUT OF FUND'),
  ('COMPANY', 'AL BASSYASYAH ENTERPRISE', 2024, 'Affin Bank', '6.56%', 'TERM LOAN', 'AFFIN SME SRF', '80% SJPP', '3.75%', 'DECLINED BY BANK', 'RUN OUT OF FUND', 0, '2024-02-20', '2025-07-16', 750000, NULL, 'RUN OUT OF FUND'),
  ('COMPANY', 'ALRAZIA ENTERPRISE', 2024, 'Affin Bank', '6.56%', 'TERM LOAN', 'AFFIN SME SRF', '80% SJPP', '3.75%', 'DECLINED BY BANK', 'RUN OUT OF FUND', 0, '2024-02-25', '2025-07-16', 750000, NULL, 'RUN OUT OF FUND'),
  ('COMPANY', 'BLUEPEARL ASM RESOURCES', 2024, 'Affin Bank', '6.56%', 'TERM LOAN', 'AFFIN SME SRF', '80% SJPP', '3.75%', 'DECLINED BY COMPANY', 'COLLATERAL USING SINKING FUND', 0, '2024-03-05', '2025-07-16', 500000, NULL, 'COLLATERAL USING SINKING FUND'),
  ('COMPANY', 'IZHORA KLADER TRADING', 2024, 'Affin Bank', '6.56%', 'TERM LOAN', 'AFFIN SME SRF', '80% SJPP', '3.75%', 'DECLINED BY COMPANY', 'COLLATERAL USING SINKING FUND', 0, '2024-03-10', '2025-07-16', 500000, NULL, 'COLLATERAL USING SINKING FUND');

-- ============================================================
-- SEED DATA — APPLICATIONS (PROPERTY — sample 10)
-- ============================================================
INSERT INTO applications (category, company, year_application, bank, bfr, type_facility, name_facility, collateral, profit_rate, rate_tenure, status, app_details, progress, date_updated, total_requested, property_detail) VALUES
  ('PROPERTY', 'MUAZ MAJU SDN BHD', 2022, 'Maybank', '6.40%', 'TERM LOAN', 'PROPERTY LOAN', 'HARTANAH', 'BFR + 1%', '20 YEARS', 'IN PROGRESS', 'PROCESSING', 50, '2026-06-30', 3500000, 'Shoplot 4 Tingkat Setapak RM 3.5J'),
  ('PROPERTY', 'MUAZ MAJU SDN BHD', 2022, 'Affin Bank', '6.56%', 'OVERDRAFT', 'OD-i', 'HARTANAH', 'BFR + 1.5%', 'MONTHLY', 'ON HOLD', 'WAITING DOCUMENT', 20, '2026-06-30', 500000, 'Shoplot 4 Tingkat Setapak RM 3.5J'),
  ('PROPERTY', 'MUAZ MAJU SDN BHD', 2023, 'Maybank', '6.40%', 'TERM LOAN', 'PROPERTY LOAN', 'HARTANAH', 'BFR + 1%', '20 YEARS', 'ON HOLD', 'WAITING DOCUMENT', 10, '2026-06-30', 4400000, 'Bungalow Cheras RM 4.4J'),
  ('PROPERTY', 'PATRIOT PROTECTION & SECURITY SDN BHD', 2022, 'Maybank', '6.40%', 'TERM LOAN', 'PROPERTY LOAN', 'HARTANAH', 'BFR + 1%', '20 YEARS', 'ON HOLD', 'WAITING VALUATION', 10, '2026-06-30', 2000000, 'Property'),
  ('PROPERTY', 'GOLDEN IZZ ENTERPRISE', 2022, 'Maybank', '6.40%', 'TERM LOAN', 'PROPERTY LOAN', 'HARTANAH', 'BFR + 1%', '20 YEARS', 'ON HOLD', 'WAITING VALUATION', 10, '2026-06-30', 1500000, 'Property'),
  ('PROPERTY', 'COMMITTED SECURITY SDN BHD', 2022, 'Maybank', '6.40%', 'TERM LOAN', 'PROPERTY LOAN', 'HARTANAH', 'BFR + 1%', '20 YEARS', 'ON HOLD', 'WAITING VALUATION', 10, '2026-06-30', 1800000, 'Property'),
  ('PROPERTY', 'TOUGH SECURITY SDN BHD', 2022, 'Maybank', '6.40%', 'TERM LOAN', 'PROPERTY LOAN', 'HARTANAH', 'BFR + 1%', '20 YEARS', 'ON HOLD', 'WAITING VALUATION', 10, '2026-06-30', 1200000, 'Property'),
  ('PROPERTY', 'AFRA SERVICES SDN BHD', 2022, 'Maybank', '6.40%', 'TERM LOAN', 'PROPERTY LOAN', 'HARTANAH', 'BFR + 1%', '20 YEARS', 'ON HOLD', 'WAITING VALUATION', 10, '2026-06-30', 1000000, 'Property'),
  ('PROPERTY', 'COMMITTED FIREARMS SDN BHD', 2023, 'Maybank', '6.40%', 'TERM LOAN', 'PROPERTY LOAN', 'HARTANAH', 'BFR + 1%', '20 YEARS', 'IN PROGRESS', 'PROCESSING', 40, '2026-06-30', 2500000, 'Property'),
  ('PROPERTY', 'NELANG SECURITY SDN BHD', 2023, 'Maybank', '6.40%', 'TERM LOAN', 'PROPERTY LOAN', 'HARTANAH', 'BFR + 1%', '20 YEARS', 'IN PROGRESS', 'PROCESSING', 40, '2026-06-30', 2000000, 'Property');

-- ============================================================
-- SEED DATA — APPLICATIONS (ASSET)
-- ============================================================
INSERT INTO applications (category, company, year_application, bank, type_facility, name_facility, status, app_details, progress, date_updated) VALUES
  ('ASSET', 'ATLAS MOTIONS SDN BHD', 2025, 'UOB Bank', 'ASSET FINANCING', 'GAMODA', 'PENDING', 'PENDING PROCESS', 30, '2026-06-30'),
  ('ASSET', 'ATLAS MOTIONS SDN BHD', 2025, 'Public Bank', 'ASSET FINANCING', 'GAMODA', 'PENDING', 'PENDING PROCESS', 30, '2026-06-30');

-- ============================================================
-- SEED DATA — BOS REVIEW
-- ============================================================
INSERT INTO bos_review (bank_name, type_facility, name_facility, loan_limit, profit_rate, tenure, collateral, takaful, legal_fee, total_offered, status, notes) VALUES
  ('Affin Bank', 'OVERDRAFT', 'AFFIN Tawarruq Cash Line-i', 'RM 500,000 AND ABOVE', 'BFR 6.56% + Spread 0.5% - 2.5%', 'MONTHLY', 'FD / SJPP', 'TAKAFUL FEE RM 500', 'LEGAL FEE RM 3,000', 500000, 'PENDING REVIEW', 'Cash line facility for working capital. Suitable for companies with strong CCRIS.'),
  ('Affin Bank', 'TERM LOAN', 'AFFIN SME SRF', 'RM 750,000', 'FIXED 3.75%', '5 YEARS', '80% SJPP / CGC', 'TBS', 'TBS', 750000, 'PENDING REVIEW', 'Government subsidy program. Fixed low rate. Suitable for SME expansion.');

-- ============================================================
-- RBAC TABLES: profiles, page_permissions, chart_visibility
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('super_admin', 'staff')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Helper function to check super admin (created BEFORE policies that use it)
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin');
$$;

DROP POLICY IF EXISTS "Authenticated users can read profiles" ON profiles;
CREATE POLICY "Authenticated users can read profiles"
  ON profiles FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Super admin can update any profile" ON profiles;
CREATE POLICY "Super admin can update any profile"
  ON profiles FOR UPDATE
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- Auto-create profile on new user signup (run this in Supabase SQL editor)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'staff');
  RETURN NEW;
END;
$$;

-- PAGE PERMISSIONS
CREATE TABLE IF NOT EXISTS page_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('super_admin', 'staff')),
  page_key TEXT NOT NULL,
  is_allowed BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(role, page_key)
);

ALTER TABLE page_permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read page_permissions" ON page_permissions;
CREATE POLICY "Authenticated users can read page_permissions"
  ON page_permissions FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Super admin can insert page_permissions" ON page_permissions;
CREATE POLICY "Super admin can insert page_permissions"
  ON page_permissions FOR INSERT
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admin can update page_permissions" ON page_permissions;
CREATE POLICY "Super admin can update page_permissions"
  ON page_permissions FOR UPDATE
  USING (public.is_super_admin());

-- CHART VISIBILITY
CREATE TABLE IF NOT EXISTS chart_visibility (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chart_key TEXT NOT NULL UNIQUE,
  chart_label TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE chart_visibility ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read chart_visibility" ON chart_visibility;
CREATE POLICY "Authenticated users can read chart_visibility"
  ON chart_visibility FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Super admin can manage chart_visibility" ON chart_visibility;
CREATE POLICY "Super admin can manage chart_visibility"
  ON chart_visibility FOR INSERT
  WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Super admin can update chart_visibility" ON chart_visibility;
CREATE POLICY "Super admin can update chart_visibility"
  ON chart_visibility FOR UPDATE
  USING (public.is_super_admin());

-- SEED: default page permissions for staff
INSERT INTO page_permissions (role, page_key, is_allowed) VALUES
  ('staff', 'dashboard', true),
  ('staff', 'applications', true),
  ('staff', 'companies', true),
  ('staff', 'banks', true),
  ('staff', 'reports', true),
  ('staff', 'bos_review', true),
  ('staff', 'settings', false)
ON CONFLICT (role, page_key) DO NOTHING;

-- SEED: default chart visibility
INSERT INTO chart_visibility (chart_key, chart_label, is_visible) VALUES
  ('chart-status-donut', 'Application Status', true),
  ('chart-bank-bar', 'Applications by Bank', true),
  ('chart-company-hbar', 'Top 10 Companies — Requested vs Approved', true),
  ('chart-decline-bar', 'Decline Reasons', true)
ON CONFLICT (chart_key) DO NOTHING;
