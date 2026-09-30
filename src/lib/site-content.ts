import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Public (front-office) reads of the WEBSITE CMS module content. */

export type SitePage = {
  id: string;
  slug: string;
  title: string;
  nav_label: string | null;
  description: string | null;
  sort_order: number;
};

export type SiteSection = {
  id: string;
  page_id: string;
  kind: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_href: string | null;
  sort_order: number;
};

export function useSiteNav() {
  return useQuery({
    queryKey: ["site", "nav"],
    queryFn: async (): Promise<SitePage[]> => {
      const { data, error } = await supabase
        .from("cms_pages")
        .select("id, slug, title, nav_label, description, sort_order")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useSitePage(slug: string) {
  return useQuery({
    queryKey: ["site", "page", slug],
    queryFn: async () => {
      const { data: page, error } = await supabase
        .from("cms_pages")
        .select("id, slug, title, nav_label, description, sort_order")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      if (!page) return { page: null, sections: [] as SiteSection[] };

      const { data: sections, error: sectionsError } = await supabase
        .from("cms_sections")
        .select("id, page_id, kind, title, subtitle, body, image_url, cta_label, cta_href, sort_order")
        .eq("page_id", page.id)
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (sectionsError) throw sectionsError;

      return { page: page as SitePage, sections: (sections ?? []) as SiteSection[] };
    },
  });
}

export type LeadInput = {
  full_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  subject?: string;
  message: string;
};

/**
 * A website enquiry becomes both a CRM lead and a MESSAGE inbox entry,
 * which is how the front-office feeds the back-office modules.
 */
export function useSubmitLead() {
  return useMutation({
    mutationFn: async (input: LeadInput) => {
      const { data: contact, error: contactError } = await supabase
        .from("crm_contacts")
        .insert({
          full_name: input.full_name,
          email: input.email,
          phone: input.phone || null,
          company_name: input.company_name || null,
          source: "website",
          status: "lead",
          notes: input.message,
        })
        .select("id")
        .maybeSingle();
      if (contactError) throw contactError;

      const { error: inboxError } = await supabase.from("msg_inbox").insert({
        full_name: input.full_name,
        email: input.email,
        phone: input.phone || null,
        subject: input.subject || "Demande depuis le site web",
        body: input.message,
        source: "website",
        status: "new",
        contact_id: contact?.id ?? null,
      });
      if (inboxError) throw inboxError;
    },
  });
}
