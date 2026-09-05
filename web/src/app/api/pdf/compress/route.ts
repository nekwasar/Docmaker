import { NextRequest, NextResponse } from "next/server";
import { compressPdf } from "@/lib/convert/engines";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const quality = (formData.get("quality") as "screen" | "ebook" | "printer" | "prepress") || "ebook";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "File exceeds 50MB limit" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const result = await compressPdf(Buffer.from(arrayBuffer), file.name, quality);

    const baseName = file.name.replace(/\.pdf$/i, "");
    return new NextResponse(result.buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${baseName}-compressed.pdf"`,
        "X-Original-Size": String(result.originalSize),
        "X-Compressed-Size": String(result.compressedSize),
        "X-Compression-Ratio": String(Math.max(0, Math.round((1 - result.compressedSize / result.originalSize) * 100))),
      },
    });
  } catch (error: any) {
    console.error("Compress error:", error);
    return NextResponse.json({ error: error.message || "Compress failed" }, { status: 500 });
  }
}
