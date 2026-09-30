import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/** Presentation helpers shared by every module workspace. */

export function ModuleHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="label-tech">{eyebrow}</div>
        <h2 className="font-display text-lg font-bold text-gradient">{title}</h2>
        {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatGrid({
  items,
}: {
  items: { label: string; value: string | number; icon?: LucideIcon; hint?: string }[];
}) {
  return (
    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-md border border-border/80 bg-card/75 p-3">
          {item.icon ? <item.icon className="h-4 w-4 text-primary" /> : null}
          <div className="mt-2 text-[10px] uppercase tracking-wide text-muted-foreground">{item.label}</div>
          <div className="font-display text-base font-bold">{item.value}</div>
          {item.hint ? <div className="text-[10px] text-muted-foreground">{item.hint}</div> : null}
        </div>
      ))}
    </div>
  );
}

export function DataTable({
  columns,
  rows,
  empty = "Aucune donnée pour le moment.",
}: {
  columns: string[];
  rows: ReactNode[][];
  empty?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-border/80">
      <table className="w-full text-left text-xs">
        <thead className="bg-muted/40 text-[10px] uppercase tracking-wide text-muted-foreground">
          <tr>
            {columns.map((c) => (
              <th key={c} className="px-3 py-2 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-8 text-center text-muted-foreground">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((cells, index) => (
              <tr key={index} className="border-t border-border/60 align-middle hover:bg-muted/20">
                {cells.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-3 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Pill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
      {label}
    </span>
  );
}
