-- Inherit existing application access without overwriting explicit attachment permissions.
INSERT INTO public.page_permissions (role, page_key, is_allowed)
SELECT role, 'attachments', is_allowed
FROM public.page_permissions
WHERE page_key = 'applications'
ON CONFLICT (role, page_key) DO NOTHING;
