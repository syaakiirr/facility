-- Allow super admins to create profile rows for users they add from the Users page.
-- Run this in the Supabase SQL editor.

DROP POLICY IF EXISTS "Super admin can insert any profile" ON profiles;
CREATE POLICY "Super admin can insert any profile"
  ON profiles FOR INSERT
  WITH CHECK (public.is_super_admin());
