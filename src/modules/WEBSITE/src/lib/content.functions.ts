// Front-office statique : contenu éditorial local (plus de base de données).

export type ServiceCategoryDTO = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  icon: string | null;
  imageUrl: string | null;
  features: string[];
};

export type ProductDTO = {
  id: string;
  categorySlug: string | null;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  currency: string;
  badge: string | null;
};

export type PackageDTO = {
  id: string;
  categorySlug: string | null;
  slug: string;
  name: string;
  description: string | null;
  price: number | null;
  currency: string;
  billingPeriod: string | null;
  features: string[];
  isPopular: boolean;
  ctaLabel: string | null;
};

export type ProjectDTO = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  coverImageUrl: string | null;
  categorySlug: string | null;
  categoryName: string | null;
  tags: string[];
  client: string | null;
  year: number | null;
};

export type BlogPostDTO = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  category: string | null;
  authorName: string | null;
  readMinutes: number | null;
  publishedAt: string | null;
};

const categories: ServiceCategoryDTO[] = [
  {
    id: "cat-domotique",
    slug: "domotique",
    name: "Domotique",
    tagline: "Votre bâtiment devient intelligent",
    description:
      "Éclairage, sécurité, climatisation et ouvertures pilotés depuis une seule interface. Nous concevons des installations KNX et IoT sur mesure pour villas, hôtels et immeubles tertiaires.",
    icon: null,
    imageUrl: null,
    features: ["Scénarios automatisés", "Contrôle vocal et mobile", "Économies d'énergie", "Sécurité connectée"],
  },
  {
    id: "cat-digital",
    slug: "digital",
    name: "Digital",
    tagline: "Des expériences web qui convertissent",
    description:
      "Sites vitrines, plateformes sur mesure et applications métiers. Design premium, performance et référencement pour transformer vos visiteurs en clients.",
    icon: null,
    imageUrl: null,
    features: ["Sites & apps sur mesure", "Design system premium", "SEO & performance", "Accompagnement continu"],
  },
  {
    id: "cat-reseaux",
    slug: "reseaux",
    name: "Réseaux",
    tagline: "Une infrastructure sans faille",
    description:
      "Câblage structuré, WiFi 6/7 haute densité, baies de brassage et sécurité périmétrique. Nous bâtissons le socle réseau de votre croissance.",
    icon: null,
    imageUrl: null,
    features: ["Audit & architecture", "WiFi haute densité", "Câblage certifié", "Supervision 24/7"],
  },
  {
    id: "cat-ia",
    slug: "ia",
    name: "Intelligence Artificielle",
    tagline: "L'IA au service de vos équipes",
    description:
      "Agents conversationnels, automatisation des processus et analyse prédictive. Nous intégrons l'IA là où elle crée réellement de la valeur.",
    icon: null,
    imageUrl: null,
    features: ["Agents IA sur mesure", "Automatisation métier", "Analyse de données", "Formation des équipes"],
  },
  {
    id: "cat-communication",
    slug: "communication",
    name: "Communication",
    tagline: "Une marque qui marque les esprits",
    description:
      "Identité visuelle, contenus, campagnes et réseaux sociaux. Une stratégie de communication cohérente qui fait rayonner votre marque.",
    icon: null,
    imageUrl: null,
    features: ["Branding & identité", "Production de contenu", "Campagnes digitales", "Community management"],
  },
  {
    id: "cat-events",
    slug: "events",
    name: "Événementiel",
    tagline: "Des événements inoubliables",
    description:
      "Conception, scénographie, sonorisation, éclairage et streaming. Nous produisons des événements corporate et grand public de bout en bout.",
    icon: null,
    imageUrl: null,
    features: ["Scénographie & design", "Son, lumière, vidéo", "Streaming hybride", "Logistique complète"],
  },
];

