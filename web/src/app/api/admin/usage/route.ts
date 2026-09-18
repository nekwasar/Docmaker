import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin } from "@/lib/admin";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if ("response" in gate) return gate.response;

  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") || "20", 10)));
  const model = sp.get("model") || undefined;
  const from = sp.get("from") ? new Date(sp.get("from") as string) : undefined;
  const to = sp.get("to") ? new Date(sp.get("to") as string) : undefined;

  const where: any = {};
  if (model) where.model = { contains: model, mode: "insensitive" };
  if (from || to) {
    where.createdAt = {};
    if (from && !isNaN(from.getTime())) where.createdAt.gte = from;
    if (to && !isNaN(to.getTime())) where.createdAt.lte = to;
  }

  const [total, items] = await Promise.all([
    prisma.apiUsageLog.count({ where }),
    prisma.apiUsageLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    total,
    page,
    limit,
    items: items.map((r) => ({
      ...r,
      estimatedCostUsd: Number(r.estimatedCostUsd),
    })),
  });
}
