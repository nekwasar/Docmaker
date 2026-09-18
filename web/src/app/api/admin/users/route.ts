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
  const q = sp.get("q") || undefined;
  const role = sp.get("role") || undefined;

  const where: any = {};
  if (role) where.role = role;
  if (q) {
    where.OR = [
      { email: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, items] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        credits: true,
        usedCredits: true,
        createdAt: true,
      },
    }),
  ]);

  return NextResponse.json({ total, page, limit, items });
}
