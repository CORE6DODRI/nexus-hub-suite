import { useState } from "react";
import { Inbox, Mail, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModuleHeader, DataTable, Pill, StatGrid } from "@/components/modules/ModuleKit";
import { CrudPanel } from "@/components/modules/CrudPanel";
import { shortDate, useRows, useSaveRow } from "@/lib/modules/db";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ModuleUIProps } from "@/modules/registry";

type InboxItem = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  body: string;
  source: string;
  status: string;
  created_at: string;
};
type Thread = { id: string; subject: string; kind: string; status: string; last_message_at: string | null; created_at: string };
type Message = { id: string; thread_id: string; sender_label: string | null; body: string; created_at: string };

const TABS = ["Boîte de réception", "Conversations"] as const;

export default function MessageModuleUI({ name, version }: ModuleUIProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Boîte de réception");
  const inbox = useRows<InboxItem>("msg_inbox", { orderBy: "created_at", ascending: false });
  const threads = useRows<Thread>("msg_threads", { orderBy: "last_message_at", ascending: false });
  const saveInbox = useSaveRow("msg_inbox", "Statut mis à jour");

  const items = inbox.data ?? [];

  return (
    <div className="space-y-4">
      <ModuleHeader
        eyebrow="Module messagerie"
        title={`${name} workspace`}
        description={`Demandes du site web et conversations internes · v${version}`}
      />

      <StatGrid
        items={[
          { label: "Messages reçus", value: items.length, icon: Inbox },
          { label: "Non traités", value: items.filter((i) => i.status === "new").length, icon: Mail },
          { label: "Depuis le site", value: items.filter((i) => i.source === "website").length, icon: MessageSquare },
          { label: "Conversations", value: (threads.data ?? []).length, icon: Send },
        ]}
      />

      <div className="flex flex-wrap gap-1.5">
        {TABS.map((item) => (
          <Button key={item} size="sm" variant={tab === item ? "default" : "ghost"} onClick={() => setTab(item)}>
            {item}
          </Button>
        ))}
      </div>

      {tab === "Boîte de réception" ? (
        <div className="space-y-3">
          <div className="section-title">Demandes entrantes</div>
          <DataTable
            columns={["Expéditeur", "Sujet", "Message", "Source", "Statut", "Reçu", ""]}
            empty="Aucune demande. Le formulaire du site web alimente cette liste."
            rows={items.map((item) => [
              <div key="who">
                <div className="font-medium">{item.full_name}</div>
                <div className="text-[10px] text-muted-foreground">{item.email ?? item.phone ?? "—"}</div>
              </div>,
              item.subject ?? "—",
              <span key="body" className="line-clamp-2 block max-w-sm text-muted-foreground">
                {item.body}
              </span>,
              <Pill key="src" label={item.source} />,
              <Pill key="status" label={item.status} />,
              shortDate(item.created_at),
              <Button
                key="action"
                size="sm"
                variant="ghost"
                onClick={() =>
                  saveInbox.mutate({ id: item.id, status: item.status === "new" ? "handled" : "new" })
                }
              >
                {item.status === "new" ? "Marquer traité" : "Réouvrir"}
              </Button>,
            ])}
          />
        </div>
      ) : null}

      {tab === "Conversations" ? <Threads threads={threads.data ?? []} /> : null}
    </div>
  );
}

function Threads({ threads }: { threads: Thread[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = activeId ?? threads[0]?.id ?? null;

  return (
    <div className="grid gap-3 lg:grid-cols-[320px_1fr]">
      <div className="space-y-3">
        <CrudPanel<Thread>
          table="msg_threads"
          title="Conversations"
          orderBy="created_at"
          fields={[
            { name: "subject", label: "Sujet", required: true },
            { name: "kind", label: "Type", type: "select", options: ["internal", "client", "support"], defaultValue: "internal" },
            { name: "status", label: "Statut", type: "select", options: ["open", "closed"], defaultValue: "open" },
          ]}
          columns={[
            {
              header: "Sujet",
              render: (row) => (
                <button type="button" className="text-left font-medium hover:underline" onClick={() => setActiveId(row.id)}>
                  {row.subject}
                </button>
              ),
            },
            { header: "Statut", render: (row) => <Pill label={row.status} /> },
          ]}
        />
      </div>
      {active ? <ThreadPanel threadId={active} /> : <div className="text-xs text-muted-foreground">Sélectionnez une conversation.</div>}
    </div>
  );
}

function ThreadPanel({ threadId }: { threadId: string }) {
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const messages = useQuery({
    queryKey: ["msg_messages", threadId],
    queryFn: async (): Promise<Message[]> => {
      const { data, error } = await supabase
        .from("msg_messages")
        .select("id, thread_id, sender_label, body, created_at")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const send = async () => {
    if (!text.trim()) return;
    const { error } = await supabase.from("msg_messages").insert({ thread_id: threadId, body: text.trim() });
    if (error) {
      toast.error(error.message);
      return;
    }
    await supabase.from("msg_threads").update({ last_message_at: new Date().toISOString() }).eq("id", threadId);
    setText("");
    qc.invalidateQueries({ queryKey: ["msg_messages", threadId] });
    qc.invalidateQueries({ queryKey: ["mod", "msg_threads"] });
  };

  return (
    <div className="flex min-h-[320px] flex-col rounded-md border border-border/80 bg-card/70">
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {(messages.data ?? []).length === 0 ? (
          <div className="text-xs text-muted-foreground">Aucun message dans cette conversation.</div>
        ) : null}
        {(messages.data ?? []).map((message) => (
          <div key={message.id} className="rounded-md border border-border/60 bg-background/70 p-2.5">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>{message.sender_label ?? "Utilisateur"}</span>
              <span>{new Date(message.created_at).toLocaleString("fr-FR")}</span>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-xs">{message.body}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-border/70 p-2.5">
        <Input
          value={text}
          placeholder="Écrire un message…"
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void send();
            }
          }}
        />
        <Button size="sm" onClick={() => void send()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
