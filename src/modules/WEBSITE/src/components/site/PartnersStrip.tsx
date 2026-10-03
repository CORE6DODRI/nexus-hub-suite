

export type PartnerItem = { id: string; name: string; logoUrl: string | null; websiteUrl: string | null };

const STATIC_PARTNERS: PartnerItem[] = [
  { id: "1", name: "Schneider Electric", logoUrl: null, websiteUrl: null },
  { id: "2", name: "Cisco", logoUrl: null, websiteUrl: null },
  { id: "3", name: "Ubiquiti", logoUrl: null, websiteUrl: null },
  { id: "4", name: "KNX Association", logoUrl: null, websiteUrl: null },
  { id: "5", name: "Samsung", logoUrl: null, websiteUrl: null },
  { id: "6", name: "Hikvision", logoUrl: null, websiteUrl: null },
];


/**
 * Bande horizontale de logos partenaires : fond noir, logos monochromes,
 * défilement fluide et continu (pause au survol), piloté par le CMS.
 */
export function PartnersStrip({ className = "" }: { className?: string }) {
  const partners = STATIC_PARTNERS;
  if (partners.length === 0) return null;
  const items = [...partners, ...partners];

  return (
    <section aria-label="Nos partenaires" className={`pointer-events-auto w-full  ${className}`}>
      <div>
        <div className="logo-marquee mx-auto max-w-[1400px] px-4 py-6 sm:py-8">
          <div className="logo-marquee-track flex w-max items-center gap-14 sm:gap-20">
            {items.map((p, i) => (
              <a
                key={`${p.id}-${i}`}
                href={p.websiteUrl ?? undefined}
                target={p.websiteUrl ? "_blank" : undefined}
                rel="noreferrer"
                aria-hidden={i >= partners.length ? true : undefined}
                tabIndex={i >= partners.length ? -1 : undefined}
                className="flex shrink-0 items-center opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                aria-label={p.name}
              >
                {p.logoUrl ? (
                  <img
                    src={p.logoUrl}
                    alt={`Logo ${p.name}`}
                    loading="lazy"
                    className="h-8 w-auto max-w-[160px] object-contain brightness-0 invert sm:h-10"
                  />
                ) : (
                  <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.18em] text-white/85 sm:text-base">
                    {p.name}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
