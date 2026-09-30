import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useSubmitLead } from "@/lib/site-content";

export const Route = createFileRoute("/cms/contact")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Contact — DODRICOM" },
      {
        name: "description",
        content: "Envoyez votre demande à DODRICOM : elle arrive directement dans notre CRM et notre messagerie.",
      },
      { property: "og:title", content: "Contact — DODRICOM" },
      { property: "og:description", content: "Parlez-nous de votre projet, nous répondons rapidement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const submit = useSubmitLead();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    subject: "",
    message: "",
  });

  const set = (key: keyof typeof form) => (event: { target: { value: string } }) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const send = () => {
    if (!form.full_name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Nom, e-mail et message sont obligatoires.");
      return;
    }
    submit.mutate(form, {
      onSuccess: () => {
        setDone(true);
        setForm({ full_name: "", email: "", phone: "", company_name: "", subject: "", message: "" });
        toast.success("Votre demande a bien été envoyée.");
      },
      onError: (error: Error) => toast.error(error.message),
    });
  };

  return (
    <SiteLayout>
      <section className="border-b border-border/60 px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="label-tech">Contact</div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Parlons de votre projet</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Votre message est transmis immédiatement à notre équipe commerciale et à notre messagerie interne.
          </p>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-[1fr_260px]">
          {done ? (
            <div className="rounded-xl border border-border/70 bg-card/70 p-8 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-primary" />
              <h2 className="mt-3 font-display text-lg font-bold">Merci !</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Nous avons bien reçu votre demande et reviendrons vers vous rapidement.
              </p>
              <Button variant="outline" className="mt-5" onClick={() => setDone(false)}>
                Envoyer un autre message
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 rounded-xl border border-border/70 bg-card/70 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field id="full_name" label="Nom complet *">
                  <Input id="full_name" value={form.full_name} onChange={set("full_name")} />
                </Field>
                <Field id="email" label="E-mail *">
                  <Input id="email" type="email" value={form.email} onChange={set("email")} />
                </Field>
                <Field id="phone" label="Téléphone">
                  <Input id="phone" value={form.phone} onChange={set("phone")} />
                </Field>
                <Field id="company_name" label="Société">
                  <Input id="company_name" value={form.company_name} onChange={set("company_name")} />
                </Field>
              </div>
              <Field id="subject" label="Sujet">
                <Input id="subject" value={form.subject} onChange={set("subject")} />
              </Field>
              <Field id="message" label="Message *">
                <Textarea id="message" rows={5} value={form.message} onChange={set("message")} />
              </Field>
              <Button onClick={send} disabled={submit.isPending}>
                {submit.isPending ? "Envoi…" : "Envoyer la demande"}
              </Button>
            </div>
          )}

          <aside className="space-y-3 text-sm">
            <InfoRow icon={Mail} label="contact@dodricom.ma" />
            <InfoRow icon={Phone} label="+212 (0) 5 00 00 00 00" />
            <InfoRow icon={MapPin} label="Casablanca, Maroc" />
            <p className="text-xs text-muted-foreground">
              Ces coordonnées sont des exemples — indiquez-nous vos vraies informations et nous les mettrons en place.
            </p>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      {children}
    </div>
  );
}

function InfoRow({ icon: Icon, label }: { icon: typeof Mail; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border/70 bg-card/60 px-3 py-2">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-xs">{label}</span>
    </div>
  );
}
