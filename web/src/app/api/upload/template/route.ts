import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, type Prisma } from "@prisma/client";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const prisma = new PrismaClient();

interface PdfTextItem { str?: string }
interface PdfPageProxy {
  getTextContent: () => Promise<{ items: PdfTextItem[] }>;
  getViewport: (o: { scale: number }) => { width: number; height: number };
  render: (o: { canvasContext: unknown; viewport: unknown }) => { promise: Promise<void> };
}
interface PdfDocumentProxy {
  numPages: number;
  getPage: (n: number) => Promise<PdfPageProxy>;
}
interface PdfjsModule {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (src: {
    data: Uint8Array;
    disableWorker?: boolean;
    useWorkerFetch?: boolean;
    isEvalSupported?: boolean;
  }) => { promise: Promise<PdfDocumentProxy> };
}

async function loadPdfjs(): Promise<PdfjsModule> {
  const mod = (await import("pdfjs-dist/legacy/build/pdf.mjs")) as unknown as PdfjsModule;
  try { mod.GlobalWorkerOptions.workerSrc = ""; } catch {}
  return mod;
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const title = (form.get("title") as string)?.trim();
    const author = (form.get("author") as string)?.trim() || "Docmaker";
    const category = (form.get("category") as string)?.trim() || "Business";
    const description = (form.get("description") as string)?.trim() || "";
    const isPublic = form.get("isPublic") !== "false";
    const file = form.get("file") as File | null;

    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 });

    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: "admin@docmaker.io", name: "Admin", passwordHash: "", role: "admin" },
      });
    }

    let fileUrl: string | null = null;
    let fileName: string | null = null;
    let fileSize: number | null = null;
    let thumbnails: string[] | null = null;
    let content: string | null = null;

    if (file && file.size > 0) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "templates");
      fs.mkdirSync(uploadsDir, { recursive: true });
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const tmpName = `${Date.now()}-${safe}`;
      const filePath = path.join(uploadsDir, tmpName);
      const buf = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buf);
      fileUrl = `/uploads/templates/${tmpName}`;
      fileName = file.name;
      fileSize = file.size;
      const ext = path.extname(file.name).toLowerCase();
      try {
        if (ext === ".txt" || ext === ".csv" || ext === ".md") {
          content = buf.toString("utf-8").slice(0, 20000);
        } else if (ext === ".pdf") {
          // Content extraction via pdftotext (poppler) — more reliable in Node than pdfjs worker
          try {
            const txt = execSync(`pdftotext -layout "${filePath}" -`, { maxBuffer: 10 * 1024 * 1024 }).toString("utf-8");
            const trimmed = txt.trim().slice(0, 20000);
            if (trimmed) content = trimmed;
          } catch (e) {
            console.error("pdftotext failed, falling back to pdfjs", e);
          }
          // Fallback to pdfjs if pdftotext produced nothing
          if (!content) {
            try {
              const pdfjs = await loadPdfjs();
              const doc = await pdfjs.getDocument({ data: new Uint8Array(buf), disableWorker: true, useWorkerFetch: false, isEvalSupported: false }).promise;
              let all = "";
              const pages = Math.min(doc.numPages, 5);
              for (let i = 1; i <= pages; i++) {
                const page = await doc.getPage(i);
                const tc = await page.getTextContent();
                const t = tc.items.map((it) => it.str ?? "").join(" ");
                all += t + "\n\n";
              }
              content = all.trim().slice(0, 20000) || `PDF: ${file.name} — ${doc.numPages} pages`;
            } catch (pdfErr) {
              console.error("pdfjs extraction failed", pdfErr);
              content = `PDF: ${file.name} — ${buf.length} bytes`;
            }
          }
          if (!content) content = `PDF: ${file.name} — ${file.size} bytes`;
          // Thumbnails via ghostscript directly (no docker) — we installed gs in the web container
          try {
            const id = Date.now().toString(36);
            // Use gs to render first 6 pages at 110 dpi (AI needs all page archetypes:
            // cover, TOC, content, table, closing).
            execSync(`gs -dSAFER -dBATCH -dNOPAUSE -sDEVICE=png16m -r110 -dFirstPage=1 -dLastPage=6 -sOutputFile="${uploadsDir}/${id}-%d.png" "${filePath}"`, { stdio: "ignore" });
            const thumbs: string[] = [];
            for (let i = 1; i <= 6; i++) {
              const p = path.join(uploadsDir, `${id}-${i}.png`);
              if (fs.existsSync(p)) thumbs.push(`/uploads/templates/${id}-${i}.png`);
            }
            if (thumbs.length === 0) {
              // gs produced nothing (e.g. single-page short doc) — retry without page range
              execSync(`gs -dSAFER -dBATCH -dNOPAUSE -sDEVICE=png16m -r110 -sOutputFile="${uploadsDir}/${id}-%d.png" "${filePath}"`, { stdio: "ignore" });
              for (let i = 1; i <= 6; i++) {
                const p = path.join(uploadsDir, `${id}-${i}.png`);
                if (fs.existsSync(p)) thumbs.push(`/uploads/templates/${id}-${i}.png`);
              }
            }
            if (thumbs.length > 0) thumbnails = thumbs;
            else console.error("gs produced no thumbnails for", filePath);
          } catch (thumbErr) {
            console.error("ghostscript thumbnail failed", thumbErr);
            // Fallback to pdfjs+canvas if gs fails
            try {
              const pdfjs = await loadPdfjs();
              const doc = await pdfjs.getDocument({ data: new Uint8Array(buf), disableWorker: true }).promise;
              const id = Date.now().toString(36) + "_c";
              const { createCanvas } = await import("canvas");
              const numThumbs = Math.min(doc.numPages, 3);
              const thumbs: string[] = [];
              for (let i = 1; i <= numThumbs; i++) {
                const page = await doc.getPage(i);
                const viewport = page.getViewport({ scale: 1 });
                const targetWidth = 600;
                const scale = targetWidth / viewport.width;
                const scaled = page.getViewport({ scale });
                const canvas = createCanvas(scaled.width, scaled.height);
                const ctx = canvas.getContext("2d");
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                await page.render({ canvasContext: ctx, viewport: scaled }).promise;
                const outPath = path.join(uploadsDir, `${id}-${i}.png`);
                fs.writeFileSync(outPath, canvas.toBuffer("image/png"));
                thumbs.push(`/uploads/templates/${id}-${i}.png`);
              }
              if (thumbs.length > 0) thumbnails = thumbs;
            } catch (e2) {
              console.error("canvas fallback also failed", e2);
            }
          }
        } else if ([".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(ext)) {
          try {
            const id = Date.now().toString(36);
            const { default: sharp } = await import("sharp");
            const outPath = path.join(uploadsDir, `${id}-1.png`);
            await sharp(buf).resize({ width: 600 }).png().toFile(outPath);
            thumbnails = [`/uploads/templates/${id}-1.png`];
            content = content || `Image: ${file.name}`;
          } catch {}
        }
      } catch (e) {
        console.error("content extraction failed", e);
        if (!content) content = `File: ${file.name} — ${file.size} bytes`;
      }
    } else {
      const prompt = (form.get("prompt") as string) || (form.get("content") as string) || "";
      if (prompt) content = prompt.slice(0, 20000);
    }

    // One-time design-kit extraction — vision call studies the page images and
    // produces reusable page skeletons. Every later generation from this
    // template reuses the kit (fast: no vision at generation time).
    let designKit: unknown = null;
    if (thumbnails && Array.isArray(thumbnails) && thumbnails.length > 0) {
      try {
        const { extractDesignKit, loadTemplateImages } = await import("@/lib/render/designKit");
        const images = loadTemplateImages(thumbnails as string[], fileUrl);
        if (images.length > 0) {
          const kit = await extractDesignKit(title, images);
          designKit = kit as unknown as Prisma.InputJsonValue;
          console.log("[upload] design kit extracted for", title);
        }
      } catch (kitErr: unknown) {
        // Non-fatal: generation falls back to per-generation vision flow.
        const msg = kitErr instanceof Error ? kitErr.message : String(kitErr);
        console.error("[upload] design kit extraction failed:", msg.slice(0, 200));
      }
    }

    const template = await prisma.template.create({
      data: {
        userId: user.id,
        title,
        description,
        category,
        prompt: content || description || title,
        content,
        author,
        thumbnails: (thumbnails as unknown) as Prisma.InputJsonValue,
        fileUrl,
        fileName,
        fileSize,
        designKit: (designKit ?? undefined) as Prisma.InputJsonValue | undefined,
        isPublic,
      },
    });
    return NextResponse.json({ template });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Template upload failed";
    console.error(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
