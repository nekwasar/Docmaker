import { NextResponse } from "next/server";
import { requireAdmin, audit } from "@/lib/admin";
import { getAIConfigAsync } from "@/lib/ai/config";

// Tiny non-streamed ping. Deliberately NOT logged to ApiUsageLog.
export async function POST() {
  const gate = await requireAdmin();
  if ("response" in gate) return gate.response;

  try {
    const config = await getAIConfigAsync();
    if (!config.apiKey) {
      return NextResponse.json({ ok: false, error: "No API key configured" }, { status: 400 });
    }
    const baseUrl =
      config.baseUrl ||
      (config.provider === "openrouter"
        ? "https://openrouter.ai/api/v1"
        : config.provider === "ollama"
          ? "http://localhost:11434/v1"
          : config.provider === "anthropic"
            ? "https://api.anthropic.com/v1"
            : "https://api.openai.com/v1");

    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
        ...(config.provider === "openrouter" && { "HTTP-Referer": "https://docmaker.io" }),
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: "user", content: "Reply with the single word: ok" }],
        max_tokens: 5,
        stream: false,
      }),
    });
    const body = await res.text();
    await audit("admin.settings.test", gate.user.id, { ok: res.ok, status: res.status });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `Provider ${res.status}: ${body.slice(0, 200)}` }, { status: 502 });
    }
    return NextResponse.json({ ok: true, model: config.model, provider: config.provider });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
