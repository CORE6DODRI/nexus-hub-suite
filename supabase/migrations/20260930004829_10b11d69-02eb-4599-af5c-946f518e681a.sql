-- Company + subscription
INSERT INTO public.company (name) VALUES ('DODRICOM');
INSERT INTO public.subscriptions (company_id, plan, start_date, end_date, status)
SELECT id, 'ANNUAL', CURRENT_DATE, CURRENT_DATE + interval '12 months', 'ACTIVE' FROM public.company;

-- Roles
INSERT INTO public.roles (name, slug, description, is_system) VALUES
  ('Super Admin','super-admin','Full platform access',true),
  ('Administrator','admin','Administration and modules',true),
  ('Manager','manager','Business operations',false),
  ('Viewer','viewer','Read-only access',true);

-- Permissions
INSERT INTO public.permissions (code, group_name, description) VALUES
  ('users.view','Users','View users'),
  ('users.create','Users','Create users'),
  ('users.edit','Users','Edit users'),
  ('roles.manage','Access','Manage roles'),
  ('permissions.manage','Access','Manage permissions'),
  ('modules.install','Modules','Install modules'),
  ('modules.configure','Modules','Configure modules'),
  ('connections.view','Modules','View connections'),
  ('connections.edit','Modules','Edit connections'),
  ('logs.view','System','View activity logs'),
  ('settings.manage','System','Manage settings'),
  ('company.manage','Company','Manage company'),
  ('subscription.manage','Company','Manage subscription'),
  ('cms.manage','Website CMS','Manage website content'),
  ('crm.manage','Commercial CRM','Manage contacts and deals'),
  ('finance.manage','Finance','Manage invoices and treasury'),
  ('messages.manage','Messages','Manage conversations');

INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p WHERE r.slug IN ('super-admin','admin');
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p
WHERE r.slug='manager' AND p.code IN ('users.view','logs.view','cms.manage','crm.manage','finance.manage','messages.manage','connections.view');
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r CROSS JOIN public.permissions p WHERE r.slug='viewer' AND p.code IN ('users.view');

-- Modules registry
INSERT INTO public.modules (name, slug, description, icon, version, route, status, enabled) VALUES
  ('WEBSITE CMS','cms','Front office website content management','Globe','1.0.0','/cms','active',true),
  ('COMMERCIAL CRM','crm','Contacts, leads, deals and pipeline','Handshake','1.0.0',NULL,'active',true),
  ('FINANCE','finance','Invoices, expenses and treasury','Wallet','1.0.0',NULL,'active',true),
  ('MESSAGE','message','Internal conversations and website inbox','MessageSquare','1.0.0',NULL,'active',true);

INSERT INTO public.module_connections (source_module_id, target_module_id, connection_type, status)
SELECT m.id, NULL, 'module_to_core', 'active' FROM public.modules m;
INSERT INTO public.module_connections (source_module_id, target_module_id, connection_type, status)
SELECT a.id, b.id, 'module_to_module', 'active' FROM public.modules a, public.modules b
WHERE (a.slug,b.slug) IN (('cms','crm'),('cms','message'),('crm','finance'));