const products: ProductDTO[] = [
  { id: "p1", categorySlug: "domotique", slug: "ampoule-connectee", name: "Ampoule connectée", tagline: "Éclairage intelligent pilotable", description: null, imageUrl: null, price: 199, currency: "MAD", badge: null },
  { id: "p2", categorySlug: "domotique", slug: "serrure-intelligente", name: "Serrure intelligente", tagline: "Accès sécurisé sans clé", description: null, imageUrl: null, price: 1490, currency: "MAD", badge: "Populaire" },
  { id: "p3", categorySlug: "domotique", slug: "thermostat-smart", name: "Thermostat smart", tagline: "Confort et économies d'énergie", description: null, imageUrl: null, price: 890, currency: "MAD", badge: null },
  { id: "p4", categorySlug: "reseaux", slug: "borne-wifi6", name: "Borne WiFi 6", tagline: "Couverture haute densité", description: null, imageUrl: null, price: 2490, currency: "MAD", badge: null },
  { id: "p5", categorySlug: "reseaux", slug: "switch-poe-24", name: "Switch PoE 24 ports", tagline: "Alimentation et données", description: null, imageUrl: null, price: 3990, currency: "MAD", badge: null },
  { id: "p6", categorySlug: "reseaux", slug: "baie-42u", name: "Baie de brassage 42U", tagline: "Infrastructure professionnelle", description: null, imageUrl: null, price: 6990, currency: "MAD", badge: null },
  { id: "p7", categorySlug: "digital", slug: "pack-site-vitrine", name: "Pack site vitrine", tagline: "Votre présence en ligne en 2 semaines", description: null, imageUrl: null, price: 9900, currency: "MAD", badge: "Best-seller" },
  { id: "p8", categorySlug: "ia", slug: "agent-ia-support", name: "Agent IA support", tagline: "Réponses clients 24/7", description: null, imageUrl: null, price: null, currency: "MAD", badge: "Nouveau" },
  { id: "p9", categorySlug: "communication", slug: "pack-branding", name: "Pack branding", tagline: "Identité visuelle complète", description: null, imageUrl: null, price: 14900, currency: "MAD", badge: null },
  { id: "p10", categorySlug: "events", slug: "ecran-led-outdoor", name: "Écran LED outdoor", tagline: "Impact visuel maximal", description: null, imageUrl: null, price: null, currency: "MAD", badge: null },
  { id: "p11", categorySlug: "domotique", slug: "camera-4k", name: "Caméra 4K", tagline: "Vidéosurveillance haute définition", description: null, imageUrl: null, price: 1190, currency: "MAD", badge: null },
];

const packages: PackageDTO[] = [
  {
    id: "pk1", categorySlug: "digital", slug: "pack-starter", name: "Starter",
    description: "Pour lancer votre présence digitale rapidement.",
    price: 9900, currency: "MAD", billingPeriod: null,
    features: ["Site vitrine 5 pages", "Design responsive", "Formulaire de contact", "Mise en ligne incluse"],
    isPopular: false, ctaLabel: null,
  },
  {
    id: "pk2", categorySlug: "digital", slug: "pack-business", name: "Business",
    description: "La solution complète pour accélérer votre croissance.",
    price: 24900, currency: "MAD", billingPeriod: null,
    features: ["Site sur mesure illimité", "CMS & blog intégrés", "SEO avancé", "Accompagnement 6 mois", "Tableau de bord analytique"],
    isPopular: true, ctaLabel: null,
  },
  {
    id: "pk3", categorySlug: "domotique", slug: "pack-villa", name: "Villa connectée",
    description: "La domotique clé en main pour votre villa.",
    price: null, currency: "MAD", billingPeriod: null,
    features: ["Étude et scénarios sur mesure", "Éclairage & ouvrants automatisés", "Sécurité et vidéosurveillance", "Pilotage mobile et vocal"],
    isPopular: false, ctaLabel: "Demander une étude",
  },
];

