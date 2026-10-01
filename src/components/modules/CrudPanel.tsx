import { useState, type ReactNode } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/modules/ModuleKit";
import { useDeleteRow, useRows, useSaveRow } from "@/lib/modules/db";

export type FieldSpec = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select" | "checkbox";
  options?: (string | { value: string; label: string })[];
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number | boolean;
};

export type ColumnSpec<T> = {
  header: string;
  render: (row: T) => ReactNode;
};

type Row = Record<string, unknown> & { id: string };

/**
 * Generic create / read / update / delete surface used by the business modules.
 * It talks to one table and renders a dialog form built from `fields`.
 */
export function CrudPanel<T extends Row>({
  table,
  title,
  fields,
  columns,
  orderBy,
  ascending = false,
  empty,
  extraDefaults,
  toolbar,
  filter,
}: {
  table: string;
  title: string;
  fields: FieldSpec[];
  columns: ColumnSpec<T>[];
  orderBy?: string;
  ascending?: boolean;
  empty?: string;
  extraDefaults?: Record<string, unknown>;
  toolbar?: ReactNode;
  filter?: (row: T) => boolean;
}) {
  const rows = useRows<T>(table, { orderBy: orderBy ?? "created_at", ascending });
  const save = useSaveRow(table);
  const remove = useDeleteRow(table);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Record<string, unknown>>({});

  const openNew = () => {
    const initial: Record<string, unknown> = { ...extraDefaults };
    fields.forEach((f) => {
      if (f.defaultValue !== undefined) initial[f.name] = f.defaultValue;
      else if (f.type === "checkbox") initial[f.name] = false;
      else initial[f.name] = "";
    });
    setDraft(initial);
    setOpen(true);
  };

  const openEdit = (row: T) => {
    const initial: Record<string, unknown> = { id: row.id };
    fields.forEach((f) => {
      initial[f.name] = (row[f.name] as unknown) ?? (f.type === "checkbox" ? false : "");
    });
    setDraft(initial);
    setOpen(true);
  };

  const submit = () => {
    const payload: Record<string, unknown> = { ...extraDefaults, ...draft };
    fields.forEach((f) => {
      const value = payload[f.name];
      if (f.type === "number") payload[f.name] = value === "" || value === null ? 0 : Number(value);
      if ((f.type === "date" || f.type === "text" || f.type === "textarea" || f.type === "select" || !f.type) && value === "") {
        payload[f.name] = f.required ? "" : null;
      }
    });
    save.mutate(payload as Row, { onSuccess: () => setOpen(false) });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="section-title">{title}</div>
        <div className="flex items-center gap-2">
          {toolbar}
          <Button size="sm" onClick={openNew}>
            <Plus className="mr-1.5 h-4 w-4" /> Nouveau
          </Button>
        </div>
      </div>

      <DataTable
        columns={[...columns.map((c) => c.header), ""]}
        empty={empty}
        rows={(rows.data ?? []).filter((row) => (filter ? filter(row) : true)).map((row) => [
          ...columns.map((c) => c.render(row)),
          <div key="actions" className="flex justify-end gap-1">
            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEdit(row)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive"
              onClick={() => remove.mutate(row.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>,
        ])}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{draft["id"] ? `Modifier — ${title}` : `Ajouter — ${title}`}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            {fields.map((field) => (
              <div key={field.name} className="grid gap-1.5">
                <Label htmlFor={field.name} className="text-xs">
                  {field.label}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    rows={3}
                    value={String(draft[field.name] ?? "")}
                    placeholder={field.placeholder}
                    onChange={(event) => setDraft((d) => ({ ...d, [field.name]: event.target.value }))}
                  />
                ) : field.type === "select" ? (
                  <select
                    id={field.name}
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={String(draft[field.name] ?? "")}
                    onChange={(event) => setDraft((d) => ({ ...d, [field.name]: event.target.value }))}
                  >
                    <option value="">—</option>
                    {(field.options ?? []).map((option) => {
                      const o = typeof option === "string" ? { value: option, label: option } : option;
                      return (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      );
                    })}
                  </select>
                ) : field.type === "checkbox" ? (
                  <input
                    id={field.name}
                    type="checkbox"
                    className="h-4 w-4"
                    checked={Boolean(draft[field.name])}
                    onChange={(event) => setDraft((d) => ({ ...d, [field.name]: event.target.checked }))}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                    value={String(draft[field.name] ?? "")}
                    placeholder={field.placeholder}
                    onChange={(event) => setDraft((d) => ({ ...d, [field.name]: event.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button onClick={submit} disabled={save.isPending}>
              {save.isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
