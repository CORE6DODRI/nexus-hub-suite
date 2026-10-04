import imgDomo from "@website/assets/service-domotique.jpg";
import imgDigital from "@website/assets/service-digital.jpg";
import imgReseaux from "@website/assets/service-reseaux.jpg";
import imgIA from "@website/assets/service-ia.jpg";
import imgComm from "@website/assets/service-communication.jpg";
import imgEvents from "@website/assets/service-events.jpg";

import pAmpoule from "@website/assets/products/ampoule-connectee.jpg";
import pBorne from "@website/assets/products/borne-wifi6.jpg";
import pVitrine from "@website/assets/products/pack-site-vitrine.jpg";
import pAgentIA from "@website/assets/products/agent-ia-support.jpg";
import pBranding from "@website/assets/products/pack-branding.jpg";
import pLed from "@website/assets/products/ecran-led-outdoor.jpg";
import pSerrure from "@website/assets/products/serrure-intelligente.jpg";
import pSwitch from "@website/assets/products/switch-poe-24.jpg";
import pThermostat from "@website/assets/products/thermostat-smart.jpg";
import pBaie from "@website/assets/products/baie-42u.jpg";
import pCamera from "@website/assets/products/camera-4k.jpg";

/** Fallback visuals used until the CMS media library provides an image URL. */
export const CATEGORY_IMAGES: Record<string, string> = {
  domotique: imgDomo,
  digital: imgDigital,
  reseaux: imgReseaux,
  ia: imgIA,
  communication: imgComm,
  events: imgEvents,
};

export const PRODUCT_IMAGES: Record<string, string> = {
  "ampoule-connectee": pAmpoule,
  "borne-wifi6": pBorne,
  "pack-site-vitrine": pVitrine,
  "agent-ia-support": pAgentIA,
  "pack-branding": pBranding,
  "ecran-led-outdoor": pLed,
  "serrure-intelligente": pSerrure,
  "switch-poe-24": pSwitch,
  "thermostat-smart": pThermostat,
  "baie-42u": pBaie,
  "camera-4k": pCamera,
};

export function productImage(slug: string, url?: string | null, categorySlug?: string | null) {
  return url ?? PRODUCT_IMAGES[slug] ?? CATEGORY_IMAGES[categorySlug ?? ""] ?? imgDigital;
}

export function categoryImage(slug: string, url?: string | null) {
  return url ?? CATEGORY_IMAGES[slug] ?? imgDigital;
}