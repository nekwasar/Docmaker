import { NextRequest, NextResponse } from "next/server";
import { renderMarkdownToStyledPages, htmlToStyledPdf, getTheme, type DocumentTheme } from "@/lib/render/document";
import { ensurePrintCss } from "@/lib/ai/designer";
import { execSync } from "child_process";
import { writeFile, mkdir, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";

async function htmlToDocx(html: string): Promise<Buffer> {
  const tmpDir = join(tmpdir(), "docmaker-render");
  await mkdir(tmpDir, { recursive: true });
  const inPath = join(tmpDir, `${randomUUID()}.html`);
  const outPath = join(tmpDir, `${randomUUID()}.docx`);
  await writeFile(inPath, html, "utf-8");
  try {
    execSync(`pandoc "${inPath}" -f html -o "${outPath}" -t docx`, { maxBuffer: 100 * 1024 * 1024 });
    const { readFile } = await import("fs/promises");
    return await readFile(outPath);
  } finally {
    unlink(inPath).catch(() => {});
    unlink(outPath).catch(() => {});
  }
}

// POST /api/generate/render
// Body (template flow): { html, format: "pdf"|"docx" }
// Body (default flow):  { markdown, format: "pdf"|"docx", theme?: "liceria" }
// Returns a downloadable file.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const format = body.format === "docx" ? "docx" : "pdf";
    const aiHtml = typeof body.html === "string" ? body.html : "";
    const markdown = typeof body.markdown === "string" ? body.markdown : "";
    const themeConfig = body.themeConfig as DocumentTheme | undefined;
    const themeName = typeof body.theme === "string" ? body.theme : undefined;

    if (!aiHtml.trim() && !markdown.trim()) {
      return NextResponse.json({ error: "No content to render" }, { status: 400 });
    }

    // Template flow: the AI already produced the designed HTML — use it as-is.
    const html = aiHtml.trim()
      ? ensurePrintCss(aiHtml)
      : renderMarkdownToStyledPages(markdown, themeConfig ?? getTheme(themeName));

    if (format === "pdf") {
      const pdfBuffer = await htmlToStyledPdf(html);
      return new Response(pdfBuffer as unknown as BodyInit, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="document.pdf"',
          "Content-Length": String(pdfBuffer.length),
        },
      });
    }

    // DOCX: HTML → pandoc → DOCX (keeps structure from the designed HTML)
    const docxBuffer = await htmlToDocx(html);
    return new Response(docxBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="document.docx"',
        "Content-Length": String(docxBuffer.length),
      },
    });
  } catch (e: any) {
    console.error("[render] error:", e.message);
    return NextResponse.json({ error: e.message || "Render failed" }, { status: 500 });
  }
}
