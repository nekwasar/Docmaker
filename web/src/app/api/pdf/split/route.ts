import { NextRequest, NextResponse } from "next/server";
import { splitPdf } from "@/lib/convert/engines";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const mode = formData.get("mode") as "intervals" | "pages";
    const span = formData.get("span") as string;
    const unify = formData.get("unify") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 50MB limit" }, { status: 400 });
    }

    if (!mode || !span) {
      return NextResponse.json({ error: "Mode and span are required" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const result = await splitPdf(Buffer.from(arrayBuffer), file.name, mode, span, unify);

    const ext = result.contentType === "application/zip" ? "zip" : "pdf";
    return new NextResponse(result.buffer, {
      headers: {
        "Content-Type": result.contentType,
        "Content-Disposition": `attachment; filename="split.${ext}"`,
      },
    });
  } catch (error: any) {
    console.error("Split error:", error);
    return NextResponse.json({ error: error.message || "Split failed" }, { status: 500 });
  }
}
