import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const tpl = await prisma.template.findUnique({ where: { id } });
    if (!tpl) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Remove files if any
    const toDelete: string[] = [];
    if (tpl.fileUrl) toDelete.push(tpl.fileUrl);
    if (Array.isArray(tpl.thumbnails)) toDelete.push(...(tpl.thumbnails as string[]));
    for (const url of toDelete) {
      try {
        const fp = path.join(process.cwd(), "public", url.replace(/^\//, ""));
        if (fs.existsSync(fp)) fs.unlinkSync(fp);
      } catch {}
    }

    await prisma.template.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
