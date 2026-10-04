import { useState } from "react";
import { ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ModuleUIProps } from "@/modules/registry";

const PAGES = [
  { label: "Accueil", href: "/" },
  { label: "À propos", href: "/a-propos" },
  { label: "Services", href: "/services" },
  { label: "Réalisations", href: "/realisations" },
  { label: "SaaS", href: "/saas" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Panier", href: "/panier" },
];

/** FRONT OFFICE module: opens the WEBSITE pages inside the Core; also served standalone at /site. */
export default function WebsiteModule(_props: ModuleUIProps) {
  const [path, setPath] = useState("/");
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
