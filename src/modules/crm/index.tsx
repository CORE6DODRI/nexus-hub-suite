import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Handshake, RefreshCw, Search, Target, TrendingUp, Users } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useFieldMappings } from "@/components/core/FieldMappings";
import { resolveMapping } from "@/lib/modules/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModuleHeader, Pill, StatGrid } from "@/components/modules/ModuleKit";
import { CrudPanel } from "@/components/modules/CrudPanel";
import { money, shortDate, useRows, useSaveRow } from "@/lib/modules/db";
import type { ModuleUIProps } from "@/modules/registry";

type Contact = { id: string; full_name: string; company_name: string | null; email: string | null; phone: string | null; city: string | null; source: string; status: string; created_at: string };
type Deal = { id: string; title: string; contact_id: string | null; amount: number; currency: string; stage: string; probability: number; expected_close: string | null; created_at: string };
type Activity = { id: string; subject: string; type: string; contact_id: string | null; deal_id: string | null; due_at: string | null; done: boolean; created_at: string };

const TABS = ["Pipeline", "Contacts", "Affaires", "Activités", "Produits"] as const;
const STAGES = ["new", "qualified", "proposal", "negotiation", "won", "lost"];
const STAGE_PROBA: Record<string, number> = { new: 10, qualified: 30, proposal: 50, negotiation: 75, won: 100, lost: 0 };

