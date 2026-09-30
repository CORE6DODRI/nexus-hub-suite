import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu } from "lucide-react";
import { useState } from "react";
import { useSiteNav } from "@/lib/site-content";

/** Public website shell: navigation is generated from the WEBSITE CMS pages. */
export function SiteLayout({ children }: { children: ReactNode }) {
  const nav = useSiteNav();
  const [open, setOpen] = useState(false);
  const pages = (nav.data ?? []).filter((page) => page.slug !== "home");

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
          <Link to="/cms" className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-primary-foreground"
              style={{ background: "var(--gradient-brand)" }}
            >
              <span className="font-display text-sm font-bold">D</span>
            </span>
            <span className="font-display font-bold tracking-tight">DODRICOM</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              to="/cms"
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Accueil
            </Link>
            {pages.map((page) => (
              <Link
                key={page.id}
                to="/cms/$slug"
                params={{ slug: page.slug }}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {page.nav_label ?? page.title}
              </Link>
            ))}
            <Link
              to="/cms/contact"
              className="ml-1 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Nous contacter <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>

          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {open ? (
          <div className="border-t border-border/60 px-4 py-2 md:hidden">
            <Link to="/cms" onClick={() => setOpen(false)} className="block py-2 text-sm">
              Accueil
            </Link>
            {pages.map((page) => (
              <Link
                key={page.id}
                to="/cms/$slug"
                params={{ slug: page.slug }}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm"
              >
                {page.nav_label ?? page.title}
              </Link>
            ))}
            <Link to="/cms/contact" onClick={() => setOpen(false)} className="block py-2 text-sm font-medium">
              Nous contacter
            </Link>
          </div>
        ) : null}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} DODRICOM — Site géré par le module WEBSITE CMS.</span>
          <Link to="/login" className="hover:text-foreground">
            Espace de gestion
          </Link>
        </div>
      </footer>
    </div>
  );
}
