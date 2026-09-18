import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin, audit } from "@/lib/admin";
import { getSetting, setSetting, maskSecret } from "@/lib/settings";

const prisma = new PrismaClient();

const EDITABLE_KEYS = ["AI_PROVIDER", "AI_API_KEY", "AI_MODEL", "AI_BASE_URL", "GATE_THRESHOLD", "GATE_ENABLED"] as const;

export async function GET() {
  const gate = await requireAdmin();
  if ("response" in gate) return gate.response;

  const entries: Record<string, { value: string; masked: boolean }> = {};
  for (const key of EDITABLE_KEYS) {
    const raw = await getSetting(key);
    if (key === "AI_API_KEY") {
      entries[key] = { value: raw ? maskSecret(raw) : "", masked: true };
    } else {
      entries[key] = { value: raw ?? "", masked: false };
    }
  }
  return NextResponse.json({ settings: entries });
}

export async function PUT(req: NextRequest) {
  const gate = await requireAdmin();
  if ("response" in gate) return gate.response;

  const body = await req.json().catch(() => ({}));
  const changed: string[] = [];

  for (const key of EDITABLE_KEYS) {
    if (!(key in body)) continue;
    // Explicit JSON null clears the key (shadows env with empty).
    if (body[key] === null) {
      await setSetting(key, "", gate.user.id);
      changed.push(key);
      continue;
    }
    const val = String(body[key] ?? "");
    // Skip masked placeholder (means "unchanged" for the API key).
    if (key === "AI_API_KEY" && (val === "" || val.startsWith("••••"))) continue;
    if (key === "GATE_THRESHOLD") {
      const n = parseInt(val, 10);
      if (isNaN(n) || n < 0 || n > 100) {
        return NextResponse.json({ error: "GATE_THRESHOLD must be 0-100" }, { status: 400 });
      }
    }
    if (key === "GATE_ENABLED" && val !== "true" && val !== "false") {
      return NextResponse.json({ error: "GATE_ENABLED must be true/false" }, { status: 400 });
    }
    await setSetting(key, val, gate.user.id);
    changed.push(key);
  }

  await audit("admin.settings.update", gate.user.id, { changed });
  return NextResponse.json({ ok: true, changed });
}
