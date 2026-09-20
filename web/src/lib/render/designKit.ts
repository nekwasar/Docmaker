import fs from "fs";
import path from "path";
import { marked } from "marked";
import { streamAIResponse, getAIConfigAsync, type MultimodalMessage, type UsageReport } from "@/lib/ai/config";
import { modelIdForProvider, type AIProvider } from "@/lib/ai/catalog";

// Design-kit extraction: a ONE-TIME vision call per template that converts the
// uploaded PDF's page images into a reusable design system — theme tokens plus
// HTML skeletons per page archetype (cover / toc / content / table / closing)
// with {{SLOT}} placeholders. Generation then fills the skeletons with content
// in milliseconds — no vision cost, no per-run drift, identical quality every time.

export interface DesignKit {
  version: 1;
  brand: { left: string; right: string };
  pageSkeletons: {
    cover?: string;      // {{TITLE}} {{SUBTITLE}} {{PREPARED_BY}} {{PREPARED_FOR}}
    toc?: string;        // {{TOC_ROWS}}           rows: <div class="toc-row">…
    content?: string;    // {{HEADER}} {{TITLE}} {{BODY}}
    extraContent?: string; // continuation page (no big title)
    table?: string;      // same as content but table-styled
    closing?: string;    // {{TITLE}} {{CONTACT}}
  };
  css: string;           // shared <style> block (colors, fonts, header/footer)
}

const KIT_SYSTEM_PROMPT = `You are an elite design-systems engineer. You will be shown page images of a document template.

Task: produce a JSON design kit so that ANY future document can be rendered in this EXACT design without seeing the images again.

Return ONLY a JSON object (no markdown fences, no commentary) with exactly these keys:

{
  "brand": { "left": "<brand text shown top-left>", "right": "<date/footer text shown top-right — use the literal template date>" },
  "css": "<one <style> block with ALL shared CSS: @page{size:A4;margin:0}, fonts (Google Fonts <link> tags allowed inside the style via @import), color variables, .page dimensions (210mm x 297mm, page-break-after: always), header pattern, typography scale, table styling, list styling, panel styling — everything needed to reproduce the design>",
  "skeletons": {
    "cover": "HTML for the cover page as a <div class='page'>…</div> with placeholders {{TITLE}}, {{SUBTITLE}}, {{PREPARED_BY}}, {{PREPARED_FOR}}",
    "toc": "<div class='page'>…</div> with placeholder {{TOC_ROWS}} — also define in css the markup for rows: use class toc-row with a number span and a title span",
    "content": "<div class='page'>…</div> with {{HEADER}} {{TITLE}} {{BODY}} — the repeating content-page archetype with the big section title",
    "extraContent": "<div class='page'>…</div> with {{HEADER}} {{BODY}} — continuation page without a big title",
    "closing": "<div class='page'>…</div> with {{TITLE}} {{CONTACT}} — the final page with the dark contact/footer panel"
  }
}

RULES:
1. Study the images pixel-carefully: exact colors (as hex), fonts, weights, sizes, margins, panel shapes, rule styles.
2. The css string must be COMPLETE and self-contained (fonts via Google Fonts @import inside a <style> tag is allowed).
3. Each skeleton must be a full <div class="page">…</div> using the shared CSS classes. Keep decorative elements (dark panels, rounded corners, arrows, quote marks, rules) exactly as in the images.
4. {{HEADER}} in content/extraContent skeletons = the brand header markup (brand left, date right). Define a reusable snippet or inline it.
5. In the toc skeleton, {{TOC_ROWS}} is replaced by repeated rows. Define .toc-row / .toc-num / .toc-lbl classes in the shared CSS.
6. BODY placeholders will receive rich HTML (paragraphs, lists, tables, headings). Style those elements inside the shared CSS.
7. Return ONLY the JSON object. No prose.`;

export interface LoadedTemplateImages {
  images: string[];        // base64 data URLs
  cleanedPaths: string[];  // temp files to delete after use
}

