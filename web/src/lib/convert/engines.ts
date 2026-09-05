import { execSync } from "child_process";
import { writeFile, readFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";

const GOTENBERG_URL = process.env.GOTENBERG_URL || "http://localhost:3101";
const FFMPEG_CONTAINER = "ffmpeg";
const PANDOC_CONTAINER = "pandoc";
const CALIBRE_CONTAINER = "calibre";
const GHOSTSCRIPT_CONTAINER = "ghostscript";

const TEMP_DIR = join(tmpdir(), "docmaker-convert");

async function ensureTempDir() {
  await mkdir(TEMP_DIR, { recursive: true });
}

function tempPath(name: string) {
  return join(TEMP_DIR, name);
}

// ========== GOTENBERG: Office → PDF ==========
export async function officeToPdf(
  fileBuffer: Buffer,
  filename: string,
  options?: {
    landscape?: boolean;
    password?: string;
    pageRanges?: string;
    pdfa?: string;
    merge?: boolean;
    watermark?: string;
    userPassword?: string;
    ownerPassword?: string;
  }
): Promise<{ buffer: Buffer; contentType: string }> {
  await ensureTempDir();
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const inPath = tempPath(`${randomUUID()}.${ext}`);
  await writeFile(inPath, fileBuffer);

  try {
    const formData = new FormData();
    formData.append("files", new Blob([fileBuffer]), filename);

    if (options?.landscape) formData.append("landscape", "true");
    if (options?.password) formData.append("password", options.password);
    if (options?.pageRanges) formData.append("nativePageRanges", options.pageRanges);
    if (options?.pdfa) formData.append("pdfa", options.pdfa);
    if (options?.merge) formData.append("merge", "true");
    if (options?.watermark) formData.append("nativeWatermarkText", options.watermark);
    if (options?.userPassword) formData.append("userPassword", options.userPassword);
    if (options?.ownerPassword) formData.append("ownerPassword", options.ownerPassword);

    const res = await fetch(`${GOTENBERG_URL}/forms/libreoffice/convert`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gotenberg error: ${err}`);
    }

    const arrBuf = await res.arrayBuffer();
    return { buffer: Buffer.from(arrBuf), contentType: "application/pdf" };
  } finally {
    await unlink(inPath).catch(() => {});
  }
}

// ========== GOTENBERG: HTML/Markdown → PDF ==========
export async function htmlToPdf(
  fileBuffer: Buffer,
  filename: string,
  options?: { landscape?: boolean; margin?: number }
): Promise<{ buffer: Buffer; contentType: string }> {
  const formData = new FormData();
  formData.append("files", new Blob([fileBuffer]), filename);
  if (options?.landscape) formData.append("landscape", "true");

  const res = await fetch(`${GOTENBERG_URL}/forms/chromium/convert/html`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gotenberg error: ${err}`);
  }

  const arrBuf = await res.arrayBuffer();
  return { buffer: Buffer.from(arrBuf), contentType: "application/pdf" };
}

export async function markdownToPdf(
  fileBuffer: Buffer,
  filename: string
): Promise<{ buffer: Buffer; contentType: string }> {
  const formData = new FormData();
  formData.append("files", new Blob([fileBuffer]), filename);

  const res = await fetch(`${GOTENBERG_URL}/forms/chromium/convert/markdown`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gotenberg error: ${err}`);
  }

  const arrBuf = await res.arrayBuffer();
  return { buffer: Buffer.from(arrBuf), contentType: "application/pdf" };
}

// ========== GOTENBERG: PDF Manipulation ==========

// --- Merge ---
export async function mergePdfs(
  files: { buffer: Buffer; filename: string }[]
): Promise<{ buffer: Buffer; contentType: string }> {
  const formData = new FormData();
  for (const f of files) {
    formData.append("files", new Blob([f.buffer]), f.filename);
  }

  const res = await fetch(`${GOTENBERG_URL}/forms/pdfengines/merge`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gotenberg merge error: ${err}`);
  }

  const arrBuf = await res.arrayBuffer();
  return { buffer: Buffer.from(arrBuf), contentType: "application/pdf" };
}

