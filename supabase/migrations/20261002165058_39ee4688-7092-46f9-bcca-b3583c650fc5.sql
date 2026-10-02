INSERT INTO public.permissions(code,group_name,description) VALUES ('commercial.manage','Commercial','Manage catalog and inventory') ON CONFLICT (code) DO NOTHING;
INSERT INTO public.role_permissions(role_id,permission_id) SELECT r.id,p.id FROM public.roles r, public.permissions p WHERE r.slug IN ('super-admin','admin') AND p.code='commercial.manage' ON CONFLICT DO NOTHING;
INSERT INTO public.modules(name,slug,description,icon,version,route,status,enabled) VALUES ('Commercial','commercial','Catalogue et inventaire','Package','1.0.0','/modules/commercial','active',true) ON CONFLICT (slug) DO NOTHING;

CREATE TABLE public.com_catalog(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), designation text NOT NULL, prix numeric NOT NULL DEFAULT 0, famille text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.com_inventory(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), designation text NOT NULL, quantite numeric NOT NULL DEFAULT 0, famille text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.crm_products(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), produit text NOT NULL, quantite numeric NOT NULL DEFAULT 0, prix numeric NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.module_field_mappings(id uuid PRIMARY KEY DEFAULT gen_random_uuid(), target_module text NOT NULL, target_table text NOT NULL, target_column text NOT NULL, source_module text NOT NULL, source_table text NOT NULL, source_column text NOT NULL, cond_target_column text, cond_source_column text, enabled boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), UNIQUE(target_table,target_column));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.com_catalog, public.com_inventory, public.crm_products, public.module_field_mappings TO authenticated;
GRANT ALL ON public.com_catalog, public.com_inventory, public.crm_products, public.module_field_mappings TO service_role;

ALTER TABLE public.com_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.com_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_field_mappings ENABLE ROW LEVEL SECURITY;

CREATE POLICY com_catalog_read ON public.com_catalog FOR SELECT TO authenticated USING (true);
CREATE POLICY com_catalog_write ON public.com_catalog FOR ALL TO authenticated USING (public.has_permission(auth.uid(),'commercial.manage')) WITH CHECK (public.has_permission(auth.uid(),'commercial.manage'));
CREATE POLICY com_inventory_read ON public.com_inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY com_inventory_write ON public.com_inventory FOR ALL TO authenticated USING (public.has_permission(auth.uid(),'commercial.manage')) WITH CHECK (public.has_permission(auth.uid(),'commercial.manage'));
CREATE POLICY crm_products_read ON public.crm_products FOR SELECT TO authenticated USING (true);
CREATE POLICY crm_products_write ON public.crm_products FOR ALL TO authenticated USING (public.has_permission(auth.uid(),'crm.manage')) WITH CHECK (public.has_permission(auth.uid(),'crm.manage'));
CREATE POLICY mfm_read ON public.module_field_mappings FOR SELECT TO authenticated USING (true);
CREATE POLICY mfm_write ON public.module_field_mappings FOR ALL TO authenticated USING (public.has_role_slug(auth.uid(),'super-admin') OR public.has_permission(auth.uid(),'connections.create')) WITH CHECK (public.has_role_slug(auth.uid(),'super-admin') OR public.has_permission(auth.uid(),'connections.create'));

CREATE TRIGGER com_catalog_updated_at BEFORE UPDATE ON public.com_catalog FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER com_inventory_updated_at BEFORE UPDATE ON public.com_inventory FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER crm_products_updated_at BEFORE UPDATE ON public.crm_products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER mfm_updated_at BEFORE UPDATE ON public.module_field_mappings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();