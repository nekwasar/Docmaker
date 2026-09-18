import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";

const prisma = new PrismaClient();

// In-memory per-session throttle: 1 view per path per 5s (best-effort, dev-safe).
const lastHit = new Map<string, number>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawPath = typeof body.path === "string" ? body.path : "/";
    const path = rawPath.slice(0, 200) || "/";
    const sessionId = (typeof body.sessionId === "string" ? body.sessionId : null)?.slice(0, 64) || null;

    const throttleKey = `${sessionId ?? "anon"}:${path}`;
    const now = Date.now();
    const last = lastHit.get(throttleKey) || 0;
    if (now - last < 5000) return NextResponse.json({ ok: true, throttled: true });
    lastHit.set(throttleKey, now);
    if (lastHit.size > 5000) {
      const cutoff = now - 60000;
      for (const [k, v] of lastHit) if (v < cutoff) lastHit.delete(k);
    }

    const fwd = req.headers.get("x-forwarded-for");
    const ip = (fwd ? fwd.split(",")[0].trim() : null)?.slice(0, 64) || null;
    const userAgent = req.headers.get("user-agent")?.slice(0, 500) || null;
    const referrer = (typeof body.referrer === "string" ? body.referrer : req.headers.get("referer"))?.slice(0, 500) || null;
    const session = await getSession().catch(() => null);

    await prisma.pageView.create({
      data: {
        path,
        sessionId,
        userId: session?.id ?? null,
        ip,
        userAgent,
        referrer,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
