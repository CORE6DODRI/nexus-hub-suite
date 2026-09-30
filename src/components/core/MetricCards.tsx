import type { LucideIcon } from "lucide-react";

export type Metric = { label: string; value: string | number; icon: LucideIcon; hint?: string };

export function MetricCards({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {metrics.map((m) => (
        <div key={m.label} className="metric-card animate-rise min-h-28 p-4">
          <div className="flex items-start justify-between">
            <div className="label-tech">{m.label}</div>
            <span className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary"><m.icon className="h-4 w-4" /></span>
          </div>
          <div className="mt-4 font-display text-2xl font-bold text-foreground">{m.value}</div>
          <div className="mt-2 flex items-center gap-2"><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"><span className="block h-full w-2/3 rounded-full bg-primary" /></span>{m.hint && <span className="text-[9px] text-muted-foreground">{m.hint}</span>}</div>
        </div>
      ))}
    </div>
  );
}