const projects: ProjectDTO[] = [
  { id: "pr1", slug: "villa-anfa", title: "Villa Anfa — Domotique intégrale", summary: "Automatisation complète d'une villa de 800 m² : éclairage, climatisation, sécurité et home cinema pilotés centralement.", coverImageUrl: null, categorySlug: "domotique", categoryName: "Domotique", tags: ["KNX", "Villa", "Casablanca"], client: "Client privé", year: 2025 },
  { id: "pr2", slug: "hotel-wifi", title: "Hôtel 5★ — WiFi haute densité", summary: "Déploiement de 120 bornes WiFi 6 et refonte de la baie de brassage pour un hôtel de 200 chambres.", coverImageUrl: null, categorySlug: "reseaux", categoryName: "Réseaux", tags: ["WiFi 6", "Hôtellerie"], client: "Groupe hôtelier", year: 2025 },
  { id: "pr3", slug: "retail-ecommerce", title: "Enseigne retail — Plateforme e-commerce", summary: "Boutique en ligne sur mesure avec paiement, stock synchronisé et +180% de ventes en 6 mois.", coverImageUrl: null, categorySlug: "digital", categoryName: "Digital", tags: ["E-commerce", "Retail"], client: "Enseigne nationale", year: 2024 },
  { id: "pr4", slug: "banque-agent-ia", title: "Banque — Agent IA service client", summary: "Agent conversationnel traitant 70% des demandes de niveau 1, disponible 24/7 en français et arabe.", coverImageUrl: null, categorySlug: "ia", categoryName: "Intelligence Artificielle", tags: ["IA", "Chatbot", "Finance"], client: "Banque marocaine", year: 2025 },
  { id: "pr5", slug: "summit-corporate", title: "Summit corporate — 1 500 participants", summary: "Production intégrale : scénographie LED, sonorisation, streaming hybride et application dédiée.", coverImageUrl: null, categorySlug: "events", categoryName: "Événementiel", tags: ["Corporate", "Streaming"], client: "Multinationale", year: 2024 },
  { id: "pr6", slug: "clinique-rebranding", title: "Clinique — Rebranding complet", summary: "Nouvelle identité visuelle, campagne de lancement et refonte du site : +45% de prises de rendez-vous.", coverImageUrl: null, categorySlug: "communication", categoryName: "Communication", tags: ["Branding", "Santé"], client: "Clinique privée", year: 2024 },
];

const posts: BlogPostDTO[] = [
  { id: "b1", slug: "domotique-2026", title: "Domotique en 2026 : les tendances qui transforment nos bâtiments", excerpt: "IA embarquée, gestion énergétique prédictive, interopérabilité Matter… Tour d'horizon des innovations qui redéfinissent le bâtiment intelligent.", coverImageUrl: null, category: "domotique", authorName: "Équipe DODRICOM", readMinutes: 6, publishedAt: "2026-09-12" },
  { id: "b2", slug: "wifi7-entreprise", title: "WiFi 7 en entreprise : faut-il franchir le pas ?", excerpt: "Débits multi-gigabits, latence réduite, MLO… Nous analysons les cas où le WiFi 7 change réellement la donne pour votre infrastructure.", coverImageUrl: null, category: "reseaux", authorName: "Équipe DODRICOM", readMinutes: 5, publishedAt: "2026-08-28" },
  { id: "b3", slug: "ia-pme", title: "L'IA générative à la portée des PME : par où commencer ?", excerpt: "Support client, rédaction, analyse de documents : trois cas d'usage concrets pour démarrer avec l'IA sans bouleverser votre organisation.", coverImageUrl: null, category: "ia", authorName: "Équipe DODRICOM", readMinutes: 7, publishedAt: "2026-08-10" },
  { id: "b4", slug: "site-vitrine-roi", title: "Site vitrine : comment en faire un vrai commercial digital", excerpt: "Un beau site ne suffit plus. Structure, preuve sociale, appels à l'action : les leviers qui transforment vos visiteurs en prospects.", coverImageUrl: null, category: "digital", authorName: "Équipe DODRICOM", readMinutes: 4, publishedAt: "2026-07-22" },
  { id: "b5", slug: "event-hybride", title: "Événements hybrides : les clés d'une production réussie", excerpt: "Streaming multi-caméras, interaction à distance, scénographie immersive : notre retour d'expérience sur les formats qui engagent.", coverImageUrl: null, category: "events", authorName: "Équipe DODRICOM", readMinutes: 5, publishedAt: "2026-06-30" },
  { id: "b6", slug: "marque-employeur", title: "Communication de marque : cohérence avant visibilité", excerpt: "Pourquoi les marques les plus mémorables investissent d'abord dans leur plateforme de marque avant leurs campagnes.", coverImageUrl: null, category: "communication", authorName: "Équipe DODRICOM", readMinutes: 4, publishedAt: "2026-06-12" },
];

export async function getServicesContent() {
  return { categories, products, packages };
}

export async function getProjects() {
  return projects;
}

export async function getBlogPosts() {
  return posts;
}
