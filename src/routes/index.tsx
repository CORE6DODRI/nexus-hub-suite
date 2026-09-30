import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({ meta: [
    { title: "DODRI Platform Core — Accueil" },
    { name: "description", content: "Accédez au centre de gestion DODRI Platform Core." },
    { property: "og:title", content: "DODRI Platform Core — Accueil" },
    { property: "og:description", content: "Accédez au centre de gestion DODRI Platform Core." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  beforeLoad: async () => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase.auth.getUser();
    throw redirect({ to: data.user ? "/dashboard" : "/login" });
  },
  component: () => null,
});