export default function CrmModuleUI({ name, version }: ModuleUIProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Pipeline");
  const [q, setQ] = useState("");
  const contacts = useRows<Contact>("crm_contacts", { orderBy: "created_at", ascending: false });
  const deals = useRows<Deal>("crm_deals", { orderBy: "created_at", ascending: false });
  const activities = useRows<Activity>("crm_activities", { orderBy: "created_at", ascending: false });

  const contactRows = contacts.data ?? [];
  const dealRows = deals.data ?? [];
  const contactName = useMemo(() => new Map(contactRows.map((c) => [c.id, c.full_name])), [contactRows]);
  const dealName = useMemo(() => new Map(dealRows.map((d) => [d.id, d.title])), [dealRows]);
  const contactOptions = contactRows.map((c) => ({ value: c.id, label: c.company_name ? `${c.full_name} — ${c.company_name}` : c.full_name }));
  const dealOptions = dealRows.map((d) => ({ value: d.id, label: d.title }));

  const won = dealRows.filter((d) => d.stage === "won");
  const open = dealRows.filter((d) => !["won", "lost"].includes(d.stage));
  const pipelineValue = open.reduce((s, d) => s + Number(d.amount ?? 0), 0);
  const weighted = open.reduce((s, d) => s + Number(d.amount ?? 0) * (d.probability / 100), 0);
  const closed = dealRows.filter((d) => ["won", "lost"].includes(d.stage)).length;
  const winRate = closed ? Math.round((won.length / closed) * 100) : 0;
  const webLeads = contactRows.filter((c) => c.source === "website").length;
  const today = new Date().toISOString().slice(0, 10);
  const overdue = (activities.data ?? []).filter((a) => !a.done && a.due_at && a.due_at.slice(0, 10) < today).length;

  const match = (text: (string | null | undefined)[]) => {
    const s = q.trim().toLowerCase();
    return !s || text.some((t) => t?.toLowerCase().includes(s));
  };

  const search = (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher…" className="h-8 w-48 pl-7 text-xs" />
    </div>
  );

  return (
    <div className="space-y-4">
      <ModuleHeader
        eyebrow="Module commercial"
        title={`${name} workspace`}
        description={`Contacts, leads du site web, affaires et relances · v${version}`}
      />

      <StatGrid
        items={[
          { label: "Contacts", value: contactRows.length, icon: Users, hint: `${webLeads} venus du site` },
          { label: "Affaires ouvertes", value: open.length, icon: Target, hint: `${overdue} relance(s) en retard` },
          { label: "Pipeline", value: money(pipelineValue), icon: TrendingUp, hint: `Pondéré ${money(weighted)}` },
          { label: "Gagnées", value: won.length, icon: Handshake, hint: `Taux ${winRate}% · ${money(won.reduce((s, d) => s + Number(d.amount ?? 0), 0))}` },
        ]}
      />

      <div className="flex flex-wrap gap-1.5">
        {TABS.map((item) => (
          <Button key={item} size="sm" variant={tab === item ? "default" : "ghost"} onClick={() => setTab(item)}>
            {item}
          </Button>
        ))}
      </div>

      {tab === "Pipeline" ? <Pipeline deals={dealRows} contactName={contactName} /> : null}

      {tab === "Contacts" ? (
        <CrudPanel<Contact>
          table="crm_contacts"
          title="Contacts & leads"
          toolbar={search}
          filter={(r) => match([r.full_name, r.company_name, r.email, r.phone, r.city])}
          empty="Aucun contact. Les demandes du site web arrivent ici automatiquement."
          fields={[
            { name: "full_name", label: "Nom complet", required: true },
            { name: "company_name", label: "Société" },
            { name: "email", label: "E-mail" },
            { name: "phone", label: "Téléphone" },
            { name: "city", label: "Ville" },
            { name: "status", label: "Statut", type: "select", options: ["lead", "qualified", "client", "lost"], defaultValue: "lead" },
            { name: "source", label: "Source", type: "select", options: ["manual", "website", "phone", "referral"], defaultValue: "manual" },
            { name: "notes", label: "Notes", type: "textarea" },
          ]}
          columns={[
            { header: "Nom", render: (row) => <span className="font-medium">{row.full_name}</span> },
            { header: "Société", render: (row) => row.company_name ?? "—" },
            { header: "Contact", render: (row) => row.email ?? row.phone ?? "—" },
            { header: "Statut", render: (row) => <Pill label={row.status} /> },
            { header: "Source", render: (row) => <Pill label={row.source} /> },
            { header: "Affaires", render: (row) => dealRows.filter((d) => d.contact_id === row.id).length },
            { header: "Créé", render: (row) => shortDate(row.created_at) },
          ]}
        />
      ) : null}

      {tab === "Affaires" ? (
        <CrudPanel<Deal>
          table="crm_deals"
          title="Affaires"
          toolbar={search}
          filter={(r) => match([r.title, contactName.get(r.contact_id ?? "")])}
          fields={[
            { name: "title", label: "Intitulé", required: true },
            { name: "contact_id", label: "Contact", type: "select", options: contactOptions },
            { name: "amount", label: "Montant", type: "number", defaultValue: 0 },
            { name: "currency", label: "Devise", type: "select", options: ["MAD", "EUR", "USD"], defaultValue: "MAD" },
            { name: "stage", label: "Étape", type: "select", options: STAGES, defaultValue: "new" },
            { name: "probability", label: "Probabilité (%)", type: "number", defaultValue: 10 },
            { name: "expected_close", label: "Clôture prévue", type: "date" },
            { name: "notes", label: "Notes", type: "textarea" },
          ]}
          columns={[
            { header: "Affaire", render: (row) => <span className="font-medium">{row.title}</span> },
            { header: "Contact", render: (row) => contactName.get(row.contact_id ?? "") ?? "—" },
            { header: "Montant", render: (row) => money(row.amount, row.currency) },
            { header: "Étape", render: (row) => <Pill label={row.stage} /> },
            { header: "Proba.", render: (row) => `${row.probability}%` },
            { header: "Clôture", render: (row) => shortDate(row.expected_close) },
          ]}
        />
      ) : null}

      {tab === "Activités" ? (
        <CrudPanel<Activity>
          table="crm_activities"
          title="Relances & activités"
          toolbar={search}
          filter={(r) => match([r.subject, contactName.get(r.contact_id ?? ""), dealName.get(r.deal_id ?? "")])}
          fields={[
            { name: "subject", label: "Sujet", required: true },
            { name: "type", label: "Type", type: "select", options: ["note", "call", "meeting", "email", "task"], defaultValue: "task" },
            { name: "contact_id", label: "Contact", type: "select", options: contactOptions },
            { name: "deal_id", label: "Affaire", type: "select", options: dealOptions },
            { name: "due_at", label: "Échéance", type: "date" },
            { name: "done", label: "Terminé", type: "checkbox" },
            { name: "details", label: "Détails", type: "textarea" },
          ]}
          columns={[
            { header: "Sujet", render: (row) => <span className="font-medium">{row.subject}</span> },
            { header: "Type", render: (row) => <Pill label={row.type} /> },
            { header: "Lié à", render: (row) => contactName.get(row.contact_id ?? "") ?? dealName.get(row.deal_id ?? "") ?? "—" },
            { header: "Échéance", render: (row) => shortDate(row.due_at) },
            {
              header: "État",
              render: (row) => (
                <Pill label={row.done ? "terminé" : row.due_at && row.due_at.slice(0, 10) < today ? "en retard" : "à faire"} />
              ),
            },
          ]}
        />
      ) : null}

      {tab === "Produits" ? <Products /> : null}
    </div>
  );
}

