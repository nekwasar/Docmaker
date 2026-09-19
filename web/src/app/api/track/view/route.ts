import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";

const prisma = new PrismaClient();

// In-memory throttles (best-effort, per instance).
const viewHits = new Map<string, number>();
const beatHits = new Map<string, number>();

function hit(map: Map<string, number>, key: string, windowMs: number): boolean {
  const now = Date.now();
  const last = map.get(key) || 0;
  if (now - last < windowMs) return true;
  map.set(key, now);
  if (map.size > 5000) {
    for (const [k, v] of map) if (v < now - 60000) map.delete(k);
  }
  return false;
}

function parseUA(ua: string | null): { device: string; os: string; browser: string } {
  const s = ua || "";
  const tablet = /ipad|tablet|playbook|silk(?!.*mobile)/i.test(s);
  const mobile = tablet ? false : /mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(s);
  const device = tablet ? "tablet" : mobile ? "mobile" : "desktop";
  let os = "Other";
  if (/windows nt/i.test(s)) os = "Windows";
  else if (/iphone|ipad|ipod/i.test(s)) os = "iOS";
  else if (/android/i.test(s)) os = "Android";
  else if (/mac os x/i.test(s)) os = "macOS";
  else if (/linux/i.test(s)) os = "Linux";
  else if (/cros/i.test(s)) os = "ChromeOS";
  let browser = "Other";
  if (/edg\//i.test(s)) browser = "Edge";
  else if (/opr\/|opera/i.test(s)) browser = "Opera";
  else if (/chrome\/|crios\//i.test(s)) browser = "Chrome";
  else if (/firefox\/|fxios\//i.test(s)) browser = "Firefox";
  else if (/safari\//i.test(s)) browser = "Safari";
  return { device, os, browser };
}

const clean = (v: unknown, max: number): string | null => {
  if (typeof v !== "string" || !v) return null;
  return v.slice(0, max);
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const type = body.type === "heartbeat" ? "heartbeat" : "view";

    const rawPath = typeof body.path === "string" ? body.path : "/";
    if (!rawPath.startsWith("/")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }
    const path = rawPath.slice(0, 200) || "/";
    const sessionId = clean(body.sessionId, 64);
    const visitorId = clean(body.visitorId, 64);

    if (type === "heartbeat") {
      if (!sessionId) return NextResponse.json({ ok: true });
      if (hit(beatHits, sessionId, 20000)) return NextResponse.json({ ok: true, throttled: true });
      await prisma.session
        .update({ where: { id: sessionId }, data: { lastSeenAt: new Date() } })
        .catch(() => null);
      return NextResponse.json({ ok: true });
    }

    const throttleKey = `${visitorId ?? "anon"}:${sessionId ?? "nosess"}:${path}`;
    if (hit(viewHits, throttleKey, 5000)) return NextResponse.json({ ok: true, throttled: true });

    const fwd = req.headers.get("x-forwarded-for");
    const ip = (fwd ? fwd.split(",")[0].trim() : null)?.slice(0, 64) || null;
    const userAgent = req.headers.get("user-agent")?.slice(0, 500) || null;
    const referrer = clean(body.referrer ?? req.headers.get("referer"), 500);
    const session = await getSession().catch(() => null);
    const { device, os, browser } = parseUA(userAgent);

    // Unique-visitor + new-session detection (server-side truth).
    let isNewVisitor = false;
    if (visitorId) {
      const seen = await prisma.pageView.findFirst({
        where: { visitorId },
        select: { id: true },
      });
      isNewVisitor = !seen;
    }
    let isNewSession = true;
    if (sessionId) {
      const existing = await prisma.session.findUnique({ where: { id: sessionId } });
      isNewSession = !existing;
    }

    const now = new Date();
    if (sessionId) {
      await prisma.session
        .upsert({
          where: { id: sessionId },
          create: {
            id: sessionId,
            visitorId,
            userId: session?.id ?? null,
            landingPath: path,
            referrer,
            device,
            os,
            browser,
            startedAt: now,
            lastSeenAt: now,
            pageCount: 1,
          },
          update: {
            lastSeenAt: now,
            pageCount: { increment: 1 },
            visitorId: visitorId ?? undefined,
            userId: session?.id ?? undefined,
          },
        })
        .catch(() => null);
    }

    await prisma.pageView.create({
      data: {
        path,
        title: clean(body.title, 200),
        sessionId,
        visitorId,
        userId: session?.id ?? null,
        isNewVisitor,
        isNewSession,
        device,
        os,
        browser,
        screen: clean(body.screen, 32),
        language: clean(body.language, 16),
        timezone: clean(body.timezone, 64),
        utmSource: clean(body.utm?.source, 100),
        utmMedium: clean(body.utm?.medium, 100),
        utmCampaign: clean(body.utm?.campaign, 100),
        ip,
        userAgent,
        referrer,
      },
    });
    return NextResponse.json({ ok: true, isNewVisitor, isNewSession });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
