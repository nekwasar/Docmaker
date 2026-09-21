import { marked, type Tokens } from "marked";

// Page-type document renderer — replicates the uploaded template's EXACT design.
// Each page is a separate <div class="page"> with page-break-after: always.
// Gotenberg Chromium converts multi-page HTML → PDF with all styling intact.

export interface DocumentTheme {
  colors: {
    primary: string;   // pine — headings, header text, dark panels
    accent: string;    // sand — subtitles, numbers, decorative marks
    bg: string;        // white paper
    text: string;      // body ink
  };
  fonts: {
    heading: string;
    body: string;
  };
  brand: { left: string; right: string }; // header: brand / date
  contact?: { phone?: string; email?: string; website?: string };
}

export const LICERIA_THEME: DocumentTheme = {
  colors: { primary: "#3D4D4E", accent: "#B2A295", bg: "#FFFFFF", text: "#151616" },
  fonts: { heading: "'Archivo', 'Public Sans', sans-serif", body: "'Public Sans', sans-serif" },
  brand: { left: "Docmaker", right: "" },
  contact: {},
};

export const BUILT_IN_THEMES: Record<string, DocumentTheme> = {
  liceria: LICERIA_THEME,
};

export function getTheme(name?: string): DocumentTheme {
  if (name && BUILT_IN_THEMES[name]) return BUILT_IN_THEMES[name];
  return LICERIA_THEME;
}

// ---------- Dynamic styling ----------
// No-template documents must never fall back to a fixed look: the AI picks a
// palette + font pairing per generation (design spec line), and if it omits
// one, a curated palette is chosen deterministically from the prompt — so the
// design always varies with the content and never locks to one theme.

export interface DesignSpec {
  primary?: string;
  accent?: string;
  text?: string;
  bg?: string;
  headingFont?: string;
  bodyFont?: string;
}

const GOOGLE_FONT_WEIGHTS: Record<string, string> = {
  // name -> google fonts css2 weight spec
  Archivo: "wght@400;500;600;700",
  "Public Sans": "wght@400;500;600;700",
  "Space Grotesk": "wght@400;500;600;700",
  Inter: "wght@400;500;600;700",
  Manrope: "wght@400;500;600;700",
  "DM Sans": "wght@400;500;600;700",
  "Playfair Display": "wght@400;500;600;700",
  "Source Serif 4": "wght@400;500;600;700",
  Sora: "wght@400;500;600;700",
  "Libre Baskerville": "wght@400;700",
  Lora: "wght@400;500;600;700",
  Poppins: "wght@300;400;500;600;700",
  Fraunces: "wght@400;500;600;700",
};

const FONT_FALLBACK: Record<string, string> = {
  serif: "'Source Serif 4', Georgia, serif",
};

export const FONT_WHITELIST = Object.keys(GOOGLE_FONT_WEIGHTS);

const PALETTES: Array<{ primary: string; accent: string; text: string }> = [
  { primary: "#2F4F43", accent: "#C9A227", text: "#161D19" }, // forest
  { primary: "#1B2A4A", accent: "#C08362", text: "#12131A" }, // navy
  { primary: "#23272E", accent: "#7FA3A0", text: "#101114" }, // charcoal
  { primary: "#5E2233", accent: "#D8B08C", text: "#1D1216" }, // bordeaux
  { primary: "#2C3E50", accent: "#9AB3C9", text: "#10151B" }, // slate
  { primary: "#3D4A26", accent: "#C77B3F", text: "#16180F" }, // olive
  { primary: "#16505B", accent: "#E3B23C", text: "#0D1719" }, // teal
  { primary: "#4A2545", accent: "#C5A572", text: "#171015" }, // plum
];

function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}

function safeHex(v: unknown): string | null {
  return typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v) ? v : null;
}

function safeFont(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const hit = FONT_WHITELIST.find((f) => f.toLowerCase() === v.trim().toLowerCase());
  return hit ?? null;
}

