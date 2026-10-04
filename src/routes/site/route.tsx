import { createFileRoute, Outlet } from "@tanstack/react-router";
import appCss from "@website/styles.css?url";
import { AuthProvider } from "@website/lib/auth";
import { SiteTextProvider } from "@website/lib/site-text-context";
import { CartProvider } from "@website/lib/cart";

/** FRONT OFFICE: the WEBSITE module (src/modules/WEBSITE) served at /site. */
export const Route = createFileRoute("/site")({
  head: () => ({
    meta: [
      { title: "DODRICOM — Entrez dans le siège de l'innovation" },
      { name: "description", content: "Découvrez les solutions DODRICOM : Domotique, Digital, Réseaux, IA, COM et Événementiel." },
      { property: "og:title", content: "DODRICOM — Entrez dans le siège de l'innovation" },
      { property: "og:description", content: "Découvrez les solutions DODRICOM : Domotique, Digital, Réseaux, IA, COM et Événementiel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" },
    ],
  }),
  component: SiteRoot,
});

function SiteRoot() {
  return (
    <AuthProvider>
      <SiteTextProvider>
        <CartProvider>
          <div className="website-root min-h-screen">
            <Outlet />
          </div>
        </CartProvider>
      </SiteTextProvider>
    </AuthProvider>
  );
}
