import { useState } from "react";
import { Banknote, Landmark, Receipt, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModuleHeader, Pill, StatGrid } from "@/components/modules/ModuleKit";
import { CrudPanel } from "@/components/modules/CrudPanel";
import { money, shortDate, useRows } from "@/lib/modules/db";
import type { ModuleUIProps } from "@/modules/registry";

type Invoice = { id: string; number: string; direction: string; issue_date: string; due_date: string | null; total: number; tax_total: number; currency: string; status: string; created_at: string };
type Expense = { id: string; label: string; category: string; supplier: string | null; amount: number; spent_on: string; status: string; created_at: string };
type Account = { id: string; name: string; kind: string; currency: string; opening_balance: number; created_at: string };
type Transaction = { id: string; label: string; direction: string; amount: number; happened_on: string; method: string; created_at: string };

const TABS = ["Tableau de bord", "Factures", "Dépenses", "Trésorerie", "Comptes"] as const;

export default function FinanceModuleUI({ name, version }: ModuleUIProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Tableau de bord");
  const invoices = useRows<Invoice>("fin_invoices", { orderBy: "issue_date", ascending: false });
  const expenses = useRows<Expense>("fin_expenses", { orderBy: "spent_on", ascending: false });
  const accounts = useRows<Account>("fin_accounts", { orderBy: "name", ascending: true });
  const transactions = useRows<Transaction>("fin_transactions", { orderBy: "happened_on", ascending: false });

  const sales = (invoices.data ?? []).filter((i) => i.direction === "sale");
  const revenue = sales.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.total ?? 0), 0);
  const unpaid = sales.filter((i) => i.status !== "paid").reduce((s, i) => s + Number(i.total ?? 0), 0);
  const spend = (expenses.data ?? []).reduce((s, e) => s + Number(e.amount ?? 0), 0);
  const vat = sales.reduce((s, i) => s + Number(i.tax_total ?? 0), 0);
  const treasury =
    (accounts.data ?? []).reduce((s, a) => s + Number(a.opening_balance ?? 0), 0) +
    (transactions.data ?? []).reduce((s, t) => s + (t.direction === "in" ? Number(t.amount) : -Number(t.amount)), 0);

  return (
    <div className="space-y-4">
      <ModuleHeader
        eyebrow="Module financier"
        title={`${name} workspace`}
        description={`Factures, dépenses, TVA et trésorerie · v${version}`}
      />

      <StatGrid
        items={[
          { label: "Encaissé", value: money(revenue), icon: Banknote },
          { label: "En attente", value: money(unpaid), icon: Receipt, hint: `${sales.filter((i) => i.status !== "paid").length} factures` },
          { label: "Dépenses", value: money(spend), icon: TrendingDown },
          { label: "Trésorerie", value: money(treasury), icon: Landmark, hint: `TVA collectée ${money(vat)}` },
        ]}
      />

      <div className="flex flex-wrap gap-1.5">
        {TABS.map((item) => (
          <Button key={item} size="sm" variant={tab === item ? "default" : "ghost"} onClick={() => setTab(item)}>
            {item}
          </Button>
        ))}
      </div>

      {tab === "Tableau de bord" ? (
        <div className="grid gap-2.5 md:grid-cols-2">
          <div className="rounded-md border border-border/80 bg-card/75 p-4">
            <div className="label-tech">Résultat simplifié</div>
            <div className="mt-2 space-y-1.5 text-xs">
              <Line label="Chiffre d'affaires encaissé" value={money(revenue)} />
              <Line label="Dépenses" value={`- ${money(spend)}`} />
              <Line label="Marge" value={money(revenue - spend)} strong />
            </div>
          </div>
          <div className="rounded-md border border-border/80 bg-card/75 p-4">
            <div className="label-tech">Derniers mouvements</div>
            <div className="mt-2 space-y-1.5 text-xs">
              {(transactions.data ?? []).slice(0, 6).map((t) => (
                <Line key={t.id} label={`${shortDate(t.happened_on)} · ${t.label}`} value={`${t.direction === "in" ? "+" : "-"} ${money(t.amount)}`} />
              ))}
              {(transactions.data ?? []).length === 0 ? (
                <div className="text-muted-foreground">Aucun mouvement enregistré.</div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {tab === "Factures" ? (
        <CrudPanel<Invoice>
          table="fin_invoices"
          title="Factures"
          orderBy="issue_date"
          fields={[
            { name: "number", label: "Numéro", required: true, placeholder: "FA-2026-001" },
            { name: "direction", label: "Type", type: "select", options: ["sale", "purchase"], defaultValue: "sale" },
            { name: "issue_date", label: "Date d'émission", type: "date" },
            { name: "due_date", label: "Échéance", type: "date" },
            { name: "subtotal", label: "Total HT", type: "number", defaultValue: 0 },
            { name: "tax_total", label: "TVA", type: "number", defaultValue: 0 },
            { name: "total", label: "Total TTC", type: "number", defaultValue: 0 },
            { name: "status", label: "Statut", type: "select", options: ["draft", "sent", "paid", "late", "cancelled"], defaultValue: "draft" },
            { name: "notes", label: "Notes", type: "textarea" },
          ]}
          columns={[
            { header: "Numéro", render: (row) => <span className="font-medium">{row.number}</span> },
            { header: "Type", render: (row) => <Pill label={row.direction === "sale" ? "vente" : "achat"} /> },
            { header: "Émission", render: (row) => shortDate(row.issue_date) },
            { header: "Échéance", render: (row) => shortDate(row.due_date) },
            { header: "Total", render: (row) => money(row.total, row.currency) },
            { header: "Statut", render: (row) => <Pill label={row.status} /> },
          ]}
        />
      ) : null}

      {tab === "Dépenses" ? (
        <CrudPanel<Expense>
          table="fin_expenses"
          title="Dépenses"
          orderBy="spent_on"
          fields={[
            { name: "label", label: "Libellé", required: true },
            { name: "category", label: "Catégorie", type: "select", options: ["general", "achats", "salaires", "loyer", "transport", "marketing", "impôts"], defaultValue: "general" },
            { name: "supplier", label: "Fournisseur" },
            { name: "amount", label: "Montant", type: "number", defaultValue: 0 },
            { name: "spent_on", label: "Date", type: "date" },
            { name: "status", label: "Statut", type: "select", options: ["paid", "pending"], defaultValue: "paid" },
          ]}
          columns={[
            { header: "Libellé", render: (row) => <span className="font-medium">{row.label}</span> },
            { header: "Catégorie", render: (row) => <Pill label={row.category} /> },
            { header: "Fournisseur", render: (row) => row.supplier ?? "—" },
            { header: "Montant", render: (row) => money(row.amount) },
            { header: "Date", render: (row) => shortDate(row.spent_on) },
          ]}
        />
      ) : null}

      {tab === "Trésorerie" ? (
        <CrudPanel<Transaction>
          table="fin_transactions"
          title="Mouvements de trésorerie"
          orderBy="happened_on"
          fields={[
            { name: "label", label: "Libellé", required: true },
            { name: "direction", label: "Sens", type: "select", options: ["in", "out"], defaultValue: "in" },
            { name: "amount", label: "Montant", type: "number", defaultValue: 0 },
            { name: "happened_on", label: "Date", type: "date" },
            { name: "method", label: "Moyen", type: "select", options: ["transfer", "cash", "cheque", "card"], defaultValue: "transfer" },
          ]}
          columns={[
            { header: "Libellé", render: (row) => <span className="font-medium">{row.label}</span> },
            { header: "Sens", render: (row) => <Pill label={row.direction === "in" ? "entrée" : "sortie"} /> },
            { header: "Montant", render: (row) => money(row.amount) },
            { header: "Date", render: (row) => shortDate(row.happened_on) },
            { header: "Moyen", render: (row) => <Pill label={row.method} /> },
          ]}
        />
      ) : null}

      {tab === "Comptes" ? (
        <CrudPanel<Account>
          table="fin_accounts"
          title="Comptes"
          orderBy="name"
          ascending
          fields={[
            { name: "name", label: "Nom", required: true },
            { name: "kind", label: "Type", type: "select", options: ["bank", "cash", "wallet"], defaultValue: "bank" },
            { name: "currency", label: "Devise", type: "select", options: ["MAD", "EUR", "USD"], defaultValue: "MAD" },
            { name: "opening_balance", label: "Solde initial", type: "number", defaultValue: 0 },
          ]}
          columns={[
            { header: "Compte", render: (row) => <span className="font-medium">{row.name}</span> },
            { header: "Type", render: (row) => <Pill label={row.kind} /> },
            { header: "Solde initial", render: (row) => money(row.opening_balance, row.currency) },
          ]}
        />
      ) : null}
    </div>
  );
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/50 pb-1 last:border-0">
      <span className="truncate text-muted-foreground">{label}</span>
      <span className={strong ? "font-display font-bold" : "font-medium"}>{value}</span>
    </div>
  );
}
