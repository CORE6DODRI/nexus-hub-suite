import type { ReactNode } from "react";
import { useCompanyBranding, useCompanyLogoUrl } from "@/hooks/useCompany";

type BrandLogoVariant = "login" | "coreLarge" | "coreSmall";

const VARIANT_FIELDS = {
  login: { path: "login_logo_url", size: "login_logo_size", alt: "Login logo" },
  coreLarge: { path: "core_logo_large_url", size: "core_logo_large_size", alt: "CORE logo" },
  coreSmall: { path: "core_logo_small_url", size: "core_logo_small_size", alt: "CORE compact logo" },
} as const;

export function CompanyBrandLogo({
  variant,
  fallback,
  className,
}: {
  variant: BrandLogoVariant;
  fallback?: ReactNode;
  className?: string;
}) {
  const branding = useCompanyBranding();
  const fields = VARIANT_FIELDS[variant];
  const path = branding.data?.[fields.path];
  const logo = useCompanyLogoUrl(path);
  const size = branding.data?.[fields.size];

  if (!logo.data || !size) return <>{fallback ?? null}</>;

  return (
    <img
      src={logo.data}
      alt={fields.alt}
      width={size}
      className={className ?? "h-auto max-w-full object-contain"}
    />
  );
}