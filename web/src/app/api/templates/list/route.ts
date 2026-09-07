import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = { isPublic: true };
    if (category && category !== "all") {
      where.category = category;
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: { downloads: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        prompt: true,
        downloads: true,
        createdAt: true,
        user: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({ templates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
