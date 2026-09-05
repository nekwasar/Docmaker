import { NextRequest, NextResponse } from "next/server";
import {
  officeToPdf,
  htmlToPdf,
  markdownToPdf,
  pdfToImages,
  pdfToText,
  convertImage,
  csvToXlsx,
  xlsxToCsv,
  jsonToXlsx,
  convertAudioVideo,
  pandocConvert,
  mergePdfs,
  splitPdf,
  watermarkPdf,
  rotatePdf,
  encryptPdf,
  getFormatFromFilename,
  isOfficeFormat,
  isAudioFormat,
  isVideoFormat,
  isImageFormat,
} from "@/lib/convert/engines";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Format mapping: which formats can convert to what
const CONVERSION_MAP: Record<string, string[]> = {
  // Office → PDF
  docx: ["pdf"],
  doc: ["pdf"],
  odt: ["pdf"],
  rtf: ["pdf"],
  txt: ["pdf", "html", "docx"],
  xlsx: ["pdf", "csv"],
  xls: ["pdf", "csv"],
  csv: ["pdf", "xlsx"],
  ods: ["pdf"],
  pptx: ["pdf"],
  ppt: ["pdf"],
  odp: ["pdf"],
  key: ["pdf"],
  // PDF →
  pdf: ["jpg", "png", "txt", "html", "docx"],
  // Images
  jpg: ["pdf", "png", "webp"],
  jpeg: ["pdf", "png", "webp"],
  png: ["pdf", "jpg", "webp"],
  webp: ["pdf", "jpg", "png"],
  gif: ["pdf", "png"],
  tiff: ["pdf", "png"],
  tif: ["pdf", "png"],
  bmp: ["pdf", "png"],
  // Audio
  mp3: ["wav", "aac", "flac", "ogg", "m4a"],
  wav: ["mp3", "aac", "flac", "ogg"],
  aac: ["mp3", "wav", "flac", "ogg"],
  flac: ["mp3", "wav", "aac", "ogg"],
  ogg: ["mp3", "wav", "aac", "flac"],
  m4a: ["mp3", "wav", "aac"],
  // Video
  mp4: ["mp3", "avi", "mov", "mkv", "webm", "gif"],
  avi: ["mp4", "mp3", "mov", "mkv"],
  mov: ["mp4", "mp3", "avi", "mkv"],
  mkv: ["mp4", "mp3", "avi", "mov"],
  webm: ["mp4", "mp3"],
  // Markdown
  md: ["pdf", "html", "docx", "txt"],
  html: ["pdf"],
  htm: ["pdf"],
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const targetFormat = formData.get("target") as string;
    const optionsStr = formData.get("options") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!targetFormat) {
      return NextResponse.json({ error: "No target format specified" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum 50MB." }, { status: 400 });
    }

    const options = optionsStr ? JSON.parse(optionsStr) : {};
    const sourceFormat = getFormatFromFilename(file.name);
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Validate conversion is possible
    const allowedTargets = CONVERSION_MAP[sourceFormat] || [];
    if (!allowedTargets.includes(targetFormat)) {
      return NextResponse.json(
        { error: `Cannot convert ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()}` },
        { status: 400 }
      );
    }

    let result: { buffer: Buffer; contentType: string; filename: string };

    // ===== OFFICE → PDF (Gotenberg) =====
    if (isOfficeFormat(sourceFormat) && targetFormat === "pdf") {
      if (sourceFormat === "html" || sourceFormat === "htm") {
        const r = await htmlToPdf(fileBuffer, file.name, options);
        result = { ...r, filename: `${file.name.split(".")[0]}.pdf` };
      } else {
        const r = await officeToPdf(fileBuffer, file.name, options);
        result = { ...r, filename: `${file.name.split(".")[0]}.pdf` };
      }
    }
    // ===== Markdown → PDF =====
    else if (sourceFormat === "md" && targetFormat === "pdf") {
      const r = await markdownToPdf(fileBuffer, file.name);
      result = { ...r, filename: `${file.name.split(".")[0]}.pdf` };
    }
    // ===== Markdown → HTML/DOCX/TXT (Pandoc) =====
    else if (sourceFormat === "md" && ["html", "docx", "txt"].includes(targetFormat)) {
      const r = await pandocConvert(fileBuffer, file.name, targetFormat);
      const ext = targetFormat === "docx" ? "docx" : targetFormat;
      result = { ...r, filename: `${file.name.split(".")[0]}.${ext}` };
    }
    // ===== TXT → HTML/DOCX (Pandoc) =====
    else if (sourceFormat === "txt" && ["html", "docx"].includes(targetFormat)) {
      const r = await pandocConvert(fileBuffer, file.name, targetFormat);
      result = { ...r, filename: `${file.name.split(".")[0]}.${targetFormat}` };
    }
    // ===== PDF → Images =====
    else if (sourceFormat === "pdf" && ["jpg", "png"].includes(targetFormat)) {
      const r = await pdfToImages(fileBuffer, targetFormat as "jpg" | "png", options);
      result = { ...r, filename: `${file.name.split(".")[0]}.${targetFormat}` };
    }
    // ===== PDF → Text =====
    else if (sourceFormat === "pdf" && targetFormat === "txt") {
      const text = await pdfToText(fileBuffer);
      result = {
        buffer: Buffer.from(text, "utf-8"),
        contentType: "text/plain",
        filename: `${file.name.split(".")[0]}.txt`,
      };
    }
    // ===== PDF → DOCX (Pandoc) =====
    else if (sourceFormat === "pdf" && targetFormat === "docx") {
      const r = await pandocConvert(fileBuffer, file.name, "docx");
      result = { ...r, filename: `${file.name.split(".")[0]}.docx` };
    }
    // ===== PDF → HTML =====
    else if (sourceFormat === "pdf" && targetFormat === "html") {
      const text = await pdfToText(fileBuffer);
      const html = `<!DOCTYPE html>\n<html><head><meta charset="utf-8"><title>${file.name}</title></head><body><pre>${text}</pre></body></html>`;
      result = {
        buffer: Buffer.from(html, "utf-8"),
        contentType: "text/html",
        filename: `${file.name.split(".")[0]}.html`,
      };
    }
    // ===== Image conversions (sharp) =====
    else if (isImageFormat(sourceFormat) && ["jpg", "jpeg", "png", "webp", "gif", "tiff"].includes(targetFormat)) {
      const r = await convertImage(fileBuffer, targetFormat, options);
      const baseName = file.name.split(".").slice(0, -1).join(".");
      result = { ...r, filename: `${baseName}.${targetFormat === "jpeg" ? "jpg" : targetFormat}` };
    }
    // ===== Image → PDF =====
    else if (isImageFormat(sourceFormat) && targetFormat === "pdf") {
      const { PDFDocument } = await import("pdf-lib");
      const sharp = (await import("sharp")).default;

      const imgData = await sharp(fileBuffer).png().toBuffer();
      const pdfDoc = await PDFDocument.create();
      const img = await pdfDoc.embedPng(imgData);
      const page = pdfDoc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });

      const pdfBytes = await pdfDoc.save();
      result = {
        buffer: Buffer.from(pdfBytes),
        contentType: "application/pdf",
        filename: `${file.name.split(".")[0]}.pdf`,
      };
    }
    // ===== CSV → XLSX =====
    else if (sourceFormat === "csv" && targetFormat === "xlsx") {
      const r = await csvToXlsx(fileBuffer);
      result = { ...r, filename: `${file.name.split(".")[0]}.xlsx` };
    }
    // ===== XLSX → CSV =====
    else if (sourceFormat === "xlsx" && targetFormat === "csv") {
      const r = await xlsxToCsv(fileBuffer);
      result = { ...r, filename: `${file.name.split(".")[0]}.csv` };
    }
    // ===== JSON → XLSX =====
    else if (sourceFormat === "json" && targetFormat === "xlsx") {
      const r = await jsonToXlsx(fileBuffer);
      result = { ...r, filename: `${file.name.split(".")[0]}.xlsx` };
    }
    // ===== Audio/Video conversions (FFmpeg) =====
    else if (isAudioFormat(sourceFormat) || isVideoFormat(sourceFormat)) {
      const r = await convertAudioVideo(fileBuffer, file.name, targetFormat);
      const baseName = file.name.split(".").slice(0, -1).join(".");
      result = { ...r, filename: `${baseName}.${targetFormat}` };
    }
    // ===== Unsupported =====
    else {
      return NextResponse.json(
        { error: `Conversion from ${sourceFormat.toUpperCase()} to ${targetFormat.toUpperCase()} is not supported` },
        { status: 400 }
      );
    }

    // Return file
    return new NextResponse(result.buffer, {
      headers: {
        "Content-Type": result.contentType,
        "Content-Disposition": `attachment; filename="${result.filename}"`,
        "X-Conversion-Source": sourceFormat,
        "X-Conversion-Target": targetFormat,
      },
    });
  } catch (error: any) {
    console.error("Conversion error:", error);
    return NextResponse.json(
      { error: error.message || "Conversion failed" },
      { status: 500 }
    );
  }
}

// GET: Return supported conversions
export async function GET() {
  return NextResponse.json({
    conversions: CONVERSION_MAP,
    maxSize: "50MB",
    engines: {
      gotenberg: "Office → PDF, HTML → PDF, Markdown → PDF",
      pandoc: "Markdown → HTML/DOCX/TXT, PDF → DOCX",
      sharp: "Image format conversion",
      canvas: "PDF → Images",
      exceljs: "CSV ↔ XLSX",
      ffmpeg: "Audio/Video conversion",
    },
  });
}
