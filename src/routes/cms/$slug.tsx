import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { SectionRenderer } from "@/components/site/SectionRenderer";
import { useSitePage } from "@/lib/site-content";

export const Route = createFileRoute("/cms/$slug")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "DODRICOM — Page" },
      { name: "description", content: "Page publiée depuis le module WEBSITE CMS de DODRICOM." },
      { property: "og:title", content: "DODRICOM — Page" },
      { property: "og:description", content: "Page publiée depuis le module WEBSITE CMS de DODRICOM." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SitePage,
});

function SitePage() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useSitePage(slug);

  return (
    <SiteLayout>
      {isLoading ? (
        <div className="px-4 py-24 text-center text-sm text-muted-foreground">Chargement…</div>
      ) : data?.page ? (
        <>
          <section className="border-b border-border/60 px-4 py-10">
            <div className="mx-auto max-w-4xl">
              <h1 className="font-display text-3xl font-bold tracking-tight">{data.page.title}</h1>
              {data.page.description ? (
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{data.page.description}</p>
              ) : null}
            </div>
          </section>
          {data.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </>
      ) : (
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="font-display text-2xl font-bold">Page introuvable</h1>
          <p className="mt-2 text-sm text-muted-foreground">Cette page n'existe pas ou n'est pas publiée.</p>
          <Link to="/cms" className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Retour à l'accueil
          </Link>
        </div>
      )}
    </SiteLayout>
  );
}
