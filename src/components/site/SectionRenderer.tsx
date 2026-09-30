import { ArrowRight } from "lucide-react";
import type { SiteSection } from "@/lib/site-content";

/** Renders one CMS section according to its `kind`. */
export function SectionRenderer({ section }: { section: SiteSection }) {
  const cta =
    section.cta_label && section.cta_href ? (
      <a
        href={section.cta_href}
        className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {section.cta_label} <ArrowRight className="h-4 w-4" />
      </a>
    ) : null;

  if (section.kind === "hero") {
    return (
      <section className="relative overflow-hidden border-b border-border/60 px-4 py-16 md:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{ background: "var(--gradient-brand)" }}
        />
        <div className="relative mx-auto max-w-4xl text-center">
          {section.subtitle ? <div className="label-tech justify-center">{section.subtitle}</div> : null}
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-5xl">{section.title}</h1>
          {section.body ? (
            <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">{section.body}</p>
          ) : null}
          {cta}
          {section.image_url ? (
            <img
              src={section.image_url}
              alt={section.title ?? ""}
              className="mx-auto mt-10 w-full max-w-3xl rounded-xl border border-border/60 object-cover"
            />
          ) : null}
        </div>
      </section>
    );
  }

  if (section.kind === "features" || section.kind === "grid") {
    const items = (section.body ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [title, ...rest] = line.split("|");
        return { title: (title ?? "").trim(), description: rest.join("|").trim() };
      });

    return (
      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <SectionHeading title={section.title} subtitle={section.subtitle} />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item.title} className="rounded-lg border border-border/70 bg-card/70 p-5">
                <h3 className="font-display text-sm font-bold">{item.title}</h3>
                {item.description ? (
                  <p className="mt-1.5 text-xs text-muted-foreground">{item.description}</p>
                ) : null}
              </div>
            ))}
          </div>
          {cta}
        </div>
      </section>
    );
  }

  if (section.kind === "cta") {
    return (
      <section className="px-4 py-12">
        <div className="mx-auto max-w-4xl rounded-xl border border-border/70 bg-card/80 p-8 text-center">
          <h2 className="font-display text-xl font-bold">{section.title}</h2>
          {section.body ? <p className="mt-2 text-sm text-muted-foreground">{section.body}</p> : null}
          {cta}
        </div>
      </section>
    );
  }

  if (section.kind === "image") {
    return (
      <section className="px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <SectionHeading title={section.title} subtitle={section.subtitle} />
          {section.image_url ? (
            <img
              src={section.image_url}
              alt={section.title ?? ""}
              className="mt-5 w-full rounded-xl border border-border/60 object-cover"
            />
          ) : null}
          {section.body ? <p className="mt-4 text-sm text-muted-foreground">{section.body}</p> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <SectionHeading title={section.title} subtitle={section.subtitle} />
        {section.body ? (
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            {section.body.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        ) : null}
        {cta}
      </div>
    </section>
  );
}

function SectionHeading({ title, subtitle }: { title: string | null; subtitle: string | null }) {
  if (!title && !subtitle) return null;
  return (
    <div>
      {subtitle ? <div className="label-tech">{subtitle}</div> : null}
      {title ? <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">{title}</h2> : null}
    </div>
  );
}