-- ============ WEBSITE CMS ============
CREATE TABLE public.cms_pages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text NOT NULL UNIQUE, title text NOT NULL, nav_label text, description text, published boolean NOT NULL DEFAULT true, sort_order int NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_pages TO authenticated; GRANT SELECT ON public.cms_pages TO anon; GRANT ALL ON public.cms_pages TO service_role;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY cms_pages_public_read ON public.cms_pages FOR SELECT TO anon USING (published);
CREATE POLICY cms_pages_read ON public.cms_pages FOR SELECT TO authenticated USING (true);
CREATE POLICY cms_pages_write ON public.cms_pages FOR ALL TO authenticated USING (public.has_permission(auth.uid(),'cms.manage')) WITH CHECK (public.has_permission(auth.uid(),'cms.manage'));
CREATE TRIGGER cms_pages_updated_at BEFORE UPDATE ON public.cms_pages FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.cms_sections (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), page_id uuid NOT NULL REFERENCES public.cms_pages(id) ON DELETE CASCADE, kind text NOT NULL DEFAULT 'text', title text, subtitle text, body text, image_url text, cta_label text, cta_href text, sort_order int NOT NULL DEFAULT 0, published boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_sections TO authenticated; GRANT SELECT ON public.cms_sections TO anon; GRANT ALL ON public.cms_sections TO service_role;
ALTER TABLE public.cms_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY cms_sections_public_read ON public.cms_sections FOR SELECT TO anon USING (published);
CREATE POLICY cms_sections_read ON public.cms_sections FOR SELECT TO authenticated USING (true);
CREATE POLICY cms_sections_write ON public.cms_sections FOR ALL TO authenticated USING (public.has_permission(auth.uid(),'cms.manage')) WITH CHECK (public.has_permission(auth.uid(),'cms.manage'));
CREATE TRIGGER cms_sections_updated_at BEFORE UPDATE ON public.cms_sections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ COMMERCIAL CRM ============
CREATE TABLE public.crm_contacts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), full_name text NOT NULL, company_name text, email text, phone text, city text, source text NOT NULL DEFAULT 'manual', status text NOT NULL DEFAULT 'lead', notes text, owner_id uuid, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_contacts TO authenticated; GRANT INSERT ON public.crm_contacts TO anon; GRANT ALL ON public.crm_contacts TO service_role;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY crm_contacts_public_insert ON public.crm_contacts FOR INSERT TO anon WITH CHECK (source = 'website' AND status = 'lead');
CREATE POLICY crm_contacts_read ON public.crm_contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY crm_contacts_write ON public.crm_contacts FOR ALL TO authenticated USING (public.has_permission(auth.uid(),'crm.manage')) WITH CHECK (public.has_permission(auth.uid(),'crm.manage'));
CREATE TRIGGER crm_contacts_updated_at BEFORE UPDATE ON public.crm_contacts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.crm_deals (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), contact_id uuid REFERENCES public.crm_contacts(id) ON DELETE SET NULL, title text NOT NULL, amount numeric(14,2) NOT NULL DEFAULT 0, currency text NOT NULL DEFAULT 'MAD', stage text NOT NULL DEFAULT 'new', probability int NOT NULL DEFAULT 20, expected_close date, notes text, owner_id uuid, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_deals TO authenticated; GRANT ALL ON public.crm_deals TO service_role;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY crm_deals_read ON public.crm_deals FOR SELECT TO authenticated USING (true);
CREATE POLICY crm_deals_write ON public.crm_deals FOR ALL TO authenticated USING (public.has_permission(auth.uid(),'crm.manage')) WITH CHECK (public.has_permission(auth.uid(),'crm.manage'));
CREATE TRIGGER crm_deals_updated_at BEFORE UPDATE ON public.crm_deals FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.crm_activities (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), contact_id uuid REFERENCES public.crm_contacts(id) ON DELETE CASCADE, deal_id uuid REFERENCES public.crm_deals(id) ON DELETE CASCADE, type text NOT NULL DEFAULT 'note', subject text NOT NULL, details text, due_at timestamptz, done boolean NOT NULL DEFAULT false, created_by uuid, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_activities TO authenticated; GRANT ALL ON public.crm_activities TO service_role;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY crm_activities_read ON public.crm_activities FOR SELECT TO authenticated USING (true);
CREATE POLICY crm_activities_write ON public.crm_activities FOR ALL TO authenticated USING (public.has_permission(auth.uid(),'crm.manage')) WITH CHECK (public.has_permission(auth.uid(),'crm.manage'));
CREATE TRIGGER crm_activities_updated_at BEFORE UPDATE ON public.crm_activities FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============ FINANCE ============
CREATE TABLE public.fin_accounts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, kind text NOT NULL DEFAULT 'bank', currency text NOT NULL DEFAULT 'MAD', opening_balance numeric(14,2) NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fin_accounts TO authenticated; GRANT ALL ON public.fin_accounts TO service_role;
ALTER TABLE public.fin_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY fin_accounts_read ON public.fin_accounts FOR SELECT TO authenticated USING (true);
CREATE POLICY fin_accounts_write ON public.fin_accounts FOR ALL TO authenticated USING (public.has_permission(auth.uid(),'finance.manage')) WITH CHECK (public.has_permission(auth.uid(),'finance.manage'));
CREATE TRIGGER fin_accounts_updated_at BEFORE UPDATE ON public.fin_accounts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fin_invoices (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), number text NOT NULL UNIQUE, direction text NOT NULL DEFAULT 'sale', contact_id uuid REFERENCES public.crm_contacts(id) ON DELETE SET NULL, issue_date date NOT NULL DEFAULT CURRENT_DATE, due_date date, currency text NOT NULL DEFAULT 'MAD', subtotal numeric(14,2) NOT NULL DEFAULT 0, tax_total numeric(14,2) NOT NULL DEFAULT 0, total numeric(14,2) NOT NULL DEFAULT 0, status text NOT NULL DEFAULT 'draft', notes text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fin_invoices TO authenticated; GRANT ALL ON public.fin_invoices TO service_role;
ALTER TABLE public.fin_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY fin_invoices_read ON public.fin_invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY fin_invoices_write ON public.fin_invoices FOR ALL TO authenticated USING (public.has_permission(auth.uid(),'finance.manage')) WITH CHECK (public.has_permission(auth.uid(),'finance.manage'));
CREATE TRIGGER fin_invoices_updated_at BEFORE UPDATE ON public.fin_invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fin_invoice_lines (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), invoice_id uuid NOT NULL REFERENCES public.fin_invoices(id) ON DELETE CASCADE, label text NOT NULL, quantity numeric(12,2) NOT NULL DEFAULT 1, unit_price numeric(14,2) NOT NULL DEFAULT 0, tax_rate numeric(5,2) NOT NULL DEFAULT 20, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fin_invoice_lines TO authenticated; GRANT ALL ON public.fin_invoice_lines TO service_role;
ALTER TABLE public.fin_invoice_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY fin_lines_read ON public.fin_invoice_lines FOR SELECT TO authenticated USING (true);
CREATE POLICY fin_lines_write ON public.fin_invoice_lines FOR ALL TO authenticated USING (public.has_permission(auth.uid(),'finance.manage')) WITH CHECK (public.has_permission(auth.uid(),'finance.manage'));

