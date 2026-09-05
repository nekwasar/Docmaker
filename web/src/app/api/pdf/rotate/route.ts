import { NextRequest, NextResponse } from "next/server";
import { rotatePdf } from "@/lib/convert/engines";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const angle = parseInt(formData.get("angle") as string) as 90 | 180 | 270;
    const pages = formData.get("pages") as string || undefined;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (![90, 180, 270].includes(angle)) {
      return NextResponse.json({ error: "Angle must be 90, 180, or 270" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 50MB limit" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const result = await rotatePdf(Buffer.from(arrayBuffer), file.name, angle, pages);

    const baseName = file.name.replace(/\.pdf$/i, "");
    return new NextResponse(result.buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${baseName}-rotated.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Rotate error:", error);
    return NextResponse.json({ error: error.message || "Rotate failed" }, { status: 500 });
  }
}
