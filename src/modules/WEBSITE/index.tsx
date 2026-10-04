import { useState } from "react";
import { ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ModuleUIProps } from "@/modules/registry";

const PAGES = [
  { label: "Accueil", href: "/site" },
  { label: "À propos", href: "/site/a-propos" },
  { label: "Services", href: "/site/services" },
  { label: "Réalisations", href: "/site/realisations" },
  { label: "SaaS", href: "/site/saas" },
  { label: "Blog", href: "/site/blog" },
  { label: "Contact", href: "/site/contact" },
  { label: "Panier", href: "/site/panier" },
];

/** FRONT OFFICE module: opens the WEBSITE pages inside the Core; also served standalone at /site. */
export default function WebsiteModule(_props: ModuleUIProps) {
  const [path, setPath] = useState("/site");
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Globe className="h-4 w-4 text-primary" />
        {PAGES.map((p) => (
          <Button key={p.href} size="sm" variant={path === p.href ? "default" : "outline"} onClick={() => setPath(p.href)}>
            {p.label}
          </Button>
        ))}
        <Button asChild size="sm" variant="ghost" className="ml-auto">
          <a href={path} target="_blank" rel="noreferrer">
            <ExternalLink /> Ouvrir le site
          </a>
        </Button>
      </div>
      <iframe key={path} title="Front office" src={path} className="h-[75vh] w-full rounded-lg border border-border bg-background" />
    </div>
  );
}