CREATE TABLE public.fin_expenses (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), label text NOT NULL, category text NOT NULL DEFAULT 'general', supplier text, amount numeric(14,2) NOT NULL DEFAULT 0, tax_rate numeric(5,2) NOT NULL DEFAULT 20, spent_on date NOT NULL DEFAULT CURRENT_DATE, status text NOT NULL DEFAULT 'paid', notes text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fin_expenses TO authenticated; GRANT ALL ON public.fin_expenses TO service_role;
ALTER TABLE public.fin_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY fin_expenses_read ON public.fin_expenses FOR SELECT TO authenticated USING (true);
CREATE POLICY fin_expenses_write ON public.fin_expenses FOR ALL TO authenticated USING (public.has_permission(auth.uid(),'finance.manage')) WITH CHECK (public.has_permission(auth.uid(),'finance.manage'));
CREATE TRIGGER fin_expenses_updated_at BEFORE UPDATE ON public.fin_expenses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fin_transactions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), account_id uuid REFERENCES public.fin_accounts(id) ON DELETE SET NULL, invoice_id uuid REFERENCES public.fin_invoices(id) ON DELETE SET NULL, label text NOT NULL, direction text NOT NULL DEFAULT 'in', amount numeric(14,2) NOT NULL DEFAULT 0, happened_on date NOT NULL DEFAULT CURRENT_DATE, method text NOT NULL DEFAULT 'transfer', created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fin_transactions TO authenticated; GRANT ALL ON public.fin_transactions TO service_role;
ALTER TABLE public.fin_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY fin_tx_read ON public.fin_transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY fin_tx_write ON public.fin_transactions FOR ALL TO authenticated USING (public.has_permission(auth.uid(),'finance.manage')) WITH CHECK (public.has_permission(auth.uid(),'finance.manage'));

