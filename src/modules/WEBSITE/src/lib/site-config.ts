/** Réglages globaux du site pilotés depuis le CMS (stockés dans site_settings). */

export type SiteBranding = { logoUrl: string | null; logoSize: number };
export const SITE_BRANDING_DEFAULT: SiteBranding = { logoUrl: null, logoSize: 44 };
export function normalizeSiteBranding(value: Partial<SiteBranding> | null | undefined): SiteBranding {
  return {
    logoUrl: typeof value?.logoUrl === "string" && /^https:\/\//.test(value.logoUrl) ? value.logoUrl : null,
    logoSize: typeof value?.logoSize === "number" && Number.isFinite(value.logoSize)
      ? Math.min(64, Math.max(24, value.logoSize)) : SITE_BRANDING_DEFAULT.logoSize,
  };
}

export type MaintenanceConfig = {
  enabled: boolean;
  title: string;
  subtitle: string;
  backgroundUrl: string | null;
  logoUrl: string | null;
  logoSize: number; // px de hauteur du logo
  targetAt: string | null; // ISO date du compte à rebours
};

export const MAINTENANCE_DEFAULT: MaintenanceConfig = {
  enabled: false,
  title: "Something is Happening!",
  subtitle: "Notre nouveau site arrive très bientôt.",
  backgroundUrl: null,
  logoUrl: null,
  logoSize: 72,
  targetAt: null,
};

/** slug de page -> visible dans le front-office */
export type PageVisibility = Record<string, boolean>;

export type CustomButton = {
  id: string;
  label: string;
  url: string;
  variant?: "primary" | "ghost" | undefined;
  align?: "left" | "center" | "right" | undefined;
};

export type CustomButtonMap = Record<string, CustomButton[]>;

export const SETTINGS_KEYS = {
  branding: "site_branding",
  typography: "typography",
  maintenance: "maintenance",
  pageVisibility: "page_visibility",
  customButtons: "cms_custom_buttons",
  customFields: "cms_custom_fields",
  snapshots: "cms_snapshots",
} as const;
