import { NextRequest, NextResponse } from "next/server";
import { renderMarkdownToStyledPages, htmlToStyledPdf, getTheme, type DocumentTheme } from "@/lib/render/document";
import { execSync } from "child_process";
import { writeFile, readFile, unlink, mkdir } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";

async function markdownToDocx(md: string): Promise<Buffer> {
  const tmpDir = join(tmpdir(), "docmaker-render");
  await mkdir(tmpDir, { recursive: true });
  const inPath = join(tmpDir, `${randomUUID()}.md`);
  const outPath = join(tmpDir, `${randomUUID()}.docx`);
  await writeFile(inPath, md);
  try {
    execSync(`pandoc "${inPath}" -o "${outPath}" -t docx`, { maxBuffer: 100 * 1024 * 1024 });
    const { readFile } = await import("fs/promises");
    return await readFile(outPath);
  } finally {
    await writeFile(inPath, "").catch(() => {});
    await import("fs/promises").then((fs) => fs.unlink(inPath).catch(() => {}));
    await import("fs/promises").then((fs) => fs.unlink(outPath).catch(() => {}));
  }
}

// POST /api/generate/render
// Body: { markdown, format: "pdf"|"docx", theme?: "liceria"|"dark"|"serif", themeConfig?: DocumentTheme }
// Returns a downloadable file (PDF or DOCX) rendered with the selected theme.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const markdown = typeof body.markdown === "string" ? body.markdown : "";
    const format = body.format === "docx" ? "docx" : "pdf";
    const themeName = typeof body.theme === "string" ? body.theme : undefined;
    const themeConfig = body.themeConfig as DocumentTheme | undefined;

    if (!markdown.trim()) {
      return NextResponse.json({ error: "No content to render" }, { status: 400 });
    }

    const theme = themeConfig ?? getTheme(themeName);

    if (format === "pdf") {
      // Markdown → styled HTML → Gotenberg Chromium → PDF
      const html = renderMarkdownToStyledPages(markdown, theme);
      const pdfBuffer = await htmlToStyledPdf(html);
      return new Response(pdfBuffer as unknown as BodyInit, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="document.pdf"',
          "Content-Length": String(pdfBuffer.length),
        },
      });
    }

    // format === "docx": Markdown → pandoc → DOCX
    const docxBuffer = await markdownToDocx(markdown);
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