/** Build a per-document theme: AI design spec if valid, else seeded palette. */
export function deriveDynamicTheme(spec: unknown, seed?: string): DocumentTheme {
  const s = (spec ?? {}) as DesignSpec;
  const base = seed ? PALETTES[hashString(seed) % PALETTES.length] : PALETTES[Math.floor(Math.random() * PALETTES.length)];
  const fontSeed = seed ? hashString(seed + "::font") : Math.floor(Math.random() * FONT_WHITELIST.length);
  const headingFont = safeFont(s.headingFont) ?? FONT_WHITELIST[fontSeed % FONT_WHITELIST.length];
  const bodyFont = safeFont(s.bodyFont) ?? FONT_WHITELIST[(fontSeed + 3) % FONT_WHITELIST.length];
  return {
    colors: {
      primary: safeHex(s.primary) ?? base.primary,
      accent: safeHex(s.accent) ?? base.accent,
      bg: safeHex(s.bg) ?? "#FFFFFF",
      text: safeHex(s.text) ?? base.text,
    },
    fonts: {
      heading: `'${headingFont}', ${headingFont === "Playfair Display" || headingFont === "Libre Baskerville" || headingFont === "Lora" || headingFont === "Source Serif 4" || headingFont === "Fraunces" ? FONT_FALLBACK.serif : "sans-serif"}`,
      body: `'${bodyFont}', ${bodyFont === "Lora" || bodyFont === "Source Serif 4" ? FONT_FALLBACK.serif : "sans-serif"}`,
    },
    brand: { left: "Docmaker", right: "" },
    contact: {},
  };
}

/** Google Fonts <link> href covering a theme's heading + body fonts. */
export function fontsLinkHref(theme: DocumentTheme): string | null {
  const names = new Set<string>();
  for (const f of [theme.fonts.heading, theme.fonts.body]) {
    const m = /'([^']+)'/.exec(f);
    if (m && GOOGLE_FONT_WEIGHTS[m[1]]) names.add(m[1]);
  }
  if (names.size === 0) return null;
  const params = [...names].map((n) => `family=${n.replace(/ /g, "+")}:${GOOGLE_FONT_WEIGHTS[n]}`).join("&");
  return `https://fonts.googleapis.com/css2?${params}&display=swap`;
}

// ---------- Markdown parsing into page structures ----------

interface TocEntry { num: string; title: string }
interface SectionPage {
  type: "content" | "table" | "list";
  title: string;
  html: string; // rendered markdown body
}

interface PageStructure {
  cover: { title: string; subtitle: string; preparedBy: string; preparedFor: string };
  toc: TocEntry[];
  sections: SectionPage[];
  closing: { title: string; contact?: { phone?: string; email?: string; website?: string } };
}

