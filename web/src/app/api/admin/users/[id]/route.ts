import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireAdmin, audit } from "@/lib/admin";

const prisma = new PrismaClient();

const ROLES = ["free", "pro", "admin"] as const;

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if ("response" in gate) return gate.response;
  const { id } = await params;

  // Prevent demoting yourself out of admin (lockout guard).
  const body = await req.json().catch(() => ({}));
  const data: Record<string, string | number> = {};
  if (body.role !== undefined) {
    if (!(ROLES as readonly string[]).includes(body.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }
    if (id === gate.user.id && body.role !== "admin") {
      return NextResponse.json({ error: "You cannot demote yourself" }, { status: 400 });
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