export async function splitPdf(
  fileBuffer: Buffer,
  filename: string,
  mode: "intervals" | "pages",
  span: string,
  unify?: boolean
): Promise<{ buffer: Buffer; contentType: string }> {
  const formData = new FormData();
  formData.append("files", new Blob([fileBuffer]), filename);
  formData.append("splitMode", mode);
  formData.append("splitSpan", span);
  if (unify) formData.append("splitUnify", "true");

  const res = await fetch(`${GOTENBERG_URL}/forms/pdfengines/split`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gotenberg split error: ${err}`);
  }

  const arrBuf = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") || "application/pdf";
  return { buffer: Buffer.from(arrBuf), contentType };
}

export async function watermarkPdf(
  fileBuffer: Buffer,
  filename: string,
  text: string,
  options?: { opacity?: number; rotation?: number; fontSize?: number; color?: string; pages?: string; imageBuffer?: Buffer; imageFilename?: string; scale?: number }
): Promise<{ buffer: Buffer; contentType: string }> {
  const { PDFDocument, rgb, StandardFonts, degrees } = await import("pdf-lib");

  const pdfDoc = await PDFDocument.load(fileBuffer);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const opacity = options?.opacity ?? 0;
  const rotation = options?.rotation ?? -45;
  const fontSize = options?.fontSize ?? 72;
  const color = options?.color;
  const scale = options?.scale ?? 50;

  if (options?.imageBuffer && options?.imageFilename) {
    // Image watermark
    const ext = options.imageFilename.split(".").pop()?.toLowerCase() || "";
    let img;
    if (ext === "png") {
      img = await pdfDoc.embedPng(options.imageBuffer);
    } else {
      img = await pdfDoc.embedJpg(options.imageBuffer);
    }

    for (const page of pages) {
      const { width, height } = page.getSize();
      const imgWidth = img.width;
      const imgHeight = img.height;
      const fitScale = Math.min(width / imgWidth, height / imgHeight);
      const drawScale = fitScale * (scale / 100);
      const drawnW = imgWidth * drawScale;
      const drawnH = imgHeight * drawScale;

      page.drawImage(img, {
        x: (width - drawnW) / 2,
        y: (height - drawnH) / 2,
        width: drawnW,
        height: drawnH,
        opacity,
        rotate: degrees(rotation),
      });
    }
  } else {
    // Text watermark
    const r = parseInt(color?.slice(1, 3) || "80", 16) / 255;
    const g = parseInt(color?.slice(3, 5) || "80", 16) / 255;
    const b = parseInt(color?.slice(5, 7) || "80", 16) / 255;

    for (const page of pages) {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);

      page.drawText(text, {
        x: (width - textWidth * Math.cos(rotation * Math.PI / 180)) / 2,
        y: height / 2,
        size: fontSize,
        font,
        color: rgb(r, g, b),
        opacity,
        rotate: degrees(rotation),
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  return { buffer: Buffer.from(pdfBytes), contentType: "application/pdf" };
}

// --- Stamp ---
export async function stampPdf(
  fileBuffer: Buffer,
  filename: string,
  text: string,
  options?: { opacity?: number; rotation?: number; fontSize?: number; color?: string; imageBuffer?: Buffer; imageFilename?: string; scale?: number }
): Promise<{ buffer: Buffer; contentType: string }> {
  const { PDFDocument, rgb, StandardFonts, degrees } = await import("pdf-lib");

  const pdfDoc = await PDFDocument.load(fileBuffer);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const opacity = options?.opacity ?? 0;
  const rotation = options?.rotation ?? -15;
  const fontSize = options?.fontSize ?? 72;
  const color = options?.color;
  const scale = options?.scale ?? 50;

  if (options?.imageBuffer && options?.imageFilename) {
    // Image stamp
    const ext = options.imageFilename.split(".").pop()?.toLowerCase() || "";
    let img;
    if (ext === "png") {
      img = await pdfDoc.embedPng(options.imageBuffer);
    } else {
      img = await pdfDoc.embedJpg(options.imageBuffer);
    }

    for (const page of pages) {
      const { width, height } = page.getSize();
      const imgWidth = img.width;
      const imgHeight = img.height;
      const fitScale = Math.min(width / imgWidth, height / imgHeight);
      const drawScale = fitScale * (scale / 100);
      const drawnW = imgWidth * drawScale;
      const drawnH = imgHeight * drawScale;

      page.drawImage(img, {
        x: (width - drawnW) / 2,
        y: (height - drawnH) / 2,
        width: drawnW,
        height: drawnH,
        opacity,
        rotate: degrees(rotation),
      });
    }
  } else {
    // Text stamp
    const r = parseInt(color?.slice(1, 3) || "80", 16) / 255;
    const g = parseInt(color?.slice(3, 5) || "80", 16) / 255;
    const b = parseInt(color?.slice(5, 7) || "80", 16) / 255;

    for (const page of pages) {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);

      page.drawText(text, {
        x: (width - textWidth * Math.cos(rotation * Math.PI / 180)) / 2,
        y: height / 2,
        size: fontSize,
        font,
        color: rgb(r, g, b),
        opacity,
        rotate: degrees(rotation),
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  return { buffer: Buffer.from(pdfBytes), contentType: "application/pdf" };
}

// --- Rotate ---
export async function rotatePdf(
  fileBuffer: Buffer,
  filename: string,
  angle: 90 | 180 | 270,
  pages?: string
): Promise<{ buffer: Buffer; contentType: string }> {
  const formData = new FormData();
  formData.append("files", new Blob([fileBuffer]), filename);
  formData.append("rotateAngle", String(angle));
  if (pages) formData.append("rotatePages", pages);

  const res = await fetch(`${GOTENBERG_URL}/forms/pdfengines/merge`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gotenberg rotate error: ${err}`);
  }

  const arrBuf = await res.arrayBuffer();
  return { buffer: Buffer.from(arrBuf), contentType: "application/pdf" };
}

