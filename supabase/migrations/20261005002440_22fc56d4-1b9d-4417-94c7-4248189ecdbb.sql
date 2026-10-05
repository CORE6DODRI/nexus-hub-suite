GRANT SELECT (login_logo_url, login_logo_size, core_logo_large_url, core_logo_large_size, core_logo_small_url, core_logo_small_size) ON public.company TO anon;
CREATE POLICY "company_branding_public_read"
ON public.company
FOR SELECT
TO anon
USING (true);