import { useState } from "react";
import { ExternalLink, FileText, Globe, LayoutTemplate } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ModuleHeader, Pill, StatGrid } from "@/components/modules/ModuleKit";
import { CrudPanel } from "@/components/modules/CrudPanel";
import { shortDate, useRows } from "@/lib/modules/db";
import type { ModuleUIProps } from "@/modules/registry";

type Page = {
  id: string;
  slug: string;
  title: string;
  nav_label: string | null;
  description: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
};
type Section = {
  id: string;
  page_id: string;
  kind: string;
  title: string | null;
  subtitle: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

const SECTION_KINDS = ["hero", "text", "features", "grid", "image", "cta"];

export default function CmsModuleUI({ name, version }: ModuleUIProps) {
  const pages = useRows<Page>("cms_pages", { orderBy: "sort_order", ascending: true });
  const sections = useRows<Section>("cms_sections", { orderBy: "sort_order", ascending: true });
  const [pageId, setPageId] = useState<string>("");

  const pageList = pages.data ?? [];
  const selected = pageId || pageList[0]?.id || "";
  const pageSections = (sections.data ?? []).filter((section) => section.page_id === selected);

  return (
    <div className="space-y-4">
      <ModuleHeader
        eyebrow="Module site web"
        title={`${name} workspace`}
        description={`Pages, sections et publication du front-office · v${version}`}
        actions={
          <Button asChild size="sm" variant="outline">
            <Link to="/cms">
              <ExternalLink className="mr-1.5 h-4 w-4" /> Voir le site
            </Link>
          </Button>
        }
      />

      <StatGrid
        items={[
          { label: "Pages", value: pageList.length, icon: FileText, hint: `${pageList.filter((p) => p.published).length} publiées` },
          { label: "Sections", value: (sections.data ?? []).length, icon: LayoutTemplate },
          { label: "Front-office", value: "/cms", icon: Globe, hint: "Navigation générée automatiquement" },
        ]}
      />

      <CrudPanel<Page>
        table="cms_pages"
        title="Pages du site"
        orderBy="sort_order"
        ascending
        fields={[
          { name: "slug", label: "Slug (URL)", required: true, placeholder: "home, services, contact" },
          { name: "title", label: "Titre", required: true },
          { name: "nav_label", label: "Libellé menu" },
          { name: "description", label: "Description (SEO)", type: "textarea" },
          { name: "sort_order", label: "Ordre", type: "number", defaultValue: 0 },
          { name: "published", label: "Publiée", type: "checkbox", defaultValue: true },
        ]}
        columns={[
          { header: "Titre", render: (row) => <span className="font-medium">{row.title}</span> },
          { header: "URL", render: (row) => <code className="font-mono text-[11px]">/cms/{row.slug}</code> },
          { header: "Menu", render: (row) => row.nav_label ?? "—" },
          { header: "Ordre", render: (row) => row.sort_order },
          { header: "État", render: (row) => <Pill label={row.published ? "publiée" : "brouillon"} /> },
          { header: "Créée", render: (row) => shortDate(row.created_at) },
        ]}
      />

      <div className="rounded-md border border-border/80 bg-card/60 p-3">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="label-tech">Sections de la page</span>
          <select
            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
            value={selected}
            onChange={(event) => setPageId(event.target.value)}
          >
            {pageList.map((page) => (
              <option key={page.id} value={page.id}>
                {page.title}
              </option>
            ))}
          </select>
        </div>

        {selected ? (
          <CrudPanel<Section>
            table="cms_sections"
            title={`Sections (${pageSections.length})`}
            orderBy="sort_order"
            ascending
            extraDefaults={{ page_id: selected }}
            fields={[
              { name: "kind", label: "Type de section", type: "select", options: SECTION_KINDS, defaultValue: "text" },
              { name: "title", label: "Titre" },
              { name: "subtitle", label: "Sur-titre" },
              {
                name: "body",
                label: "Contenu (features : une ligne par carte « Titre | description »)",
                type: "textarea",
              },
              { name: "image_url", label: "Image (URL)" },
              { name: "cta_label", label: "Bouton — libellé" },
              { name: "cta_href", label: "Bouton — lien" },
              { name: "sort_order", label: "Ordre", type: "number", defaultValue: 0 },
              { name: "published", label: "Publiée", type: "checkbox", defaultValue: true },
            ]}
            columns={[
              { header: "Type", render: (row) => <Pill label={row.kind} /> },
              { header: "Titre", render: (row) => <span className="font-medium">{row.title ?? "—"}</span> },
              { header: "Sur-titre", render: (row) => row.subtitle ?? "—" },
              { header: "Ordre", render: (row) => row.sort_order },
              { header: "État", render: (row) => <Pill label={row.published ? "publiée" : "brouillon"} /> },
            ]}
          />
        ) : (
          <p className="text-xs text-muted-foreground">Créez d'abord une page.</p>
        )}
      </div>
    </div>
  );
}