export async function encryptPdf(
  fileBuffer: Buffer,
  filename: string,
  userPassword: string,
  ownerPassword?: string,
  permissions?: {
    allowPrinting?: boolean;
    allowCopying?: boolean;
    allowModifying?: boolean;
  }
): Promise<{ buffer: Buffer; contentType: string }> {
  const formData = new FormData();
  formData.append("files", new Blob([fileBuffer]), filename);
  formData.append("userPassword", userPassword);
  if (ownerPassword) formData.append("ownerPassword", ownerPassword);
  if (permissions?.allowPrinting === false) formData.append("allowPrinting", "false");
  if (permissions?.allowCopying === false) formData.append("allowCopying", "false");
  if (permissions?.allowModifying === false) formData.append("allowModifying", "false");

  const res = await fetch(`${GOTENBERG_URL}/forms/pdfengines/merge`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gotenberg encrypt error: ${err}`);
  }

  const arrBuf = await res.arrayBuffer();
  return { buffer: Buffer.from(arrBuf), contentType: "application/pdf" };
}

// --- Compress (Ghostscript) ---
export async function compressPdf(
  fileBuffer: Buffer,
  filename: string,
  quality: "screen" | "ebook" | "printer" | "prepress" = "ebook"
): Promise<{ buffer: Buffer; contentType: string; originalSize: number; compressedSize: number }> {
  await ensureTempDir();
  const inPath = tempPath(`${randomUUID()}.pdf`);
  const outPath = tempPath(`${randomUUID()}-compressed.pdf`);
  await writeFile(inPath, fileBuffer);

  const containerIn = `/tmp/docmaker/${inPath.split("/").pop()}`;
  const containerOut = `/tmp/docmaker/${outPath.split("/").pop()}`;

  try {
    execSync(`docker exec ${GHOSTSCRIPT_CONTAINER} mkdir -p /tmp/docmaker`);
    execSync(`docker cp ${inPath} ${GHOSTSCRIPT_CONTAINER}:${containerIn}`);

    const presetMap: Record<string, string> = {
      screen: "/screen",
      ebook: "/ebook",
      printer: "/printer",
      prepress: "/prepress",
    };
    const preset = presetMap[quality] || "/ebook";

    execSync(
      `docker exec ${GHOSTSCRIPT_CONTAINER} gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 ` +
      `-dPDFSETTINGS=${preset} -dNOPAUSE -dQUIET -dBATCH ` +
      `-sOutputFile=${containerOut} ${containerIn}`,
      { maxBuffer: 100 * 1024 * 1024 }
    );

    execSync(`docker cp ${GHOSTSCRIPT_CONTAINER}:${containerOut} ${outPath}`);

    const resultBuffer = await readFile(outPath);
    return {
      buffer: resultBuffer,
      contentType: "application/pdf",
      originalSize: fileBuffer.length,
      compressedSize: resultBuffer.length,
    };
  } finally {
    await unlink(inPath).catch(() => {});
    await unlink(outPath).catch(() => {});
    execSync(`docker exec ${GHOSTSCRIPT_CONTAINER} rm -f /tmp/docmaker/* 2>/dev/null || true`);
  }
}

// --- Flatten ---
export async function flattenPdf(
  fileBuffer: Buffer,
  filename: string
): Promise<{ buffer: Buffer; contentType: string }> {
  const formData = new FormData();
  formData.append("files", new Blob([fileBuffer]), filename);
  formData.append("flatten", "true");

  const res = await fetch(`${GOTENBERG_URL}/forms/pdfengines/merge`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gotenberg flatten error: ${err}`);
  }

  const arrBuf = await res.arrayBuffer();
  return { buffer: Buffer.from(arrBuf), contentType: "application/pdf" };
}

// ========== FFMPEG: Audio/Video Conversion ==========
function runFfmpeg(args: string[]): Buffer {
  const cmd = `docker exec ${FFMPEG_CONTAINER} ffmpeg -y ${args.join(" ")}`;
  return execSync(cmd, { maxBuffer: 100 * 1024 * 1024 });
}

export async function convertAudioVideo(
  fileBuffer: Buffer,
  filename: string,
  targetFormat: string
): Promise<{ buffer: Buffer; contentType: string }> {
  await ensureTempDir();
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const inPath = tempPath(`${randomUUID()}.${ext}`);
  const outPath = tempPath(`${randomUUID()}.${targetFormat}`);
  await writeFile(inPath, fileBuffer);

  try {
    const dockerIn = `/tmp/docmaker/${inPath.split("/").pop()}`;
    const dockerOut = `/tmp/docmaker/${outPath.split("/").pop()}`;

    // Copy file into container
    execSync(`docker exec ${FFMPEG_CONTAINER} mkdir -p /tmp/docmaker`);
    execSync(`docker cp ${inPath} ${FFMPEG_CONTAINER}:/tmp/docmaker/${inPath.split("/").pop()}`);

    // Build ffmpeg args
    const args: string[] = [];
    const audioFormats = ["mp3", "wav", "aac", "flac", "ogg", "m4a"];
    const videoFormats = ["mp4", "avi", "mov", "mkv", "webm", "gif"];

    if (audioFormats.includes(targetFormat)) {
      // Video → Audio or Audio → Audio
      args.push("-i", dockerIn);
      if (ext !== "gif") args.push("-vn");
      args.push("-acodec", getAudioCodec(targetFormat));
      args.push(dockerOut);
    } else if (videoFormats.includes(targetFormat)) {
      // Video → Video
      args.push("-i", dockerIn);
      args.push("-vcodec", "libx264");
      args.push("-acodec", "aac");
      args.push(dockerOut);
    } else {
      throw new Error(`Unsupported target format: ${targetFormat}`);
    }

    execSync(
      `docker exec ${FFMPEG_CONTAINER} ffmpeg -y ${args.map((a) => `"${a}"`).join(" ")}`,
      { maxBuffer: 100 * 1024 * 1024 }
    );

    // Copy result out
    execSync(`docker cp ${FFMPEG_CONTAINER}:${dockerOut} ${outPath}`);

    const resultBuffer = await readFile(outPath);
    const contentType = getMimeType(targetFormat);
    return { buffer: resultBuffer, contentType };
  } finally {
    await unlink(inPath).catch(() => {});
    await unlink(outPath).catch(() => {});
    execSync(`docker exec ${FFMPEG_CONTAINER} rm -f /tmp/docmaker/* 2>/dev/null || true`);
  }
}

function getAudioCodec(format: string): string {
  const codecs: Record<string, string> = {
    mp3: "libmp3lame",
    wav: "pcm_s16le",
    aac: "aac",
    flac: "flac",
    ogg: "libvorbis",
    m4a: "aac",
  };
  return codecs[format] || "copy";
}

// ========== PANDOC: Universal Document Conversion ==========
export async function pandocConvert(
  fileBuffer: Buffer,
  filename: string,
  targetFormat: string
): Promise<{ buffer: Buffer; contentType: string }> {
  await ensureTempDir();
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const inPath = tempPath(`${randomUUID()}.${ext}`);
  const outPath = tempPath(`${randomUUID()}.${targetFormat}`);
  await writeFile(inPath, fileBuffer);

  try {
    const dockerIn = `/tmp/docmaker/${inPath.split("/").pop()}`;
    const dockerOut = `/tmp/docmaker/${outPath.split("/").pop()}`;

    execSync(`docker exec ${PANDOC_CONTAINER} mkdir -p /tmp/docmaker`);
    execSync(`docker cp ${inPath} ${PANDOC_CONTAINER}:${dockerIn}`);

    const pandocArgs = getPandocArgs(ext, targetFormat);
    execSync(
      `docker exec ${PANDOC_CONTAINER} pandoc ${dockerIn} -o ${dockerOut} ${pandocArgs}`,
      { maxBuffer: 100 * 1024 * 1024 }
    );

    execSync(`docker cp ${PANDOC_CONTAINER}:${dockerOut} ${outPath}`);
    const resultBuffer = await readFile(outPath);
    const contentType = getMimeType(targetFormat);
    return { buffer: resultBuffer, contentType };
  } finally {
    await unlink(inPath).catch(() => {});
    await unlink(outPath).catch(() => {});
    execSync(`docker exec ${PANDOC_CONTAINER} rm -f /tmp/docmaker/* 2>/dev/null || true`);
  }
}

function getPandocArgs(fromExt: string, toExt: string): string {
  if (toExt === "docx") return "-t docx";
  if (toExt === "html") return "-t html --standalone";
  if (toExt === "md") return "-t markdown";
  if (toExt === "txt") return "-t plain";
  if (toExt === "pdf") return "--pdf-engine=xelatex";
  if (toExt === "epub") return "-t epub3";
  return "";
}

// ========== SHARP: Image Conversion ==========
export async function convertImage(
  fileBuffer: Buffer,
  targetFormat: string,
  options?: { width?: number; height?: number; quality?: number }
): Promise<{ buffer: Buffer; contentType: string }> {
  const sharp = (await import("sharp")).default;
  let pipeline = sharp(fileBuffer);

  if (options?.width || options?.height) {
    pipeline = pipeline.resize(options.width, options.height, { fit: "inside" });
  }

  const format = targetFormat.toLowerCase();
  switch (format) {
    case "jpg":
    case "jpeg":
      pipeline = pipeline.jpeg({ quality: options?.quality || 80 });
      break;
    case "png":
      pipeline = pipeline.png();
      break;
    case "webp":
      pipeline = pipeline.webp({ quality: options?.quality || 80 });
      break;
    case "gif":
      pipeline = pipeline.gif();
      break;
    case "tiff":
    case "tif":
      pipeline = pipeline.tiff();
      break;
    case "bmp":
      pipeline = pipeline.raw();
      break;
    case "avif":
      pipeline = pipeline.avif({ quality: options?.quality || 80 });
      break;
    default:
      throw new Error(`Unsupported image format: ${format}`);
  }

  const resultBuffer = await pipeline.toBuffer();
  return { buffer: resultBuffer, contentType: getMimeType(format) };
}

// ========== PDF → Images (pdfjs-dist + canvas) ==========
export async function pdfToImages(
  fileBuffer: Buffer,
  targetFormat: "jpg" | "png",
  options?: { dpi?: number; pages?: string }
): Promise<{ buffer: Buffer; contentType: string }> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const { createCanvas } = await import("canvas");
  const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.min.mjs");

  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default || "";

  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) }).promise;
  const scale = (options?.dpi || 150) / 72;
  const images: Buffer[] = [];

  const pageNumbers = options?.pages
    ? options.pages.split(",").map((p) => parseInt(p.trim()))
    : Array.from({ length: doc.numPages }, (_, i) => i + 1);

  for (const pageNum of pageNumbers) {
    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext("2d");

    await page.render({ canvasContext: ctx as any, viewport }).promise;

    if (targetFormat === "jpg") {
      images.push(canvas.toBuffer("image/jpeg", { quality: 0.8 }));
    } else {
      images.push(canvas.toBuffer("image/png"));
    }
  }

  if (images.length === 1) {
    return { buffer: images[0], contentType: getMimeType(targetFormat) };
  }

  // For multiple pages, return first image (or could zip them)
  return { buffer: images[0], contentType: getMimeType(targetFormat) };
}

// ========== PDF → Text ==========
export async function pdfToText(fileBuffer: Buffer): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.min.mjs");
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default || "";

  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(fileBuffer) }).promise;
  let text = "";

  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(" ");
    text += pageText + "\n\n";
  }

  return text;
}

// ========== EXCELJS: CSV/JSON ↔ XLSX ==========
export async function csvToXlsx(fileBuffer: Buffer): Promise<{ buffer: Buffer; contentType: string }> {
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  const csvText = fileBuffer.toString("utf-8");
  const lines = csvText.split("\n");

  lines.forEach((line, idx) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    worksheet.addRow(values);
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return { buffer: Buffer.from(buffer), contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
}

export async function xlsxToCsv(fileBuffer: Buffer): Promise<{ buffer: Buffer; contentType: string }> {
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(fileBuffer);

  const worksheet = workbook.getWorksheet(1);
  let csv = "";

  worksheet?.eachRow((row) => {
    const values = row.values.slice(1).map((v) => `"${String(v || "").replace(/"/g, '""')}"`);
    csv += values.join(",") + "\n";
  });

  return { buffer: Buffer.from(csv, "utf-8"), contentType: "text/csv" };
}

export async function jsonToXlsx(fileBuffer: Buffer): Promise<{ buffer: Buffer; contentType: string }> {
  const ExcelJS = await import("exceljs");
  const data = JSON.parse(fileBuffer.toString("utf-8"));
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  if (Array.isArray(data) && data.length > 0) {
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);
    data.forEach((row: any) => {
      worksheet.addRow(headers.map((h) => row[h]));
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return { buffer: Buffer.from(buffer), contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
}

// ========== HELPERS ==========
function getMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    tiff: "image/tiff",
    bmp: "image/bmp",
    svg: "image/svg+xml",
    txt: "text/plain",
    html: "text/html",
    md: "text/markdown",
    csv: "text/csv",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    aac: "audio/aac",
    flac: "audio/flac",
    ogg: "audio/ogg",
    mp4: "video/mp4",
    avi: "video/x-msvideo",
    mov: "video/quicktime",
    mkv: "video/x-matroska",
    webm: "video/webm",
    epub: "application/epub+zip",
    json: "application/json",
  };
  return mimeTypes[format.toLowerCase()] || "application/octet-stream";
}

export function getFormatFromFilename(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

export function isOfficeFormat(ext: string): boolean {
  const officeExts = [
    "doc", "docx", "docm", "dot", "dotm", "dotx", "odt", "fodt", "ott", "rtf", "txt", "wps", "wpd", "pages",
    "xls", "xlsx", "xlsm", "xlsb", "xlt", "xltm", "xltx", "xlw", "ods", "fods", "ots", "csv", "numbers",
    "ppt", "pptx", "pptm", "pot", "potm", "potx", "pps", "odp", "fodp", "otp", "key",
    "odg", "fodg", "otg", "vsd", "vsdx", "svg", "wmf", "emf",
    "html", "htm", "xhtml",
  ];
  return officeExts.includes(ext);
}

export function isAudioFormat(ext: string): boolean {
  return ["mp3", "wav", "aac", "flac", "ogg", "m4a", "wma"].includes(ext);
}

export function isVideoFormat(ext: string): boolean {
  return ["mp4", "avi", "mov", "mkv", "webm", "wmv", "flv", "3gp"].includes(ext);
}

export function isImageFormat(ext: string): boolean {
  return ["jpg", "jpeg", "png", "webp", "gif", "tiff", "tif", "bmp", "avif", "svg"].includes(ext);
}

export function isEbookFormat(ext: string): boolean {
  return ["epub", "mobi", "azw3", "azw", "fb2", "djvu"].includes(ext);
}

// ========== PANDOC: Ebook Conversions ==========
export async function ebookConvert(
  fileBuffer: Buffer,
  filename: string,
  targetFormat: string
): Promise<{ buffer: Buffer; contentType: string }> {
  await ensureTempDir();
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const inPath = tempPath(`${randomUUID()}.${ext}`);
  const outPath = tempPath(`${randomUUID()}.${targetFormat}`);
  await writeFile(inPath, fileBuffer);

  try {
    const dockerIn = `/tmp/docmaker/${inPath.split("/").pop()}`;
    const dockerOut = `/tmp/docmaker/${outPath.split("/").pop()}`;

    execSync(`docker exec ${PANDOC_CONTAINER} mkdir -p /tmp/docmaker`);
    execSync(`docker cp ${inPath} ${PANDOC_CONTAINER}:${dockerIn}`);

    const pandocArgs = getEbookArgs(ext, targetFormat);
    execSync(
      `docker exec ${PANDOC_CONTAINER} pandoc ${dockerIn} -o ${dockerOut} ${pandocArgs}`,
      { maxBuffer: 100 * 1024 * 1024 }
    );

    execSync(`docker cp ${PANDOC_CONTAINER}:${dockerOut} ${outPath}`);
    const resultBuffer = await readFile(outPath);
    const contentType = getMimeType(targetFormat);
    return { buffer: resultBuffer, contentType };
  } finally {
    await unlink(inPath).catch(() => {});
    await unlink(outPath).catch(() => {});
    execSync(`docker exec ${PANDOC_CONTAINER} rm -f /tmp/docmaker/* 2>/dev/null || true`);
  }
}

function getEbookArgs(fromExt: string, toExt: string): string {
  if (toExt === "epub") return "-t epub3 --standalone";
  if (toExt === "pdf") return "--pdf-engine=xelatex";
  if (toExt === "docx") return "-t docx";
  if (toExt === "html") return "-t html5 --standalone";
  if (toExt === "txt") return "-t plain";
  if (toExt === "md") return "-t markdown";
  if (toExt === "html") return "-t html5 --standalone";
  return "";
}
