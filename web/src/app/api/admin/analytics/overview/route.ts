import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/admin";

const prisma = new PrismaClient();

const num = (v: unknown): number => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return v;
  return Number(v.toString());
};

export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if ("response" in gate) return gate.response;

  const daysParam = parseInt(req.nextUrl.searchParams.get("days") || "30", 10);
  const days = [7, 30, 90].includes(daysParam) ? daysParam : 30;
  const since = new Date(Date.now() - days * 24 * 3600 * 1000);

  const [
    sessions,
    pageviews,
    distinctVisitors,
    newVisitorRows,
    deviceRows,
    osRows,
    browserRows,
    pageRows,
    refRows,
    utmRows,
    realtime,
  ] = await Promise.all([
    prisma.session.findMany({
      where: { startedAt: { gte: since } },
      select: { startedAt: true, lastSeenAt: true, pageCount: true },
    }),
    prisma.pageView.count({ where: { createdAt: { gte: since } } }),
    prisma.pageView.groupBy({ by: ["visitorId"], where: { createdAt: { gte: since }, visitorId: { not: null } } }),
    prisma.pageView.findMany({
      where: { createdAt: { gte: since }, visitorId: { not: null }, isNewVisitor: true },
      select: { visitorId: true },
      distinct: ["visitorId"],
    }),
    prisma.session.groupBy({ by: ["device"], _count: { _all: true }, where: { startedAt: { gte: since } } }),
    prisma.session.groupBy({ by: ["os"], _count: { _all: true }, where: { startedAt: { gte: since } } }),
    prisma.session.groupBy({ by: ["browser"], _count: { _all: true }, where: { startedAt: { gte: since } } }),
    prisma.pageView.groupBy({
      by: ["path"],
      _count: { _all: true },
      where: { createdAt: { gte: since } },
    }).then((rows) => rows.sort((a, b) => b._count._all - a._count._all).slice(0, 10)),
    prisma.pageView.groupBy({
      by: ["referrer"],
      _count: { _all: true },
      where: { createdAt: { gte: since }, referrer: { not: null } },
    }).then((rows) => rows.sort((a, b) => b._count._all - a._count._all).slice(0, 10)),
    prisma.pageView.groupBy({
      by: ["utmSource"],
      _count: { _all: true },
      where: { createdAt: { gte: since }, utmSource: { not: null } },
    }).then((rows) => rows.sort((a, b) => b._count._all - a._count._all).slice(0, 10)),
    prisma.session.count({ where: { lastSeenAt: { gte: new Date(Date.now() - 5 * 60 * 1000) } } }),
  ]);

  const sessionCount = sessions.length;
  const bounced = sessions.filter((s) => s.pageCount <= 1).length;
  const durations = sessions.map((s) => Math.max(0, (s.lastSeenAt.getTime() - s.startedAt.getTime()) / 1000));
  const avgDuration = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;

  const daily = await prisma.$queryRaw<Array<{ d: Date; sessions: bigint; views: bigint }>>(
    Prisma.sql`SELECT DATE("startedAt") AS d, COUNT(*) AS sessions, SUM("pageCount") AS views FROM "Session" WHERE "startedAt" >= ${since} GROUP BY DATE("startedAt") ORDER BY d ASC`
  );

  const newCount = newVisitorRows.length;
  const returningCount = Math.max(0, distinctVisitors.length - newCount);

  const breakdown = (rows: Array<{ _count: { _all: number } } & Record<string, string | null>>, key: string) =>
    rows.map((r) => ({ name: (r as any)[key] || "Unknown", count: r._count._all }));

  return NextResponse.json({
    days,
    users: { total: distinctVisitors.length, new: newCount, returning: returningCount },
    sessions: sessionCount,
    pageviews,
    pagesPerSession: sessionCount ? Math.round((pageviews / sessionCount) * 100) / 100 : 0,
    avgSessionDurationSec: Math.round(avgDuration),
    bounceRate: sessionCount ? Math.round((bounced / sessionCount) * 1000) / 10 : 0,
    realtime,
    device: breakdown(deviceRows as any, "device"),
    os: breakdown(osRows as any, "os"),
    browser: breakdown(browserRows as any, "browser"),
    topPages: pageRows.map((r) => ({ path: r.path, count: r._count._all })),
    topReferrers: refRows.map((r) => ({ referrer: r.referrer, count: r._count._all })),
    topUtm: utmRows.map((r) => ({ source: r.utmSource, count: r._count._all })),
    daily: daily.map((r) => ({
      date: r.d instanceof Date ? r.d.toISOString().slice(0, 10) : String(r.d).slice(0, 10),
      sessions: Number(r.sessions),
      views: num(r.views),
    })),
  });
}
