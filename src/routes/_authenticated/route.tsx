import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/layout/AppShell";
import { isMasterAdmin } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });
    // Master admin: full access, no company/subscription required.
    if (isMasterAdmin(data.user.email)) return { user: data.user };
    // Company + subscription gate (super admin is always allowed).
    await supabase.rpc("bootstrap_current_user", {});
    const { data: access } = await supabase.rpc("check_access" as never);
    const a = access as { allowed?: boolean; reason?: string; end_date?: string } | null;
    if (!a?.allowed) {
      window.sessionStorage.setItem(
        "dodri.denied",
        JSON.stringify({ reason: a?.reason ?? "unknown", end_date: a?.end_date }),
      );
      await supabase.auth.signOut();
      throw redirect({ to: "/login" });
    }
    if (/^\/(administration|parameters|security)/.test(location.pathname)) {
      const { data: isSa } = await supabase.rpc("has_role_slug", { _user_id: data.user.id, _slug: "super-admin" });
      if (!isSa) throw redirect({ to: "/dashboard" });
    }
    return { user: data.user };
  },
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
