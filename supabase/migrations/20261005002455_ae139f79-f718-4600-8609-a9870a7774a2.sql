CREATE POLICY "company_logos_public_read"
ON storage.objects
FOR SELECT
TO anon
USING (bucket_id = 'company-logos');