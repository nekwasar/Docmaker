import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin, audit } from "@/lib/admin";

const prisma = new PrismaClient();

function csvCell(v: unknown): string {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: NextRequest) {
  const gate = await requireAdmin();
  if ("response" in gate) return gate.response;

  const status = req.nextUrl.searchParams.get("status") || undefined;
  const subs = await prisma.subscriber.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    take: 10000,
  });

  const rows = ["email,name,status,source,createdAt"];
  for (const s of subs) {
    rows.push(
      [csvCell(s.email), csvCell(s.name), csvCell(s.status), csvCell(s.source), csvCell(s.createdAt.toISOString())].join(",")
    );
  }
  await audit("admin.subscriber.export", gate.user.id, { count: subs.length });
  return new Response(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
