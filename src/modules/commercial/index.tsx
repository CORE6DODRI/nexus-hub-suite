import { useState } from "react";
import { Boxes, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModuleHeader, StatGrid } from "@/components/modules/ModuleKit";
import { CrudPanel } from "@/components/modules/CrudPanel";
import { money, useRows } from "@/lib/modules/db";
import type { ModuleUIProps } from "@/modules/registry";

type Cat = { id: string; designation: string; prix: number; famille: string | null };
type Inv = { id: string; designation: string; quantite: number; famille: string | null };

export default function CommercialUI({ name, version }: ModuleUIProps) {
  const [tab, setTab] = useState<"Catalog" | "Inventaire">("Catalog");
  const cat = useRows<Cat>("com_catalog");
  const inv = useRows<Inv>("com_inventory");
  return (
    <div className="space-y-4">
      <ModuleHeader eyebrow="Module commercial" title={`${name} workspace`} description={`Catalogue et inventaire · v${version}`} />
      <StatGrid
        items={[
          { label: "Articles catalogue", value: cat.data?.length ?? 0, icon: Package },
          { label: "Stock total", value: (inv.data ?? []).reduce((s, r) => s + Number(r.quantite), 0), icon: Boxes },
        ]}
      />
      <div className="flex gap-1.5">
        {(["Catalog", "Inventaire"] as const).map((x) => (
          <Button key={x} size="sm" variant={tab === x ? "default" : "ghost"} onClick={() => setTab(x)}>{x}</Button>
        ))}
      </div>
      {tab === "Catalog" ? (
        <CrudPanel<Cat>
          table="com_catalog"
          title="Catalog"
          fields={[{ name: "designation", label: "Désignation", required: true }, { name: "prix", label: "Prix", type: "number", defaultValue: 0 }, { name: "famille", label: "Famille" }]}
          columns={[{ header: "Désignation", render: (r) => r.designation }, { header: "Prix", render: (r) => money(r.prix) }, { header: "Famille", render: (r) => r.famille ?? "—" }]}
        />
      ) : (
        <CrudPanel<Inv>
          table="com_inventory"
          title="Inventaire"
          fields={[{ name: "designation", label: "Désignation", required: true }, { name: "quantite", label: "Quantité", type: "number", defaultValue: 0 }, { name: "famille", label: "Famille" }]}
          columns={[{ header: "Désignation", render: (r) => r.designation }, { header: "Quantité", render: (r) => r.quantite }, { header: "Famille", render: (r) => r.famille ?? "—" }]}
        />
      )}
    </div>
  );
}