-- ============ MESSAGE ============
CREATE TABLE public.msg_threads (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), subject text NOT NULL, kind text NOT NULL DEFAULT 'internal', created_by uuid, contact_id uuid REFERENCES public.crm_contacts(id) ON DELETE SET NULL, status text NOT NULL DEFAULT 'open', last_message_at timestamptz NOT NULL DEFAULT now(), created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.msg_threads TO authenticated; GRANT ALL ON public.msg_threads TO service_role;
ALTER TABLE public.msg_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY msg_threads_read ON public.msg_threads FOR SELECT TO authenticated USING (true);
CREATE POLICY msg_threads_write ON public.msg_threads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER msg_threads_updated_at BEFORE UPDATE ON public.msg_threads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.msg_messages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), thread_id uuid NOT NULL REFERENCES public.msg_threads(id) ON DELETE CASCADE, sender_id uuid, sender_label text, body text NOT NULL, read_at timestamptz, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.msg_messages TO authenticated; GRANT ALL ON public.msg_messages TO service_role;
ALTER TABLE public.msg_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY msg_messages_read ON public.msg_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY msg_messages_write ON public.msg_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.msg_inbox (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), full_name text NOT NULL, email text, phone text, subject text, body text NOT NULL, source text NOT NULL DEFAULT 'website', status text NOT NULL DEFAULT 'new', contact_id uuid REFERENCES public.crm_contacts(id) ON DELETE SET NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT, INSERT, UPDATE, DELETE ON public.msg_inbox TO authenticated; GRANT INSERT ON public.msg_inbox TO anon; GRANT ALL ON public.msg_inbox TO service_role;
ALTER TABLE public.msg_inbox ENABLE ROW LEVEL SECURITY;
CREATE POLICY msg_inbox_public_insert ON public.msg_inbox FOR INSERT TO anon WITH CHECK (source = 'website' AND status = 'new');
CREATE POLICY msg_inbox_read ON public.msg_inbox FOR SELECT TO authenticated USING (true);
CREATE POLICY msg_inbox_write ON public.msg_inbox FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER msg_inbox_updated_at BEFORE UPDATE ON public.msg_inbox FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Module permissions registry
INSERT INTO public.module_permissions (module_id, code, description)
SELECT m.id, m.slug || '.manage', 'Manage ' || m.name FROM public.modules m;

-- Website content seed
INSERT INTO public.cms_pages (slug, title, nav_label, description, sort_order) VALUES
  ('home','DODRICOM — Solutions digitales et technologiques','Accueil','Agence technologique: web, réseaux, domotique et intelligence artificielle.',1),
  ('services','Nos services','Services','Web, communication, réseaux, domotique, événementiel et IA.',2),
  ('a-propos','À propos de DODRICOM','À propos','Notre mission, notre équipe et notre méthode de travail.',3),
  ('contact','Contact','Contact','Parlons de votre projet: écrivez-nous ou demandez un devis.',4);

INSERT INTO public.cms_sections (page_id, kind, title, subtitle, body, cta_label, cta_href, sort_order)
SELECT id,'hero','Construisons votre avenir digital','Web · Réseaux · Domotique · IA','DODRICOM accompagne les entreprises marocaines dans leur transformation digitale, de la stratégie à l''exploitation.','Demander un devis','/contact',1 FROM public.cms_pages WHERE slug='home';
INSERT INTO public.cms_sections (page_id, kind, title, body, sort_order)
SELECT id,'feature','Développement web','Sites vitrines, plateformes métier et applications sur mesure.',2 FROM public.cms_pages WHERE slug='home';
INSERT INTO public.cms_sections (page_id, kind, title, body, sort_order)
SELECT id,'feature','Réseaux & infrastructure','Câblage, WiFi 6, baies techniques, vidéosurveillance.',3 FROM public.cms_pages WHERE slug='home';
INSERT INTO public.cms_sections (page_id, kind, title, body, sort_order)
SELECT id,'feature','Domotique & IA','Bâtiments intelligents et agents IA au service de vos équipes.',4 FROM public.cms_pages WHERE slug='home';
INSERT INTO public.cms_sections (page_id, kind, title, subtitle, body, sort_order)
SELECT id,'hero','Nos services','Une équipe, six expertises','Du conseil à la maintenance, nous couvrons toute la chaîne technologique.',1 FROM public.cms_pages WHERE slug='services';
INSERT INTO public.cms_sections (page_id, kind, title, body, sort_order)
SELECT id,'feature','Communication & branding','Identité visuelle, print, signalétique et campagnes.',2 FROM public.cms_pages WHERE slug='services';
INSERT INTO public.cms_sections (page_id, kind, title, body, sort_order)
SELECT id,'feature','Événementiel','Écrans LED, régie technique et couverture des événements.',3 FROM public.cms_pages WHERE slug='services';
INSERT INTO public.cms_sections (page_id, kind, title, subtitle, body, sort_order)
SELECT id,'hero','À propos','Une équipe proche de ses clients','Nous réunissons développeurs, intégrateurs réseaux et créatifs autour d''un objectif: des solutions qui durent.',1 FROM public.cms_pages WHERE slug='a-propos';
INSERT INTO public.cms_sections (page_id, kind, title, subtitle, body, sort_order)
SELECT id,'hero','Contact','Parlons de votre projet','Remplissez le formulaire: votre demande arrive directement dans notre CRM et notre messagerie.',1 FROM public.cms_pages WHERE slug='contact';

-- Finance seed
INSERT INTO public.fin_accounts (name, kind, opening_balance) VALUES ('Compte bancaire principal','bank',120000),('Caisse','cash',8500);