/** Read template thumbnail files into base64 data URLs for vision calls. */
export function loadTemplateImages(thumbnails: unknown, fileUrl?: string | null): string[] {
  const urls = Array.isArray(thumbnails) ? (thumbnails as unknown as string[]) : [];
  const out: string[] = [];
  for (const url of urls.slice(0, 6)) {
    try {
      const fp = path.join(process.cwd(), "public", url.replace(/^\//, ""));
      const buf = fs.readFileSync(fp);
      out.push(`data:image/png;base64,${buf.toString("base64")}`);
    } catch {
      // skip unreadable thumbnail
    }
  }
  // Fallback: render from the original PDF if no thumbnails are readable
  if (out.length === 0 && fileUrl && fileUrl.endsWith(".pdf")) {
    try {
      const { execSync } = require("child_process") as typeof import("child_process");
      const pdfPath = path.join(process.cwd(), "public", fileUrl.replace(/^\//, ""));
      const outBase = `/tmp/dk-${Date.now()}`;
      execSync(`gs -dSAFER -dBATCH -dNOPAUSE -sDEVICE=png16m -r110 -dFirstPage=1 -dLastPage=6 -sOutputFile='${outBase}-%d.png' '${pdfPath}'`, { stdio: "ignore" });
      for (let i = 1; i <= 6; i++) {
        const p = `${outBase}-${i}.png`;
        if (fs.existsSync(p)) {
          out.push(`data:image/png;base64,${fs.readFileSync(p).toString("base64")}`);
          fs.unlinkSync(p);
        }
      }
    } catch {}
  }
  return out;
}

function extractJson(text: string): Record<string, unknown> {
  if (!text) throw new Error("Empty response");
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fence ? fence[1] : text;
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON found in response");
  return JSON.parse(body.slice(start, end + 1));
}

export async function extractDesignKit(
  templateTitle: string,
  templateImages: string[]
): Promise<DesignKit> {
  const rawConfig = await getAIConfigAsync();
  const config = { ...rawConfig, model: modelIdForProvider(rawConfig.model, rawConfig.provider as AIProvider) };
  if (!config.apiKey) throw new Error("AI is not configured");

  const messages: MultimodalMessage[] = [
    { role: "system", content: KIT_SYSTEM_PROMPT },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: `Extract the complete design system from this "${templateTitle}" template (pages attached, in order). Return the JSON design kit now.`,
        },
        ...templateImages.map((url) => ({ type: "image_url" as const, image_url: { url } })),
      ],
    },
  ];

  // Streamed server-side — long JSON generation exceeds non-streaming timeouts.
  let raw = "";
  for await (const chunk of streamAIResponse(messages, config, {})) {
    raw += chunk;
  }

  const parsed = extractJson(raw) as Partial<DesignKit> & {
    brand?: DesignKit["brand"];
    cssVars?: Record<string, string>;
    css?: string;
    pageSkeletons?: DesignKit["pageSkeletons"];
    skeletons?: DesignKit["pageSkeletons"];
  };

  // Normalise: accept both `css`/`cssVars`+`skeletons`/`pageSkeletons` spellings
  const css = (parsed as any).css || (parsed as any).cssVars || "";
  const skeletons = (parsed as any).pageSkeletons || (parsed as any).skeletons || {};
  if (!css || typeof css !== "string" || css.length < 200) {
    throw new Error("Design kit extraction returned incomplete CSS");
  }
  if (!skeletons.cover || !skeletons.content) {
    throw new Error("Design kit extraction returned incomplete skeletons");
  }

  return {
    version: 1,
    brand: parsed.brand ?? { left: "Docmaker", right: "" },
    pageSkeletons: {
      cover: skeletons.cover ?? "",
      toc: skeletons.toc ?? "",
      content: skeletons.content ?? "",
      extraContent: skeletons.extraContent ?? skeletons.content ?? "",
      table: skeletons.table ?? skeletons.content ?? "",
      closing: skeletons.closing ?? "",
    },
    css,
  };
}

/** Fill a design kit's skeletons with structured content → full HTML document. */
export function assembleFromKit(
  kit: DesignKit,
  content: {
    title: string; subtitle?: string; preparedBy?: string; preparedFor?: string;
    tocEntries: Array<{ num: string; title: string }>;
    sections: Array<{ type: "content" | "table"; title: string; html: string }>;
    closing?: { title: string; contact?: string };
  }
): string {
  const s = kit.pageSkeletons;
  const brandLeft = kit.brand?.left ?? "Docmaker";
  const brandRight = kit.brand?.right || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const header = `<div style="display:flex;justify-content:space-between;font-size:20px;line-height:1.3;padding-bottom:8px;"><span>${brandLeft}</span><span style="text-align:right;">${brandRight}</span></div>`;

  const pageHtmls: string[] = [];

  if (s.cover) {
    pageHtmls.push(
      s.cover
        .replace(/\{\{TITLE\}\}/g, esc(content.title))
        .replace(/\{\{SUBTITLE\}\}/g, esc(content.subtitle ?? ""))
        .replace(/\{\{PREPARED_BY\}\}/g, esc(content.preparedBy ?? "Docmaker AI"))
        .replace(/\{\{PREPARED_FOR\}\}/g, esc(content.preparedFor ?? new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })))
    );
  }

  if (s.toc && content.tocEntries.length > 0) {
    const rows = content.tocEntries
      .map((e) => `<div class="toc-row"><span class="toc-num">${esc(e.num)}</span><span class="toc-lbl">${esc(e.title)}</span></div>`)
      .join("\n");
    pageHtmls.push(s.toc.replace(/\{\{TOC_ROWS\}\}/g, rows));
  }

  for (let i = 0; i < content.sections.length; i++) {
    const sec = content.sections[i];
    const skel = i === 0 ? (s.content ?? s.extraContent) : s.extraContent ?? s.content;
    if (!skel) continue;
    let page = skel
      .replace(/\{\{HEADER\}\}/g, header)
      .replace(/\{\{TITLE\}\}/g, esc(sec.title))
      .replace(/\{\{BODY\}\}/g, sec.html);
    pageHtmls.push(page);
  }

  if (s.closing) {
    pageHtmls.push(
      s.closing
        .replace(/\{\{TITLE\}\}/g, esc(content.closing?.title ?? "Let's Work Together"))
        .replace(/\{\{CONTACT\}\}/g, "")
    );
  }

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8">
<style>
${kit.css}
</style>
</head>
<body>
${pageHtmls.join("\n")}
</body>
</html>`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Parse markdown into the content structure that assembleFromKit expects. */
export function parseMarkdownToContent(markdown: string): {
  title: string; subtitle: string; preparedBy: string; preparedFor: string;
  tocEntries: Array<{ num: string; title: string }>;
  sections: Array<{ type: "content" | "table"; title: string; html: string }>;
  closing: { title: string };
} {
  const tokens = marked.lexer(markdown);
  let title = "";
  let subtitle = "";
  let afterH1 = false;

  interface Sec { title: string; bodyTokens: any[]; hasTable: boolean }
  const sections: Sec[] = [];
  let currentTitle = "";
  let currentTokens: any[] = [];

  for (const token of tokens) {
    if (token.type === "heading" && token.depth === 1) {
      if (!title) { title = token.text; afterH1 = true; continue; }
      if (currentTokens.length && currentTitle) sections.push({ title: currentTitle, bodyTokens: currentTokens, hasTable: false });
      currentTitle = token.text;
      currentTokens = [];
      afterH1 = false;
    } else if (token.type === "heading" && token.depth === 2) {
      if (currentTokens.length && currentTitle) sections.push({ title: currentTitle, bodyTokens: currentTokens, hasTable: false });
      currentTitle = token.text;
      currentTokens = [];
      afterH1 = false;
    } else if (afterH1 && token.type === "paragraph" && !currentTitle) {
      const text = (token as any).text || "";
      if (text.length < 200 && !text.startsWith("|")) subtitle = text;
      afterH1 = false;
    } else {
      currentTokens.push(token);
    }
  }
  if (currentTokens.length && currentTitle) sections.push({ title: currentTitle, bodyTokens: currentTokens, hasTable: false });

  const parsedSections = sections.map((s) => {
    const hasTable = s.bodyTokens.some((t) => t.type === "table");
    return {
      type: (hasTable ? "table" : "content") as "table" | "content",
      title: s.title,
      html: marked.parser(s.bodyTokens),
    };
  });

  return {
    title: title || "Document",
    subtitle,
    preparedBy: "Docmaker AI",
    preparedFor: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    tocEntries: parsedSections.map((s, i) => ({ num: String(i + 1).padStart(2, "0"), title: s.title })),
    sections: parsedSections,
    closing: { title: "Let's Work Together" },
  };
}
