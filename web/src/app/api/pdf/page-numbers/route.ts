import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

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
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      const pageNum = i + 1;

      const text = format === "page-of-total"
        ? `${pageNum} of ${totalPages}`
        : `${pageNum}`;

      const fontSize = 10;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      let x: number;
      let y: number;

      // Position
      switch (position) {
        case "bottom-left":
          x = 50;
          y = 40;
          break;
        case "bottom-right":
          x = width - textWidth - 50;
          y = 40;
          break;
        case "top-left":
          x = 50;
          y = height - 50;
          break;
        case "top-right":
          x = width - textWidth - 50;
          y = height - 50;
          break;
        case "bottom-center":
        default:
          x = (width - textWidth) / 2;
          y = 40;
          break;
      }

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });
    }

    const pdfBytes = await pdfDoc.save();
    const baseName = file.name.replace(/\.pdf$/i, "");
    return new NextResponse(Buffer.from(pdfBytes), {
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
