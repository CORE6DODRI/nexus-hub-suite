import { supabase } from "@/integrations/supabase/client";

/** Declared content of each module: sections (tables) and their fields. */
export type FieldDef = { column: string; label: string; type: "text" | "number" | "date" };
export type SectionDef = { table: string; label: string; fields: FieldDef[] };
export type ModuleSchema = { slug: string; label: string; sections: SectionDef[] };

const t = (column: string, label: string, type: FieldDef["type"] = "text"): FieldDef => ({ column, label, type });

export const MODULE_SCHEMAS: ModuleSchema[] = [
  {
    slug: "commercial",
    label: "COMMERCIAL",
    sections: [
      { table: "com_inventory", label: "INVENTAIRE", fields: [t("designation", "Désignation"), t("quantite", "Quantité", "number"), t("famille", "Famille")] },
      { table: "com_catalog", label: "CATALOG", fields: [t("designation", "Désignation"), t("prix", "Prix", "number"), t("famille", "Famille")] },
    ],
  },
  {
    slug: "crm",
    label: "CRM",
    sections: [
      { table: "crm_products", label: "PRODUITS", fields: [t("produit", "Produit"), t("quantite", "Quantité", "number"), t("prix", "Prix", "number")] },
      { table: "crm_contacts", label: "CONTACTS", fields: [t("full_name", "Nom"), t("company_name", "Société"), t("email", "E-mail"), t("phone", "Téléphone"), t("city", "Ville")] },
      { table: "crm_deals", label: "AFFAIRES", fields: [t("title", "Intitulé"), t("amount", "Montant", "number"), t("stage", "Étape")] },
    ],
  },
  {
    slug: "finance",
    label: "FINANCE",
    sections: [
      { table: "fin_invoices", label: "FACTURES", fields: [t("number", "Numéro"), t("total", "Total", "number"), t("status", "Statut"), t("issue_date", "Date", "date")] },
      { table: "fin_expenses", label: "DÉPENSES", fields: [t("label", "Libellé"), t("amount", "Montant", "number"), t("category", "Catégorie")] },
    ],
  },
  {
    slug: "cms",
    label: "WEBSITE CMS",
    sections: [{ table: "cms_pages", label: "PAGES", fields: [t("title", "Titre"), t("slug", "Slug"), t("description", "Description")] }],
  },
  {
    slug: "message",
    label: "MESSAGE",
    sections: [{ table: "msg_inbox", label: "INBOX", fields: [t("full_name", "Nom"), t("email", "E-mail"), t("subject", "Sujet"), t("body", "Message")] }],
  },
];

export function findSection(table: string) {
  for (const m of MODULE_SCHEMAS) {
    const s = m.sections.find((x) => x.table === table);
    if (s) return { module: m, section: s };
  }
  return null;
}

export function fieldPath(table: string, column: string) {
  const f = findSection(table);
  if (!f) return `${table}.${column}`;
  const label = f.section.fields.find((x) => x.column === column)?.label ?? column;
  return `${f.module.label}.${f.section.label}.${label.toUpperCase()}`;
}

export type FieldMapping = {
  id: string;
  target_module: string;
  target_table: string;
  target_column: string;
  source_module: string;
  source_table: string;
  source_column: string;
  cond_target_column: string | null;
  cond_source_column: string | null;
  enabled: boolean;
};

type Row = Record<string, unknown>;

/**
 * Builds rows for a target section from its mappings.
 * The "key" mapping (no condition) drives the row list; conditional mappings
 * look up a source row where source.cond_source_column = row[cond_target_column].
 */
export async function resolveMapping(targetTable: string, mappings: FieldMapping[]): Promise<Row[]> {
  const active = mappings.filter((m) => m.enabled && m.target_table === targetTable);
  if (active.length === 0) return [];
  const tables = Array.from(new Set(active.map((m) => m.source_table)));
  const data: Record<string, Row[]> = {};
  for (const tb of tables) {
    const { data: rows, error } = await supabase.from(tb as never).select("*");
    if (error) throw error;
    data[tb] = (rows ?? []) as Row[];
  }
  const keys = active.filter((m) => !m.cond_target_column);
  const conds = active.filter((m) => m.cond_target_column && m.cond_source_column);
  const base = keys[0];
  if (!base) return [];
  const norm = (v: unknown) => String(v ?? "").trim().toLowerCase();
  return (data[base.source_table] ?? []).map((src) => {
    const out: Row = {};
    for (const k of keys.filter((x) => x.source_table === base.source_table)) out[k.target_column] = src[k.source_column];
    for (const c of conds) {
      const match = (data[c.source_table] ?? []).find((r) => norm(r[c.cond_source_column!]) === norm(out[c.cond_target_column!]));
      out[c.target_column] = match ? match[c.source_column] : null;
    }
    return out;
  });
}
