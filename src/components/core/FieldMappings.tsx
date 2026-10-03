import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MODULE_SCHEMAS, fieldPath, findSection, resolveMapping, type FieldMapping } from "@/lib/modules/schema";

const NONE = "__none";

export function useFieldMappings() {
  return useQuery({
    queryKey: ["module_field_mappings"],
    queryFn: async (): Promise<FieldMapping[]> => {
      const { data, error } = await supabase.from("module_field_mappings" as never).select("*");
      if (error) throw error;
      return (data ?? []) as unknown as FieldMapping[];
    },
  });
}

const allSources = MODULE_SCHEMAS.flatMap((m) =>
  m.sections.flatMap((s) => s.fields.map((f) => ({ module: m.slug, table: s.table, column: f.column, path: fieldPath(s.table, f.column) }))),
);

export function FieldMappings({ canEdit }: { canEdit: boolean }) {
  const qc = useQueryClient();
  const mappings = useFieldMappings();
  const rows = mappings.data ?? [];
  const [target, setTarget] = useState("crm_products");
  const tSec = findSection(target);

  async function save(column: string, sourceKey: string, condKey?: string) {
    const existing = rows.find((m) => m.target_table === target && m.target_column === column);
    if (sourceKey === NONE) {
      if (existing) await supabase.from("module_field_mappings" as never).delete().eq("id", existing.id);
    } else {
      const [st, sc] = sourceKey.split("|");
      const src = allSources.find((s) => s.table === st && s.column === sc)!;
      const cond = condKey && condKey !== NONE ? condKey.split("|") : [null, null];
      const payload = {
        target_module: tSec!.module.slug, target_table: target, target_column: column,
        source_module: src.module, source_table: st, source_column: sc,
        cond_target_column: cond[0], cond_source_column: cond[1],
      };
      const { error } = await supabase.from("module_field_mappings" as never).upsert(payload as never, { onConflict: "target_table,target_column" });
      if (error) return toast.error(error.message);
      await ensureConnection(src.module, tSec!.module.slug);
    }
    qc.invalidateQueries({ queryKey: ["module_field_mappings"] });
    qc.invalidateQueries({ queryKey: ["module_connections"] });
  }

  return (
    <div className="panel mt-4 space-y-4 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wide">Liaisons de champs</h2>
          <p className="text-xs text-muted-foreground">Remplissez uniquement les champs à relier. Les champs vides restent non liés.</p>
        </div>
        <Select value={target} onValueChange={setTarget}>
          <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
          <SelectContent>
            {MODULE_SCHEMAS.flatMap((m) => m.sections.map((s) => (
              <SelectItem key={s.table} value={s.table}>{m.label}.{s.label}</SelectItem>
            )))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Catalogue />
        <div className="space-y-2">
          {tSec?.section.fields.map((f) => {
            const m = rows.find((x) => x.target_table === target && x.target_column === f.column);
            const srcKey = m ? `${m.source_table}|${m.source_column}` : NONE;
            const condKey = m?.cond_target_column ? `${m.cond_target_column}|${m.cond_source_column}` : NONE;
            const srcSec = m ? findSection(m.source_table) : null;
            return (
              <div key={f.column} className="grid items-center gap-2 rounded-md border border-border/70 bg-background/50 p-2 md:grid-cols-[1fr_1.4fr_1.6fr]">
                <span className="font-mono text-xs font-semibold">{fieldPath(target, f.column)} =&gt;</span>
                <Select disabled={!canEdit} value={srcKey} onValueChange={(v) => save(f.column, v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>— non lié —</SelectItem>
                    {allSources.filter((s) => s.table !== target).map((s) => (
                      <SelectItem key={`${s.table}|${s.column}`} value={`${s.table}|${s.column}`}>{s.path}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select disabled={!canEdit || !m} value={condKey} onValueChange={(v) => save(f.column, srcKey, v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="condition" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>Sans condition (champ clé)</SelectItem>
                    {srcSec && tSec.section.fields.filter((x) => x.column !== f.column).flatMap((tf) =>
                      srcSec.section.fields.map((sf) => (
                        <SelectItem key={`${tf.column}|${sf.column}`} value={`${tf.column}|${sf.column}`}>
                          si {fieldPath(target, tf.column)} = {fieldPath(srcSec.section.table, sf.column)}
                        </SelectItem>
                      )),
                    )}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
      </div>

      <ArrowDiagram mappings={rows.filter((m) => m.target_table === target)} />
      <Preview target={target} mappings={rows} />

      <div className="space-y-1">
        {rows.map((m) => (
          <div key={m.id} className="flex items-center gap-2 rounded border border-border/60 px-2 py-1 font-mono text-[11px]">
            <span>{fieldPath(m.source_table, m.source_column)}</span>
            <ArrowRight className="h-3 w-3 text-primary" />
            <span className="font-semibold">{fieldPath(m.target_table, m.target_column)}</span>
            {m.cond_target_column && (
              <span className="text-muted-foreground">/ condition : {fieldPath(m.target_table, m.cond_target_column)} = {fieldPath(m.source_table, m.cond_source_column!)}</span>
            )}
            {canEdit && (
              <Button size="icon" variant="ghost" className="ml-auto h-6 w-6" onClick={async () => {
                await supabase.from("module_field_mappings" as never).delete().eq("id", m.id);
                qc.invalidateQueries({ queryKey: ["module_field_mappings"] });
              }}><Trash2 className="h-3 w-3" /></Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

async function ensureConnection(sourceSlug: string, targetSlug: string) {
  const { data: mods } = await supabase.from("modules").select("id,slug").in("slug", [sourceSlug, targetSlug]);
  const s = mods?.find((m) => m.slug === sourceSlug)?.id;
  const t = mods?.find((m) => m.slug === targetSlug)?.id;
  if (!s || !t) return;
  const { data: existing } = await supabase.from("module_connections").select("id").eq("source_module_id", s).eq("target_module_id", t).limit(1);
  if (existing?.length) return;
  await supabase.from("module_connections").insert({ source_module_id: s, target_module_id: t, connection_type: "module_to_module", status: "active", permissions: ["data.read"] });
}

function Catalogue() {
  return (
    <div className="max-h-[420px] space-y-2 overflow-auto rounded-md border border-border/70 p-2">
      {MODULE_SCHEMAS.map((m) => (
        <div key={m.slug}>
          <div className="font-display text-xs font-bold">{m.label}</div>
          {m.sections.map((s, i) => (
            <div key={s.table} className="ml-2 mt-1">
              <div className="text-[11px] font-semibold">{i + 1} - {s.label}</div>
              {s.fields.map((f) => (
                <div key={f.column} className="ml-3 font-mono text-[10px] text-muted-foreground">{f.label} <span className="opacity-60">({f.type})</span></div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ArrowDiagram({ mappings }: { mappings: FieldMapping[] }) {
  const box = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; label?: string }[]>([]);
  const sources = useMemo(() => Array.from(new Set(mappings.map((m) => `${m.source_table}|${m.source_column}`))), [mappings]);
  useLayoutEffect(() => {
    const root = box.current;
    if (!root) return;
    const r = root.getBoundingClientRect();
    setLines(mappings.map((m) => {
      const a = root.querySelector(`[data-s="${m.source_table}|${m.source_column}"]`)?.getBoundingClientRect();
      const b = root.querySelector(`[data-t="${m.target_column}"]`)?.getBoundingClientRect();
      if (!a || !b) return { x1: 0, y1: 0, x2: 0, y2: 0 };
      return { x1: a.right - r.left, y1: a.top + a.height / 2 - r.top, x2: b.left - r.left, y2: b.top + b.height / 2 - r.top, label: m.cond_target_column ? "condition" : undefined };
    }));
  }, [mappings, sources]);
  if (!mappings.length) return null;
  return (
    <div ref={box} className="relative flex justify-between gap-24 rounded-md border border-border/70 p-4">
      <div className="space-y-2">
        {sources.map((k) => { const [t, c] = k.split("|"); return <div key={k} data-s={k} className="rounded border border-border bg-muted px-2 py-1 font-mono text-[11px]">{fieldPath(t, c)}</div>; })}
      </div>
      <div className="space-y-2">
        {mappings.map((m) => <div key={m.id} data-t={m.target_column} className="rounded border border-primary/60 bg-primary/10 px-2 py-1 font-mono text-[11px]">{fieldPath(m.target_table, m.target_column)}</div>)}
      </div>
      <svg className="pointer-events-none absolute inset-0 h-full w-full">
        <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="hsl(var(--primary))" className="fill-primary" /></marker></defs>
        {lines.map((l, i) => (
          <g key={i}>
            <path d={`M${l.x1},${l.y1} C${(l.x1 + l.x2) / 2},${l.y1} ${(l.x1 + l.x2) / 2},${l.y2} ${l.x2},${l.y2}`} className="stroke-primary" fill="none" strokeWidth={1.5} strokeDasharray={l.label ? "4 3" : undefined} markerEnd="url(#arr)" />
          </g>
        ))}
      </svg>
    </div>
  );
}

function Preview({ target, mappings }: { target: string; mappings: FieldMapping[] }) {
  const q = useQuery({ queryKey: ["mapping-preview", target, mappings], queryFn: () => resolveMapping(target, mappings) });
  const cols = findSection(target)?.section.fields ?? [];
  if (!q.data?.length) return <p className="text-xs text-muted-foreground">Aperçu : aucune donnée (ajoutez un champ clé sans condition et des données source).</p>;
  return (
    <div className="overflow-x-auto rounded-md border border-border/70">
      <table className="w-full text-xs">
        <thead><tr>{cols.map((c) => <th key={c.column} className="px-2 py-1 text-left font-mono">{c.label}</th>)}</tr></thead>
        <tbody>{q.data.slice(0, 10).map((r, i) => <tr key={i} className="border-t border-border/50">{cols.map((c) => <td key={c.column} className="px-2 py-1">{String(r[c.column] ?? "—")}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
