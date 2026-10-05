import { SuperAdminGate } from "@/components/layout/SuperAdminGate";
import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImageUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/common/PageHeader";
import { CompanyBrandLogo } from "@/components/brand/CompanyBrandLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useSystemSettings } from "@/hooks/useCore";
import { useAuth } from "@/hooks/useAuth";
import { LOGO_BUCKET, useCompany } from "@/hooks/useCompany";

export const Route = createFileRoute("/_authenticated/parameters/")({
  head: () => ({
    meta: [
      { title: "General Settings — DODRI Platform Core" },
      { name: "description", content: "Platform identity, timezone and maintenance settings." },
      { property: "og:title", content: "General Settings — DODRI Platform Core" },
      { property: "og:description", content: "Platform identity and maintenance settings." },
    ],
  }),
  component: () => (
    <SuperAdminGate>
      <GeneralSettingsPage />
    </SuperAdminGate>
  ),
});

function valueOf(v: unknown) {
  return typeof v === "string" ? v : JSON.stringify(v ?? "");
}

function GeneralSettingsPage() {
  const settings = useSystemSettings();
  const company = useCompany();
  const { can } = useAuth();
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [maintenance, setMaintenance] = useState(false);
  const [busyLogo, setBusyLogo] = useState<string | null>(null);

  useEffect(() => {
    const rows = settings.data ?? [];
    const next: Record<string, string> = {};
    for (const r of rows) next[r.key] = valueOf(r.value);
    setDraft(next);
    setMaintenance(rows.find((r) => r.key === "maintenance_mode")?.value === true);
  }, [settings.data]);

  const editable = can("settings.manage");

  async function save(key: string, value: string | boolean) {
    const { error } = await supabase.from("system_settings").update({ value }).eq("key", key);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Setting saved.");
    qc.invalidateQueries({ queryKey: ["system_settings"] });
  }

  async function uploadBrandLogo(column: LogoPathColumn, file: File) {
    if (!company.data) {
      toast.error("Create the company profile first.");
      return;
    }
    setBusyLogo(column);
    const extension = file.name.split(".").pop() || "png";
    const path = `${company.data.id}/${column}-${Date.now()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from(LOGO_BUCKET)
      .upload(path, file, { upsert: true });
    if (uploadError) {
      setBusyLogo(null);
      toast.error(uploadError.message);
      return;
    }
    const { error } = await supabase.from("company").update({ [column]: path }).eq("id", company.data.id);
    setBusyLogo(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Logo updated.");
    qc.invalidateQueries({ queryKey: ["company"] });
    qc.invalidateQueries({ queryKey: ["company_branding"] });
  }

  async function saveLogoSize(column: LogoSizeColumn, size: number) {
    if (!company.data) return;
    const { error } = await supabase.from("company").update({ [column]: size }).eq("id", company.data.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Logo size saved.");
    qc.invalidateQueries({ queryKey: ["company"] });
    qc.invalidateQueries({ queryKey: ["company_branding"] });
  }

  return (
    <div className="max-w-5xl">
      <PageHeader
        eyebrow="Parameters"
        title="General Settings"
        description="Core identity and global behaviour."
      />

      <div className="panel space-y-5 p-5">
        {["platform_name", "platform_timezone"].map((key) => (
          <div key={key} className="space-y-1.5">
            <Label className="capitalize">{key.replace(/_/g, " ")}</Label>
            <div className="flex gap-2">
              <Input
                value={draft[key] ?? ""}
                disabled={!editable}
                onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
              />
              {editable && (
                <Button variant="secondary" onClick={() => save(key, draft[key] ?? "")}>
                  Save
                </Button>
              )}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between border-t border-border/60 pt-4">
          <div>
            <div className="text-sm font-medium">Maintenance mode</div>
            <div className="text-xs text-muted-foreground">Temporarily restrict access to the platform.</div>
          </div>
          <Switch
            checked={maintenance}
            disabled={!editable}
            onCheckedChange={(v) => {
              setMaintenance(v);
              void save("maintenance_mode", v);
            }}
          />
        </div>
      </div>

      <section className="panel mt-4 p-5">
        <div className="mb-5">
          <div className="font-display text-sm font-semibold">Brand logos</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Upload separate logos for the connection page and the expanded and compact CORE sidebar.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <LogoSetting
            title="Connection page"
            description="Displayed on /backdoor"
            variant="login"
            pathColumn="login_logo_url"
            sizeColumn="login_logo_size"
            size={company.data?.login_logo_size ?? 120}
            min={48}
            max={320}
            editable={can("company.manage")}
            busy={busyLogo === "login_logo_url"}
            onUpload={uploadBrandLogo}
            onSaveSize={saveLogoSize}
          />
          <LogoSetting
            title="CORE large logo"
            description="Displayed when the menu is expanded"
            variant="coreLarge"
            pathColumn="core_logo_large_url"
            sizeColumn="core_logo_large_size"
            size={company.data?.core_logo_large_size ?? 150}
            min={72}
            max={320}
            editable={can("company.manage")}
            busy={busyLogo === "core_logo_large_url"}
            onUpload={uploadBrandLogo}
            onSaveSize={saveLogoSize}
          />
          <LogoSetting
            title="CORE small logo"
            description="Displayed when the menu is collapsed"
            variant="coreSmall"
            pathColumn="core_logo_small_url"
            sizeColumn="core_logo_small_size"
            size={company.data?.core_logo_small_size ?? 36}
            min={24}
            max={96}
            editable={can("company.manage")}
            busy={busyLogo === "core_logo_small_url"}
            onUpload={uploadBrandLogo}
            onSaveSize={saveLogoSize}
          />
        </div>
      </section>
    </div>
  );
}

type LogoPathColumn = "login_logo_url" | "core_logo_large_url" | "core_logo_small_url";
type LogoSizeColumn = "login_logo_size" | "core_logo_large_size" | "core_logo_small_size";
type LogoVariant = "login" | "coreLarge" | "coreSmall";

function LogoSetting({
  title,
  description,
  variant,
  pathColumn,
  sizeColumn,
  size,
  min,
  max,
  editable,
  busy,
  onUpload,
  onSaveSize,
}: {
  title: string;
  description: string;
  variant: LogoVariant;
  pathColumn: LogoPathColumn;
  sizeColumn: LogoSizeColumn;
  size: number;
  min: number;
  max: number;
  editable: boolean;
  busy: boolean;
  onUpload: (column: LogoPathColumn, file: File) => Promise<void>;
  onSaveSize: (column: LogoSizeColumn, size: number) => Promise<void>;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [draftSize, setDraftSize] = useState(size);

  useEffect(() => setDraftSize(size), [size]);

  return (
    <div className="rounded-md border border-border bg-secondary/30 p-4">
      <div className="flex min-h-24 items-center justify-center overflow-hidden rounded-md border border-border/60 bg-background/70 p-3">
        <CompanyBrandLogo
          variant={variant}
          className="h-auto max-h-20 max-w-full object-contain"
          fallback={<span className="text-xs text-muted-foreground">No custom logo</span>}
        />
      </div>
      <div className="mt-3">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <Label>Display width</Label>
          <span className="font-mono text-muted-foreground">{draftSize}px</span>
        </div>
        <Slider
          value={[draftSize]}
          min={min}
          max={max}
          step={2}
          disabled={!editable}
          onValueChange={(value) => setDraftSize(value[0] ?? size)}
        />
        <div className="flex gap-2">
          <input
            ref={input}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onUpload(pathColumn, file);
              event.target.value = "";
            }}
          />
          <Button variant="secondary" size="sm" disabled={!editable || busy} onClick={() => input.current?.click()}>
            <ImageUp className="mr-2 h-4 w-4" /> Upload
          </Button>
          <Button size="sm" disabled={!editable || draftSize === size} onClick={() => void onSaveSize(sizeColumn, draftSize)}>
            Save size
          </Button>
        </div>
      </div>
    </div>
  );
}
