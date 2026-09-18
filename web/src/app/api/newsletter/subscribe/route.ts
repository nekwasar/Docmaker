import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Best-effort per-IP throttle: 5 subscribes/minute (prevents list bombing).
const subHits = new Map<string, number[]>();

function throttled(ip: string | null): boolean {
  if (!ip) return false;
  const now = Date.now();
  const arr = (subHits.get(ip) || []).filter((t) => now - t < 60000);
  arr.push(now);
  subHits.set(ip, arr);
  if (subHits.size > 2000) {
    for (const [k, v] of subHits) if (v[v.length - 1] < now - 60000) subHits.delete(k);
  }
  return arr.length > 5;
}

export async function POST(req: NextRequest) {
  try {
    const fwd = req.headers.get("x-forwarded-for");
    const ip = fwd ? fwd.split(",")[0].trim() : null;
    if (throttled(ip)) {
      return NextResponse.json({ error: "Too many requests, try again later" }, { status: 429 });
    }
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : null;
    const source = typeof body.source === "string" ? body.source.trim().slice(0, 50) : "gate";

    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const sub = await prisma.subscriber.upsert({
      where: { email },
      create: { email, name, source, status: "subscribed" },
      update: { status: "subscribed", name: name ?? undefined },
    });

    const res = NextResponse.json({ ok: true, id: sub.id });
    res.cookies.set("subscribed", "1", {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 365 * 24 * 3600,
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
