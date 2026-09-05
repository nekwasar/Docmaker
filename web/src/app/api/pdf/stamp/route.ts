import { NextRequest, NextResponse } from "next/server";
import { stampPdf } from "@/lib/convert/engines";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!text) return NextResponse.json({ error: "Stamp text is required" }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "File exceeds 50MB limit" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const result = await stampPdf(Buffer.from(arrayBuffer), file.name, text);

    const baseName = file.name.replace(/\.pdf$/i, "");
    return new NextResponse(result.buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${baseName}-stamped.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Stamp error:", error);
    return NextResponse.json({ error: error.message || "Stamp failed" }, { status: 500 });
  }
}
