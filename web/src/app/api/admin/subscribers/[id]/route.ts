import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin, audit } from "@/lib/admin";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if ("response" in gate) return gate.response;
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const data: Record<string, string> = {};
  if (body.status === "subscribed" || body.status === "unsubscribed") data.status = body.status;
  if (typeof body.name === "string") data.name = body.name.slice(0, 100);
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const sub = await prisma.subscriber.update({ where: { id }, data }).catch(() => null);
  if (!sub) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await audit("admin.subscriber.update", gate.user.id, { id, ...data });
  return NextResponse.json({ subscriber: sub });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if ("response" in gate) return gate.response;
  const { id } = await params;

  await prisma.subscriber.delete({ where: { id } }).catch(() => null);
  await audit("admin.subscriber.delete", gate.user.id, { id });
  return NextResponse.json({ ok: true });
}
