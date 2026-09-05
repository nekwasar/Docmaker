import { NextRequest, NextResponse } from "next/server";
import { watermarkPdf } from "@/lib/convert/engines";

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const text = formData.get("text") as string;
    const image = formData.get("image") as File | null;
    const opacity = formData.get("opacity") ? parseFloat(formData.get("opacity") as string) : undefined;
    const rotation = formData.get("rotation") ? parseInt(formData.get("rotation") as string) : undefined;
    const fontSize = formData.get("fontSize") ? parseInt(formData.get("fontSize") as string) : undefined;
    const color = formData.get("color") as string || undefined;
    const scale = formData.get("scale") ? parseInt(formData.get("scale") as string) : undefined;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!text && !image) return NextResponse.json({ error: "Watermark text or image is required" }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "File exceeds 50MB limit" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const options: any = { opacity, rotation, fontSize, color, scale };

    if (image) {
      options.imageBuffer = Buffer.from(await image.arrayBuffer());
      options.imageFilename = image.name;
    }

    const result = await watermarkPdf(Buffer.from(arrayBuffer), file.name, text || "", options);

    const baseName = file.name.replace(/\.pdf$/i, "");
    return new NextResponse(result.buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${baseName}-watermarked.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Watermark error:", error);
    return NextResponse.json({ error: error.message || "Watermark failed" }, { status: 500 });
  }
}
