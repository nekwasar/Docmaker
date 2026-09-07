import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { title, description, category, prompt, isPublic } = await request.json();

    if (!title || !prompt) {
      return NextResponse.json({ error: "Title and prompt are required" }, { status: 400 });
    }

    if (title.length > 100) {
      return NextResponse.json({ error: "Title must be under 100 characters" }, { status: 400 });
    }

    if (prompt.length > 5000) {
      return NextResponse.json({ error: "Prompt must be under 5000 characters" }, { status: 400 });
    }

    const template = await prisma.template.create({
      data: {
        userId: user.id,
        title,
        description: description || "",
        category: category || "auto",
        prompt,
        isPublic: isPublic ?? false,
      },
    });

    return NextResponse.json({ template });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
