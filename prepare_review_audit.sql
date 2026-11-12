-- Prerequisites for an existing Facilities database. No application data is seeded or deleted.
BEGIN;
DO $$
BEGIN
  IF to_regclass('public.applications') IS NULL THEN
    RAISE EXCEPTION 'Facilities applications table is missing. Open the Supabase project used by this app before running this installer.';
  END IF;
  IF (SELECT count(*) FROM auth.users WHERE lower(email) = 'muhdsyakir01@gmail.com') <> 1 THEN
    RAISE EXCEPTION 'Expected one registered Auth user with email muhdsyakir01@gmail.com. Check Authentication > Users in the app Supabase project first.';
  END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('super_admin', 'staff')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.page_permissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('super_admin', 'staff')),
  page_key text NOT NULL,
  is_allowed boolean DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  UNIQUE (role, page_key)
);

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin');
$$;

INSERT INTO public.profiles(id, email, role)
SELECT id, email, 'staff' FROM auth.users
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.profiles(id, email, role)
SELECT id, email, 'super_admin' FROM auth.users WHERE lower(email) = 'muhdsyakir01@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'super_admin', email = EXCLUDED.email, updated_at = now();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_permissions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.profiles, public.page_permissions TO authenticated;

DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.profiles;
CREATE POLICY "Authenticated users can read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid() AND role = 'staff');
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admin can update any profile" ON public.profiles;
CREATE POLICY "Super admin can update any profile" ON public.profiles FOR UPDATE TO authenticated
  USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Authenticated users can read page_permissions" ON public.page_permissions;
CREATE POLICY "Authenticated users can read page_permissions" ON public.page_permissions FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Super admin can insert page_permissions" ON public.page_permissions;
CREATE POLICY "Super admin can insert page_permissions" ON public.page_permissions FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin());
DROP POLICY IF EXISTS "Super admin can update page_permissions" ON public.page_permissions;
CREATE POLICY "Super admin can update page_permissions" ON public.page_permissions FOR UPDATE TO authenticated
  USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

INSERT INTO public.page_permissions(role, page_key, is_allowed) VALUES
  ('staff', 'dashboard', true), ('staff', 'applications', true), ('staff', 'companies', true),
  ('staff', 'banks', true), ('staff', 'reports', true), ('staff', 'collateral', true),
  ('staff', 'bos_review', false), ('staff', 'review_history', false),
  ('staff', 'audit_trail', false), ('staff', 'settings', false)
ON CONFLICT (role, page_key) DO NOTHING;
COMMIT;
