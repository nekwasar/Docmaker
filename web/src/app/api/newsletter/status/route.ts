import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSetting } from "@/lib/settings";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const sessionId = sp.get("sessionId")?.slice(0, 64) || null;
    const email = sp.get("email")?.trim().toLowerCase() || null;

    const [thresholdRaw, enabledRaw] = await Promise.all([
      getSetting("GATE_THRESHOLD"),
      getSetting("GATE_ENABLED"),
    ]);
    const threshold = Math.max(0, parseInt(thresholdRaw || "2", 10) || 0);
    const enabled = (enabledRaw ?? "true") !== "false";

    let generations = 0;
    if (sessionId) {
      generations = await prisma.apiUsageLog.count({ where: { sessionId } });
    }

    let subscribed = req.cookies.get("subscribed")?.value === "1";
    if (!subscribed && email) {
      const sub = await prisma.subscriber.findUnique({ where: { email } });
      subscribed = !!sub && sub.status === "subscribed";
    }

    return NextResponse.json({
      generations,
      threshold,
      enabled,
      subscribed,
      mustSubscribe: enabled && !subscribed && generations >= threshold,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
