import { NextRequest, NextResponse } from "next/server";
import { stampPdf } from "@/lib/convert/engines";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const position = (formData.get("position") as string) || "bottom-center";
    const format = (formData.get("format") as string) || "page-of-total";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "File exceeds 50MB limit" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Use stamp with page number text - Gotenberg stamps each page
    const stampText = format === "page-of-total" ? "{page} of {total}" : "{page}";
    const result = await stampPdf(fileBuffer, file.name, stampText);

    const baseName = file.name.replace(/\.pdf$/i, "");
    return new NextResponse(result.buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${baseName}-numbered.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Page numbers error:", error);
    return NextResponse.json({ error: error.message || "Adding page numbers failed" }, { status: 500 });
  }
}
