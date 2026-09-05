import { NextRequest, NextResponse } from "next/server";
import { mergePdfs } from "@/lib/convert/engines";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_FILES = 20;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files: { buffer: Buffer; filename: string }[] = [];

    for (const [key, value] of formData.entries()) {
      if (key === "files" && value instanceof File) {
        if (value.size > MAX_FILE_SIZE) {
          return NextResponse.json({ error: `File ${value.name} exceeds 50MB limit` }, { status: 400 });
        }
        const arrayBuffer = await value.arrayBuffer();
        files.push({ buffer: Buffer.from(arrayBuffer), filename: value.name });
      }
    }

    if (files.length < 2) {
      return NextResponse.json({ error: "At least 2 PDF files required" }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Maximum ${MAX_FILES} files allowed` }, { status: 400 });
    }

    const result = await mergePdfs(files);

    return new NextResponse(result.buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged.pdf"',
      },
    });
  } catch (error: any) {
    console.error("Merge error:", error);
    return NextResponse.json({ error: error.message || "Merge failed" }, { status: 500 });
  }
}
