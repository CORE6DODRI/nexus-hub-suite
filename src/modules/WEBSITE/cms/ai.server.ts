// Server-only AI helper using the built-in AI gateway.
export async function generateText(opts: { system: string; parts: { text: string }[]; json?: boolean }): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("IA indisponible : LOVABLE_API_KEY manquante.");
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: opts.system },
        { role: "user", content: opts.parts.map((p) => p.text).join("\n") },
      ],
      ...(opts.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (res.status === 429) throw new Error("Trop de requêtes IA, réessayez dans un instant.");
  if (res.status === 402) throw new Error("Crédits IA épuisés.");
  if (!res.ok) throw new Error(`Erreur IA [${res.status}]: ${await res.text()}`);
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return json.choices?.[0]?.message?.content ?? "";
}
