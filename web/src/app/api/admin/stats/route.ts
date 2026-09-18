import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/admin";

const prisma = new PrismaClient();

const num = (v: unknown): number => {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return v;
  return Number(v.toString());
};

export async function GET() {
  const gate = await requireAdmin();
  if ("response" in gate) return gate.response;

  const now = new Date();
  const d30 = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
  const d7 = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
  const d14 = new Date(now.getTime() - 14 * 24 * 3600 * 1000);

  const [spendTotal, spend30d, gensTotal, gens30d, byModel, visitorsTotal, visitors7d, subscribers] =
    await Promise.all([
      prisma.apiUsageLog.aggregate({ _sum: { estimatedCostUsd: true } }),
      prisma.apiUsageLog.aggregate({ _sum: { estimatedCostUsd: true }, where: { createdAt: { gte: d30 } } }),
      prisma.apiUsageLog.count(),
      prisma.apiUsageLog.count({ where: { createdAt: { gte: d30 } } }),
      prisma.apiUsageLog.groupBy({
        by: ["model"],
        _sum: { estimatedCostUsd: true },
        _count: { _all: true },
        orderBy: { _sum: { estimatedCostUsd: "desc" } },
        take: 10,
      }),
      prisma.pageView.count(),
      prisma.pageView.count({ where: { createdAt: { gte: d7 } } }),
      prisma.subscriber.count({ where: { status: "subscribed" } }),
    ]);

  const daily = await prisma.$queryRaw<Array<{ d: Date; cost: unknown; count: bigint }>>(
    Prisma.sql`SELECT DATE("createdAt") AS d, SUM("estimatedCostUsd") AS cost, COUNT(*) AS count FROM "ApiUsageLog" WHERE "createdAt" >= ${d14} GROUP BY DATE("createdAt") ORDER BY d ASC`
  );

  return NextResponse.json({
    spend: {
      totalUsd: num(spendTotal._sum.estimatedCostUsd),
      last30dUsd: num(spend30d._sum.estimatedCostUsd),
    },
    generations: { total: gensTotal, last30d: gens30d },
    visitors: { total: visitorsTotal, last7d: visitors7d },
    subscribers,
    byModel: byModel.map((r) => ({
      model: r.model,
      costUsd: num(r._sum.estimatedCostUsd),
      count: r._count._all,
    })),
    dailySpend: daily.map((r) => ({
      date: r.d instanceof Date ? r.d.toISOString().slice(0, 10) : String(r.d).slice(0, 10),
      costUsd: num(r.cost),
      count: Number(r.count),
    })),
  });
}
