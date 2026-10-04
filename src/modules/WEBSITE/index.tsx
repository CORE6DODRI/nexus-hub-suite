import { useState } from "react";
import { ExternalLink, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteNav } from "@/lib/site-content";
import type { ModuleUIProps } from "@/modules/registry";

/** WEBSITE module: live preview of the public front office inside the Core. */
export default function WebsiteModule(_props: ModuleUIProps) {
  const nav = useSiteNav();
  const [path, setPath] = useState("/site");
  const pages = [
    { label: "Accueil", href: "/site" },
    ...(nav.data ?? [])
      .filter((p) => p.slug !== "home")
      .map((p) => ({ label: p.nav_label || p.title, href: `/cms/${p.slug}` })),
    { label: "Contact", href: "/cms/contact" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Globe className="h-4 w-4 text-primary" />
        {pages.map((p) => (
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
      <iframe title="Front office" src={path} className="h-[70vh] w-full rounded-lg border border-border bg-background" />
    </div>
  );
}
