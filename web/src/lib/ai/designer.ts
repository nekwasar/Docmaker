// Prompts for the vision-based document pipeline.
// The AI studies template page images and recreates the exact design as HTML/CSS.

export const DESIGNER_SYSTEM_PROMPT = `You are an elite document designer. You will be shown page images of a document template.

Your task: produce a COMPLETE, SELF-CONTAINED HTML document (with embedded CSS) that recreates this exact design — same colors, same typography, same layout structure, same decorative elements (dark panels, headers, rules, numbered lists, table styles) — but with NEW content provided by the user.

CRITICAL RULES:
1. Study the images carefully. Extract the exact hex colors, font styles, font sizes, margins, header placement, and decorative elements.
2. Each PDF page is a <div class="page"> with: width: 210mm; height: 297mm; page-break-after: always; overflow: hidden; position: relative; box-sizing: border-box.
3. Reuse the template's page archetypes:
   - Cover page: brand header (top left) + date (top right), giant title, optional subtitle, dark footer panel with two columns (e.g. "Prepared by" / "Prepared for")
   - Table of contents: full-bleed dark background with a white title, numbered rows and thin rules (only if the template has one)
   - Content pages: brand header + date, large section title, body text / lists / tables
   - Table pages: header row styled like the template (e.g. muted accent-colored header text, thin dark rules under rows)
   - Closing page: large title + dark contact panel (only if the template has one)
4. The header on every page shows the brand name on the left and the date on the right, styled exactly like the template.
5. Fonts: use Google Fonts via <link> (or a matching system stack) to approximate the template's typeface. Match weight and letter-spacing.
6. Fit content within pages: if a section is long, split across multiple content pages. Never let text overflow a page.
7. Generate a table of contents listing the section titles when the template shows one.
8. Only use the NEW content provided. Never copy the template's placeholder text (like "Lorem ipsum", "June 2030", "Avery Davis", etc.) unless the user's content requires it.
9. Return ONLY raw HTML starting with <!DOCTYPE html>. No markdown fences, no commentary before or after.`;

export function buildDesignerPrompt(content: string, style: string, docType?: string): string {
  const styleNote =
    style === "simple"
      ? "Write all body copy in simple, plain English suitable for a general audience."
      : "Write all body copy in a polished, professional tone.";

  return `Create a complete new document using the template design shown in the attached images.

NEW DOCUMENT:
${content || docType || "A professional business document."}

${styleNote}

Produce the full HTML document now — cover page, table of contents (if the template has one), all content pages, and closing page (if the template has one) — matching the template design exactly. Remember: return ONLY the raw HTML.`;
}

/** Extract raw HTML from an AI response that may include code fences or prose. */
export function extractHtml(text: string): string {
  if (!text) return "";
  // Strip ```html ... ``` fences
  const fence = text.match(/```(?:html)?\s*([\s\S]*?)```/i);
  if (fence && fence[1].includes("<")) return fence[1].trim();
  const lower = text.toLowerCase();
  const idx = lower.indexOf("<!doctype");
  if (idx !== -1) return text.slice(idx).trim();
  const htmlIdx = lower.indexOf("<html");
  if (htmlIdx !== -1) return text.slice(htmlIdx).trim();
  return text.trim();
}

/**
 * Ensure the document paginates as A4 with zero page margins.
 * Without this, Chromium applies default print margins and every
 * 210x297mm page overflows into two PDF pages.
 */
export function ensurePrintCss(html: string): string {
  if (!html) return html;
  let out = html;
  if (/@page/i.test(out)) {
    out = out.replace(/@page[^{]*\{[^}]*\}/gi, "@page{size:A4;margin:0;}");
  } else {
    const injection = "<style>@page{size:A4;margin:0;}</style>";
    out = /<\/head>/i.test(out) ? out.replace(/<\/head>/i, `${injection}</head>`) : injection + out;
  }
  if (!/print-color-adjust/i.test(out)) {
    const force = "<style>html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}</style>";
    out = /<\/head>/i.test(out) ? out.replace(/<\/head>/i, `${force}</head>`) : force + out;
  }
  return out;
}
