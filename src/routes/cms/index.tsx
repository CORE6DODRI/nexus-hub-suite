import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionRenderer } from "@/components/site/SectionRenderer";
import { useSitePage } from "@/lib/site-content";

export const Route = createFileRoute("/cms/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "DODRICOM — Solutions digitales pour votre entreprise" },
      {
        name: "description",
        content:
          "Site officiel DODRICOM : nos services, notre approche et un formulaire de contact relié directement à nos équipes.",
      },
      { property: "og:title", content: "DODRICOM — Solutions digitales pour votre entreprise" },
      {
        property: "og:description",
        content: "Découvrez les services DODRICOM et contactez nos équipes en quelques secondes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SiteHome,
});

function SiteHome() {
  const { data, isLoading } = useSitePage("home");

  return (
    <SiteLayout>
      {isLoading ? (
        <div className="px-4 py-24 text-center text-sm text-muted-foreground">Chargement du contenu…</div>
      ) : data?.page ? (
        data.sections.map((section) => <SectionRenderer key={section.id} section={section} />)
      ) : (
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-bold">Le site n'a pas encore de contenu</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Créez une page avec le slug « home » dans le module WEBSITE CMS pour afficher cette page d'accueil.
          </p>
          <Link
            to="/backdoor"
            className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Espace de gestion
          </Link>
        </div>
      )}
    </SiteLayout>
  );
}
