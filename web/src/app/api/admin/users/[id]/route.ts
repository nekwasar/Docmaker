import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdminWrite, audit, ROLES, roleRank } from "@/lib/admin";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAdminWrite();
  if ("response" in gate) return gate.response;
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const data: Record<string, string | number> = {};
  if (body.role !== undefined) {
    if (!(ROLES as readonly string[]).includes(body.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    // Lockout guard: your own role is immutable.
    if (id === gate.user.id && body.role !== gate.user.role) {
      return NextResponse.json({ error: "You cannot change your own role" }, { status: 400 });
    }
    // Hierarchy guard: peers are manageable, ranks above you are not.
    const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (roleRank(target.role) > roleRank(gate.user.role)) {
      return NextResponse.json({ error: "You cannot modify a user above your rank" }, { status: 403 });
    }
    if (roleRank(body.role) > roleRank(gate.user.role)) {
      return NextResponse.json({ error: "You cannot grant a rank above your own" }, { status: 403 });
    }
    data.role = body.role;
  }
  if (body.credits !== undefined) {
    const n = parseInt(body.credits, 10);
    if (isNaN(n) || n < 0) return NextResponse.json({ error: "Invalid credits" }, { status: 400 });
    data.credits = n;
  }
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const user = await prisma.user
    .update({
      where: { id },
      data,
      select: { id: true, email: true, name: true, role: true, credits: true, usedCredits: true },
    })
    .catch(() => null);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await audit("admin.user.update", gate.user.id, { id, ...data });
  return NextResponse.json({ user });
}
