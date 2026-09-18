import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : null;
    const source = typeof body.source === "string" ? body.source.trim().slice(0, 50) : "gate";

    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }

    const sub = await prisma.subscriber.upsert({
      where: { email },
      create: { email, name, source, status: "subscribed" },
      update: { status: "subscribed", name: name ?? undefined },
    });

    const res = NextResponse.json({ ok: true, id: sub.id });
    res.cookies.set("subscribed", "1", {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 365 * 24 * 3600,
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