function parseMarkdownToPages(markdown: string, theme: DocumentTheme): PageStructure {
  const tokens = marked.lexer(markdown);
  const pages: PageStructure = {
    cover: { title: "", subtitle: "", preparedBy: "", preparedFor: "" },
    toc: [],
    sections: [],
    closing: { title: "", contact: theme.contact },
  };

  let currentHeading = "";
  let currentTokens: Tokens.Generic[] = [];
  const sections: Array<{ title: string; tokens: Tokens.Generic[] }> = [];
  let afterH1 = false; // track if we just saw h1 (cover title) — next paragraph is subtitle

  // Walk tokens: h1 = cover title, h2 = section titles, content between h2s
  for (const token of tokens) {
    if (token.type === "heading" && token.depth === 1) {
      // First h1 = document title (cover)
      if (!pages.cover.title) {
        pages.cover.title = token.text;
        afterH1 = true;
        continue;
      }
      // Subsequent h1 = new section
      if (currentTokens.length > 0 && currentHeading) {
        sections.push({ title: currentHeading, tokens: currentTokens });
      }
      currentHeading = token.text;
      currentTokens = [];
      afterH1 = false;
    } else if (token.type === "heading" && token.depth === 2) {
      // Flush previous section
      if (currentTokens.length > 0 && currentHeading) {
        sections.push({ title: currentHeading, tokens: currentTokens });
      }
      currentHeading = token.text;
      currentTokens = [];
      afterH1 = false;
    } else if (afterH1 && token.type === "paragraph" && !currentHeading) {
      // First paragraph right after h1 = subtitle on cover
      const text = (token.text || "").replace(/\*+/g, "").replace(/`+/g, "").trim();
      if (text.length < 200 && !text.startsWith("|")) {
        pages.cover.subtitle = text;
      }
      afterH1 = false;
    } else {
      currentTokens.push(token);
    }
  }
  if (currentTokens.length > 0 && currentHeading) {
    sections.push({ title: currentHeading, tokens: currentTokens });
  }

  // Build cover — title already set from h1. Fill defaults for prepared-by.
  if (!pages.cover.title) pages.cover.title = "Document";
  if (!pages.cover.preparedBy) pages.cover.preparedBy = "Docmaker AI";
  if (!pages.cover.preparedFor) pages.cover.preparedFor = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Build TOC from section titles
  pages.toc = sections.map((s, i) => ({
    num: String(i + 1).padStart(2, "0"),
    title: s.title,
  }));

  // Build section pages — detect type from content
  pages.sections = sections.map((s) => {
    const hasTable = s.tokens.some((t) => t.type === "table");
    const hasList = s.tokens.some((t) => t.type === "list");
    const html = marked.parser(s.tokens);

    let type: "content" | "table" | "list" = "content";
    if (hasTable) type = "table";
    else if (hasList && !s.tokens.some((t) => t.type === "paragraph" && ((t as Tokens.Generic).text || "").length > 200)) type = "list";

    return { type, title: s.title, html };
  });

  // Closing page — use last section title or default
  if (pages.sections.length > 0) {
    pages.closing.title = "Let's Work Together";
  }

  return pages;
}

/** Build a full multi-page HTML document matching the template design exactly. */
export function renderMarkdownToStyledPages(markdown: string, theme?: DocumentTheme): string {
  const t = theme ?? LICERIA_THEME;
  const pages = parseMarkdownToPages(markdown, t);

  const headerHtml = (white: boolean) => `
    <div class="page-header" style="color: ${white ? "#FFFFFF" : t.colors.primary};">
      <span>${t.brand.left}</span>
      <span>${t.brand.right || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
    </div>`;

  // Build each page
  const pageHtmls: string[] = [];

  // --- Cover page ---
  pageHtmls.push(`
    <div class="page page-cover">
      ${headerHtml(false)}
      <div class="cover-spacer"></div>
      <h1 class="cover-title">${pages.cover.title}</h1>
      ${pages.cover.subtitle ? `<p class="cover-subtitle">${pages.cover.subtitle}</p>` : ""}
      <div class="cover-panel">
        <div class="cover-panel-row">
          <div><span class="cover-label">Prepared by :</span><br/><span class="cover-name">${pages.cover.preparedBy}</span></div>
          <div><span class="cover-label">Prepared for :</span><br/><span class="cover-name">${pages.cover.preparedFor}</span></div>
        </div>
      </div>
    </div>`);

  // --- TOC page ---
  if (pages.toc.length > 0) {
    const tocItems = pages.toc.map((e) => `
      <div class="toc-row">
        <span class="toc-num">${e.num}</span>
        <span class="toc-title">${e.title}</span>
      </div>`).join("");
    pageHtmls.push(`
      <div class="page page-toc">
        <h2 class="page-dark-title">Table of Contents</h2>
        <div class="toc-list">${tocItems}</div>
      </div>`);
  }

  // --- Section pages ---
  for (const section of pages.sections) {
    pageHtmls.push(`
      <div class="page page-content">
        ${headerHtml(false)}
        <div class="content-spacer"></div>
        <h2 class="section-title">${section.title}</h2>
        <div class="section-body">${section.html}</div>
      </div>`);
  }

  // --- Closing page ---
  const contact = pages.closing.contact || {};
  pageHtmls.push(`
    <div class="page page-closing">
      ${headerHtml(false)}
      <div class="cover-spacer"></div>
      <h1 class="cover-title">${pages.closing.title || "Let's Work Together"} <span class="arrow">↗</span></h1>
      <div class="cover-panel closing-panel">
        <p class="contact-heading">Contact Us</p>
        <div class="contact-items">
          ${contact.phone ? `<div class="contact-item">✆ ${contact.phone}</div>` : ""}
          ${contact.email ? `<div class="contact-item">✉ ${contact.email}</div>` : ""}
          ${contact.website ? `<div class="contact-item">◉ ${contact.website}</div>` : ""}
        </div>
      </div>
    </div>`);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
${fontsLinkHref(t) ? `<link rel="stylesheet" href="${fontsLinkHref(t)}">` : ""}
<style>
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: ${t.fonts.body};
    color: ${t.colors.text};
    background: ${t.colors.bg};
  }
  .page {
    width: 210mm;
    min-height: 297mm;
    position: relative;
    page-break-after: always;
    overflow: hidden;
    padding: 14mm 15mm 14mm 14mm;
  }
  .page:last-child { page-break-after: avoid; }

  /* Header — on every page */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-family: ${t.fonts.body};
    font-size: 20px;
    font-weight: 400;
    line-height: 1.3;
    padding-bottom: 8px;
  }

  /* Cover + Closing */
  .cover-spacer { height: 45%; }
  .cover-title {
    font-family: ${t.fonts.heading};
    font-size: 64px;
    font-weight: 700;
    color: ${t.colors.primary};
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin-bottom: 12px;
  }
  .cover-subtitle {
    font-family: ${t.fonts.body};
    font-size: 24px;
    color: ${t.colors.accent};
    line-height: 1.3;
    margin-bottom: 0;
  }
  .cover-panel {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: ${t.colors.primary};
    padding: 28px 40px 36px 40px;
    border-radius: 16px 16px 0 0;
    min-height: 160px;
  }
  .cover-panel-row {
    display: flex;
    justify-content: flex-start;
    gap: 60px;
  }
  .cover-label {
    font-size: 15px;
    color: ${t.colors.accent};
    font-weight: 400;
  }
  .cover-name {
    font-size: 20px;
    color: #FFFFFF;
    font-weight: 600;
    font-family: ${t.fonts.heading};
  }
  .closing-panel { min-height: 200px; }
  .contact-heading {
    font-family: ${t.fonts.heading};
    font-size: 22px;
    font-weight: 600;
    color: #FFFFFF;
    margin-bottom: 12px;
  }
  .contact-item {
    font-size: 16px;
    color: #FFFFFF;
    margin-bottom: 6px;
  }

  /* TOC — full-bleed dark page */
  .page-toc {
    background: ${t.colors.primary};
    color: #FFFFFF;
    padding: 24mm 14mm;
  }
  .page-dark-title {
    font-family: ${t.fonts.heading};
    font-size: 48px;
    font-weight: 700;
    color: #FFFFFF;
    letter-spacing: -0.02em;
    margin-bottom: 30px;
  }
  .toc-row {
    display: flex;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid rgba(255,255,255,0.3);
  }
  .toc-row:last-child { border-bottom: 1px solid rgba(255,255,255,0.3); }
  .toc-num {
    font-family: ${t.fonts.heading};
    font-size: 20px;
    color: ${t.colors.accent};
    width: 60px;
    flex-shrink: 0;
  }
  .toc-title {
    font-family: ${t.fonts.body};
    font-size: 20px;
    color: #FFFFFF;
  }

  /* Content pages */
  .content-spacer { height: 15%; }
  .section-title {
    font-family: ${t.fonts.heading};
    font-size: 44px;
    font-weight: 700;
    color: ${t.colors.primary};
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin-bottom: 24px;
  }
  .section-body {
    font-size: 15px;
    line-height: 1.65;
    color: ${t.colors.text};
  }
  .section-body p {
    margin-bottom: 0.8em;
    text-align: justify;
  }
  .section-body strong { color: ${t.colors.primary}; font-weight: 600; }
  .section-body em { color: ${t.colors.accent}; }
  .section-body ul, .section-body ol {
    margin: 0.8em 0 1.2em 1.5em;
  }
  .section-body li { margin-bottom: 0.5em; }
  .section-body li::marker { color: ${t.colors.accent}; }
  .section-body table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.2em 0;
    font-size: 15px;
  }
  .section-body th {
    font-family: ${t.fonts.heading};
    font-weight: 600;
    color: ${t.colors.accent};
    text-align: left;
    padding: 12px;
    border-bottom: 2px solid ${t.colors.primary};
  }
  .section-body td {
    padding: 12px;
    border-bottom: 1px solid ${t.colors.primary};
    color: ${t.colors.text};
  }
  .section-body tr:last-child td { border-bottom: none; }
  .section-body h3 {
    font-family: ${t.fonts.heading};
    font-size: 20px;
    font-weight: 600;
    color: ${t.colors.primary};
    margin-top: 1.2em;
    margin-bottom: 0.4em;
  }
  .section-body blockquote {
    margin: 1.2em 0;
    padding-left: 16px;
    border-left: 3px solid ${t.colors.accent};
    color: ${t.colors.accent};
    font-style: italic;
  }
  .section-body ol, .section-body ul { page-break-inside: avoid; }
  .section-body table { page-break-inside: avoid; }
</style>
</head>
<body>
${pageHtmls.join("\n")}
</body>
</html>`;
}

/** Convert styled multi-page HTML to PDF via Gotenberg Chromium. */
export async function htmlToStyledPdf(html: string): Promise<Buffer> {
  const gotenbergUrl = process.env.GOTENBERG_URL || "http://docmaker-gotenberg:3000";
  const formData = new FormData();
  formData.append("files", new Blob([html]), "index.html");

  const res = await fetch(`${gotenbergUrl}/forms/chromium/convert/html`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gotenberg HTML→PDF error: ${err.slice(0, 200)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}
