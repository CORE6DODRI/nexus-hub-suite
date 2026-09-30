import { useState } from "react";
import { Handshake, Target, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModuleHeader, Pill, StatGrid } from "@/components/modules/ModuleKit";
import { CrudPanel } from "@/components/modules/CrudPanel";
import { money, shortDate, useRows } from "@/lib/modules/db";
import type { ModuleUIProps } from "@/modules/registry";

type Contact = { id: string; full_name: string; company_name: string | null; email: string | null; phone: string | null; source: string; status: string; created_at: string };
type Deal = { id: string; title: string; amount: number; currency: string; stage: string; probability: number; expected_close: string | null; created_at: string };
type Activity = { id: string; subject: string; type: string; due_at: string | null; done: boolean; created_at: string };

const TABS = ["Pipeline", "Contacts", "Affaires", "Activités"] as const;

export default function CrmModuleUI({ name, version }: ModuleUIProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Pipeline");
  const contacts = useRows<Contact>("crm_contacts", { orderBy: "created_at", ascending: false });
  const deals = useRows<Deal>("crm_deals", { orderBy: "created_at", ascending: false });

  const dealRows = deals.data ?? [];
  const won = dealRows.filter((d) => d.stage === "won");
  const pipelineValue = dealRows
    .filter((d) => !["won", "lost"].includes(d.stage))
    .reduce((sum, d) => sum + Number(d.amount ?? 0), 0);
  const webLeads = (contacts.data ?? []).filter((c) => c.source === "website").length;

  return (
    <div className="space-y-4">
      <ModuleHeader
        eyebrow="Module commercial"
        title={`${name} workspace`}
        description={`Contacts, leads du site web, affaires et relances · v${version}`}
      />

      <StatGrid
        items={[
          { label: "Contacts", value: (contacts.data ?? []).length, icon: Users, hint: `${webLeads} venus du site` },
          { label: "Affaires ouvertes", value: dealRows.length - won.length, icon: Target },
          { label: "Pipeline", value: money(pipelineValue), icon: TrendingUp },
          { label: "Gagnées", value: won.length, icon: Handshake, hint: money(won.reduce((s, d) => s + Number(d.amount ?? 0), 0)) },
        ]}
      />

      <div className="flex flex-wrap gap-1.5">
        {TABS.map((item) => (
          <Button key={item} size="sm" variant={tab === item ? "default" : "ghost"} onClick={() => setTab(item)}>
            {item}
          </Button>
        ))}
      </div>

      {tab === "Pipeline" ? <Pipeline deals={dealRows} /> : null}

      {tab === "Contacts" ? (
        <CrudPanel<Contact>
          table="crm_contacts"
          title="Contacts & leads"
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
            { header: "Créé", render: (row) => shortDate(row.created_at) },
          ]}
        />
      ) : null}

      {tab === "Affaires" ? (
        <CrudPanel<Deal>
          table="crm_deals"
          title="Affaires"
          fields={[
            { name: "title", label: "Intitulé", required: true },
            { name: "amount", label: "Montant", type: "number", defaultValue: 0 },
            { name: "currency", label: "Devise", type: "select", options: ["MAD", "EUR", "USD"], defaultValue: "MAD" },
            { name: "stage", label: "Étape", type: "select", options: ["new", "qualified", "proposal", "negotiation", "won", "lost"], defaultValue: "new" },
            { name: "probability", label: "Probabilité (%)", type: "number", defaultValue: 20 },
            { name: "expected_close", label: "Clôture prévue", type: "date" },
            { name: "notes", label: "Notes", type: "textarea" },
          ]}
          columns={[
            { header: "Affaire", render: (row) => <span className="font-medium">{row.title}</span> },
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
          fields={[
            { name: "subject", label: "Sujet", required: true },
            { name: "type", label: "Type", type: "select", options: ["note", "call", "meeting", "email", "task"], defaultValue: "task" },
            { name: "due_at", label: "Échéance", type: "date" },
            { name: "done", label: "Terminé", type: "checkbox" },
            { name: "details", label: "Détails", type: "textarea" },
          ]}
          columns={[
            { header: "Sujet", render: (row) => <span className="font-medium">{row.subject}</span> },
            { header: "Type", render: (row) => <Pill label={row.type} /> },
            { header: "Échéance", render: (row) => shortDate(row.due_at) },
            { header: "État", render: (row) => <Pill label={row.done ? "terminé" : "à faire"} /> },
          ]}
        />
      ) : null}
    </div>
  );
}

const STAGES = ["new", "qualified", "proposal", "negotiation", "won", "lost"];

function Pipeline({ deals }: { deals: Deal[] }) {
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
              {items.slice(0, 5).map((deal) => (
                <div key={deal.id} className="rounded border border-border/60 bg-background/60 p-2">
                  <div className="truncate text-xs font-medium">{deal.title}</div>
                  <div className="text-[10px] text-muted-foreground">{money(deal.amount, deal.currency)}</div>
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
