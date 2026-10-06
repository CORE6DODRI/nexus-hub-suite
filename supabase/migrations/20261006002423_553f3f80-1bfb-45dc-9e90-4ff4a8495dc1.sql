CREATE TABLE IF NOT EXISTS public.site_settings (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), key text NOT NULL UNIQUE, value jsonb NOT NULL DEFAULT '{}'::jsonb, label text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.site_settings TO anon; GRANT SELECT,INSERT,UPDATE,DELETE ON public.site_settings TO authenticated; GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY site_settings_read ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY site_settings_write ON public.site_settings FOR ALL TO authenticated USING (public.has_permission(auth.uid(),'cms.manage')) WITH CHECK (public.has_permission(auth.uid(),'cms.manage'));

CREATE TABLE IF NOT EXISTS public.pages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text NOT NULL UNIQUE, title text NOT NULL, subtitle text, sort_order integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.pages TO anon; GRANT SELECT,INSERT,UPDATE,DELETE ON public.pages TO authenticated; GRANT ALL ON public.pages TO service_role;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY pages_read ON public.pages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY pages_write ON public.pages FOR ALL TO authenticated USING (public.has_permission(auth.uid(),'cms.manage')) WITH CHECK (public.has_permission(auth.uid(),'cms.manage'));

CREATE TABLE IF NOT EXISTS public.content_texts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), page_slug text NOT NULL, text_key text NOT NULL, value text NOT NULL DEFAULT '', style jsonb NOT NULL DEFAULT '{}'::jsonb, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(page_slug,text_key));
GRANT SELECT ON public.content_texts TO anon; GRANT SELECT,INSERT,UPDATE,DELETE ON public.content_texts TO authenticated; GRANT ALL ON public.content_texts TO service_role;
ALTER TABLE public.content_texts ENABLE ROW LEVEL SECURITY;
CREATE POLICY content_texts_read ON public.content_texts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY content_texts_write ON public.content_texts FOR ALL TO authenticated USING (public.has_permission(auth.uid(),'cms.manage')) WITH CHECK (public.has_permission(auth.uid(),'cms.manage'));

CREATE TABLE IF NOT EXISTS public.content_images (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), page_slug text NOT NULL, image_key text NOT NULL, url text, alt_text text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(page_slug,image_key));
GRANT SELECT ON public.content_images TO anon; GRANT SELECT,INSERT,UPDATE,DELETE ON public.content_images TO authenticated; GRANT ALL ON public.content_images TO service_role;
ALTER TABLE public.content_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY content_images_read ON public.content_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY content_images_write ON public.content_images FOR ALL TO authenticated USING (public.has_permission(auth.uid(),'cms.manage')) WITH CHECK (public.has_permission(auth.uid(),'cms.manage'));

CREATE TABLE IF NOT EXISTS public.partners (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, logo_url text, website_url text, sort_order integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.partners TO anon; GRANT SELECT,INSERT,UPDATE,DELETE ON public.partners TO authenticated; GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY partners_read ON public.partners FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY partners_write ON public.partners FOR ALL TO authenticated USING (public.has_permission(auth.uid(),'cms.manage')) WITH CHECK (public.has_permission(auth.uid(),'cms.manage'));

CREATE POLICY cms_bucket_read ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'cms');
CREATE POLICY cms_bucket_insert ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cms' AND public.has_permission(auth.uid(),'cms.manage'));
CREATE POLICY cms_bucket_update ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'cms' AND public.has_permission(auth.uid(),'cms.manage'));
CREATE POLICY cms_bucket_delete ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'cms' AND public.has_permission(auth.uid(),'cms.manage'));

INSERT INTO public.pages (slug,title,sort_order) VALUES ('accueil','Accueil',0),('services','Services',1),('realisations','Réalisations',2),('saas','SaaS',3),('a-propos','À propos',4),('blog','Blog',5),('contact','Contact',6),('panier','Panier',7) ON CONFLICT (slug) DO NOTHING;