import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Thin data layer shared by the business modules (CMS, CRM, Finance, Message).
 * Every module keeps its own tables; the Core only provides auth + registry.
 */
type Row = Record<string, unknown>;

export function useRows<T = Row>(
  table: string,
  options?: { orderBy?: string; ascending?: boolean; select?: string },
) {
  return useQuery({
    queryKey: ["mod", table, options?.orderBy ?? "", options?.select ?? "*"],
    queryFn: async (): Promise<T[]> => {
      let query = supabase.from(table as never).select((options?.select ?? "*") as never);
      if (options?.orderBy) {
        query = query.order(options.orderBy, { ascending: options.ascending ?? true }) as never;
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as unknown as T[];
    },
  });
}

export function useSaveRow(table: string, label = "Enregistré") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: Row & { id?: string }) => {
      const { id, ...rest } = values;
      if (id) {
        const { error } = await supabase
          .from(table as never)
          .update(rest as never)
          .eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table as never).insert(rest as never);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mod", table] });
      toast.success(label);
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteRow(table: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(table as never)
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mod", table] });
      toast.success("Supprimé");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function money(value: number | string | null | undefined, currency = "MAD") {
  const amount = Number(value ?? 0);
  return `${amount.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}

export function shortDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}
