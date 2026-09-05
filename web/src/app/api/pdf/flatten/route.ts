import { NextRequest, NextResponse } from "next/server";
import { flattenPdf } from "@/lib/convert/engines";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "File exceeds 50MB limit" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const result = await flattenPdf(Buffer.from(arrayBuffer), file.name);

    const baseName = file.name.replace(/\.pdf$/i, "");
    return new NextResponse(result.buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${baseName}-flattened.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Flatten error:", error);
    return NextResponse.json({ error: error.message || "Flatten failed" }, { status: 500 });
  }
}
