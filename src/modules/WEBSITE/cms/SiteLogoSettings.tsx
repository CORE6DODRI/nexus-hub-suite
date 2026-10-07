import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, RotateCcw, Save, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { normalizeSiteBranding, SITE_BRANDING_DEFAULT, SETTINGS_KEYS, type SiteBranding } from "@website/lib/site-config";

export function SiteLogoSettings() {
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [branding, setBranding] = useState(SITE_BRANDING_DEFAULT);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const settings = useQuery({
    queryKey: ["cms-site-branding"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("value").eq("key", SETTINGS_KEYS.branding).maybeSingle();
      if (error) throw error;
      return normalizeSiteBranding(data?.value as Partial<SiteBranding> | null);
    },
  });
  useEffect(() => { if (settings.data) setBranding(settings.data); }, [settings.data]);

  const persist = async (next: SiteBranding) => {
    const { error } = await supabase.from("site_settings").upsert({
      key: SETTINGS_KEYS.branding, value: next, label: "Logo FRONT OFFICE",
    }, { onConflict: "key" });
    if (error) throw error;
    setBranding(next);
    queryClient.setQueryData(["cms-site-branding"], next);
    await queryClient.invalidateQueries({ queryKey: ["site-texts"] });
    setMessage("Logo enregistré");
  };
  const run = async (action: () => Promise<void>) => {
    setBusy(true); setError(""); setMessage("");
    try { await action(); } catch (e) { setError(e instanceof Error ? e.message : "Enregistrement impossible"); }
    finally { setBusy(false); }
  };
  const upload = async (file: File) => {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError("Choisissez une image PNG, JPG ou WebP de 5 Mo maximum."); return;
    }
    await run(async () => {
      const path = `branding/front-office-${crypto.randomUUID()}.${file.type.split("/")[1]}`;
      const { error } = await supabase.storage.from("cms").upload(path, file);
      if (error) throw error;
      const { data, error: urlError } = await supabase.storage.from("cms").createSignedUrl(path, 60 * 60 * 24 * 3650);
      if (urlError || !data?.signedUrl) throw urlError ?? new Error("Image indisponible");
      await persist({ ...branding, logoUrl: data.signedUrl });
    });
  };
  const disabled = busy || settings.isPending || settings.isError;
  return (
    <div className="max-w-xl space-y-6 text-foreground">
      <h3 className="font-display text-lg font-semibold">Logo FRONT OFFICE</h3>
      <div className="flex h-28 items-center justify-center overflow-hidden rounded-md border border-border bg-muted/30 p-4">
        {branding.logoUrl ? <img src={branding.logoUrl} alt="Aperçu logo FRONT OFFICE" style={{ height: branding.logoSize }} className="max-w-full object-contain" />
          : <span className="font-display font-bold">DODRICOM</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button disabled={disabled} onClick={() => fileInput.current?.click()}><Upload /> Téléverser le logo</Button>
        <Button variant="outline" disabled={disabled || !branding.logoUrl} onClick={() => void run(() => persist(SITE_BRANDING_DEFAULT))}><RotateCcw /> Logo d’origine</Button>
        <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp" aria-label="Image du logo FRONT OFFICE" className="hidden"
          onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ""; if (file) void upload(file); }} />
      </div>
      <div className="space-y-4">
        <label htmlFor="site-logo-size" className="block text-sm font-medium">Hauteur du logo — {branding.logoSize} px</label>
        <Slider id="site-logo-size" aria-label="Hauteur du logo FRONT OFFICE" min={24} max={64} step={1} value={[branding.logoSize]} disabled={disabled}
          onValueChange={([size]) => { if (size !== undefined) { setBranding((p) => ({ ...p, logoSize: size })); setMessage(""); } }} />
        <Button disabled={disabled} onClick={() => void run(() => persist(branding))}>{busy ? <Loader2 className="animate-spin" /> : <Save />} Enregistrer le logo</Button>
      </div>
      {(error || settings.error) && <p role="alert" className="text-sm text-destructive">{error || settings.error?.message}</p>}
      {message && <p role="status" className="text-sm text-foreground">{message}</p>}
    </div>
  );
}