type Product = { id: string; produit: string; quantite: number; prix: number };

function Products() {
  const qc = useQueryClient();
  const mappings = useFieldMappings();
  const [busy, setBusy] = useState(false);
  async function sync() {
    setBusy(true);
    try {
      const rows = await resolveMapping("crm_products", mappings.data ?? []);
      if (!rows.length) return toast.info("Aucune liaison active pour CRM.PRODUITS (Parameters → Connections).");
      await supabase.from("crm_products" as never).delete().not("id", "is", null);
      const { error } = await supabase.from("crm_products" as never).insert(
        rows.map((r) => ({ produit: String(r.produit ?? ""), quantite: Number(r.quantite ?? 0), prix: Number(r.prix ?? 0) })) as never,
      );
      if (error) throw error;
      toast.success(`${rows.length} produit(s) synchronisé(s)`);
      qc.invalidateQueries({ queryKey: ["mod", "crm_products"] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <CrudPanel<Product>
      table="crm_products"
      title="Produits"
      toolbar={<Button size="sm" variant="outline" disabled={busy} onClick={sync}><RefreshCw className="mr-1 h-3.5 w-3.5" /> Synchroniser via liaisons</Button>}
      fields={[{ name: "produit", label: "Produit", required: true }, { name: "quantite", label: "Quantité", type: "number", defaultValue: 0 }, { name: "prix", label: "Prix", type: "number", defaultValue: 0 }]}
      columns={[{ header: "Produit", render: (r) => r.produit }, { header: "Quantité", render: (r) => r.quantite }, { header: "Prix", render: (r) => money(r.prix) }]}
    />
  );
}

function Pipeline({ deals, contactName }: { deals: Deal[]; contactName: Map<string, string> }) {
  const save = useSaveRow("crm_deals", "Étape mise à jour");
  const move = (deal: Deal, dir: -1 | 1) => {
    const next = STAGES[STAGES.indexOf(deal.stage) + dir];
    if (!next) return;
    save.mutate({ id: deal.id, stage: next, probability: STAGE_PROBA[next] });
  };
  return (
    <div className="grid gap-2.5 md:grid-cols-3 xl:grid-cols-6">
      {STAGES.map((stage) => {
        const items = deals.filter((d) => d.stage === stage);
        const total = items.reduce((sum, d) => sum + Number(d.amount ?? 0), 0);
        return (
          <div key={stage} className="rounded-md border border-border/80 bg-card/75 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{stage}</span>
              <span className="text-[10px] font-semibold">{items.length}</span>
            </div>
            <div className="mt-1 font-display text-sm font-bold">{money(total)}</div>
            <div className="mt-2 space-y-1.5">
              {items.map((deal) => (
                <div key={deal.id} className="rounded border border-border/60 bg-background/60 p-2">
                  <div className="truncate text-xs font-medium">{deal.title}</div>
                  <div className="truncate text-[10px] text-muted-foreground">
                    {contactName.get(deal.contact_id ?? "") ?? "Sans contact"}
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[10px]">{money(deal.amount, deal.currency)}</span>
                    <span className="flex">
                      <Button size="icon" variant="ghost" className="h-5 w-5" disabled={stage === STAGES[0]} onClick={() => move(deal, -1)}>
                        <ChevronLeft className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-5 w-5" disabled={stage === STAGES[STAGES.length - 1]} onClick={() => move(deal, 1)}>
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </span>
                  </div>
                </div>
              ))}
              {items.length === 0 ? <div className="text-[10px] text-muted-foreground">Vide</div> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
