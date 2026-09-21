import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, type Prisma } from "@prisma/client";
import { extractDesignKit, loadTemplateImages } from "@/lib/render/designKit";
import { requireAdminWrite } from "@/lib/admin";

const prisma = new PrismaClient();

// POST /api/admin/backfill-designkits?max=3
// One-time: extract design kits for templates that don't have one yet.
// Runs sequentially to avoid provider rate limits. Each call ~60-90s.
export async function POST(req: NextRequest) {
  const gate = await requireAdminWrite();
  if ("response" in gate) return gate.response;

  const max = Math.min(10, Math.max(1, parseInt(req.nextUrl.searchParams.get("max") || "3", 10)));

  const all = await prisma.template.findMany({
    where: { fileUrl: { not: null } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const pending = all.filter((t) => !t.designKit).slice(0, max);
  const results: Array<{ id: string; title: string; ok: boolean; error?: string; seconds: number }> = [];

  for (const t of pending) {
    const t0 = Date.now();
    try {
      const images = loadTemplateImages(t.thumbnails, t.fileUrl);
      if (images.length === 0) {
        results.push({ id: t.id, title: t.title, ok: false, error: "no readable thumbnails", seconds: 0 });
        continue;
      }
      const kit = await extractDesignKit(t.title, images);
      await prisma.template.update({ where: { id: t.id }, data: { designKit: kit as unknown as Prisma.InputJsonValue } });
      results.push({ id: t.id, title: t.title, ok: true, seconds: Math.round((Date.now() - t0) / 1000) });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      results.push({ id: t.id, title: t.title, ok: false, error: msg.slice(0, 200), seconds: Math.round((Date.now() - t0) / 1000) });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
