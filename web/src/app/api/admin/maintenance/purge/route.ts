import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdminWrite, audit } from "@/lib/admin";

const prisma = new PrismaClient();

// Retention: raw PageView rows (with IP/UA) older than 90 days are deleted.
// Aggregates (top paths, counts) are computed live, so nothing else is needed.
export async function POST(req: NextRequest) {
  const gate = await requireAdminWrite();
  if ("response" in gate) return gate.response;

  const body = await req.json().catch(() => ({}));
  const days = Math.min(365, Math.max(1, parseInt(body.days ?? "90", 10) || 90));
  const cutoff = new Date(Date.now() - days * 24 * 3600 * 1000);

  const deleted = await prisma.pageView.deleteMany({ where: { createdAt: { lt: cutoff } } });
  await audit("admin.maintenance.purge", gate.user.id, { days, deleted: deleted.count });
  return NextResponse.json({ ok: true, days, deleted: deleted.count });
}
