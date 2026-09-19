import { marked } from "marked";

// Client-safe theme + document renderer.
// Takes markdown + a theme config → returns a fully styled HTML document
// ready for Gotenberg HTML→PDF conversion. No server-only imports.

export interface DocumentTheme {
  colors: {
    primary: string;   // heading/accent color (e.g. #3D4D4E)
    accent: string;    // secondary accent (e.g. #B2A295)
    bg: string;        // page background
    text: string;      // body text
  };
  fonts: {
    heading: string;   // CSS font-family for headings
    body: string;      // CSS font-family for body
  };
  sizes: {
    h1: string;        // giant section titles
    h2: string;        // sub-headings
    h3: string;
    body: string;
    small: string;
  };
  margins: { top: string; sides: string; bottom: string };
}

export const LICERIA_THEME: DocumentTheme = {
  colors: { primary: "#3D4D4E", accent: "#B2A295", bg: "#FFFFFF", text: "#151616" },
  fonts: { heading: "'Archivo', 'Public Sans', sans-serif", body: "'Public Sans', sans-serif" },
  sizes: { h1: "42px", h2: "28px", h3: "20px", body: "15px", small: "12px" },
  margins: { top: "60px", sides: "70px", bottom: "60px" },
};

const DARK_NEUTRAL_THEME: DocumentTheme = {
  colors: { primary: "#1A1A1A", accent: "#6B6B6B", bg: "#FFFFFF", text: "#1A1A1A" },
  fonts: { heading: "'Archivo', sans-serif", body: "'Public Sans', sans-serif" },
  sizes: { h1: "40px", h2: "26px", h3: "20px", body: "15px", small: "12px" },
  margins: { top: "60px", sides: "70px", bottom: "60px" },
};

const CLEAN_SERIF_THEME: DocumentTheme = {
  colors: { primary: "#1B2A4A", accent: "#8B7355", bg: "#FDFCF8", text: "#2D2D2D" },
  fonts: { heading: "'Playfair Display', 'Georgia', serif", body: "'Public Sans', sans-serif" },
  sizes: { h1: "38px", h2: "26px", h3: "20px", body: "15px", small: "12px" },
  margins: { top: "65px", sides: "75px", bottom: "65px" },
};

export const BUILT_IN_THEMES: Record<string, DocumentTheme> = {
  liceria: LICERIA_THEME,
  dark: DARK_NEUTRAL_THEME,
  serif: CLEAN_SERIF_THEME,
};

export function getTheme(name?: string): DocumentTheme {
  if (name && BUILT_IN_THEMES[name]) return BUILT_IN_THEMES[name];
  return LICERIA_THEME;
}

/** Build a full standalone HTML document from markdown with theme styling. */
export function renderMarkdownToHtml(markdown: string, theme?: DocumentTheme): string {
  const t = theme ?? LICERIA_THEME;
  const bodyHtml = marked.parse(markdown, { async: false }) as string;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @page {
    size: A4;
    margin: ${t.margins.top} ${t.margins.sides} ${t.margins.bottom};
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: ${t.fonts.body};
    font-size: ${t.sizes.body};
    color: ${t.colors.text};
    line-height: 1.65;
    background: ${t.colors.bg};
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: ${t.fonts.heading};
    color: ${t.colors.primary};
    font-weight: 600;
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-top: 1.8em;
    margin-bottom: 0.6em;
    page-break-after: avoid;
  }
  h1 { font-size: ${t.sizes.h1}; }
  h2 { font-size: ${t.sizes.h2}; }
  h3 { font-size: ${t.sizes.h3}; }
  h4, h5, h6 { font-size: ${t.sizes.h3}; }
  p {
    margin-bottom: 0.8em;
    text-align: justify;
  }
  strong { color: ${t.colors.primary}; font-weight: 600; }
  em { color: ${t.colors.accent}; }
  a { color: ${t.colors.primary}; text-decoration: underline; }
  ul, ol {
    margin: 0.8em 0 1.2em 1.5em;
    page-break-inside: avoid;
  }
  li { margin-bottom: 0.5em; }
  li::marker { color: ${t.colors.accent}; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.2em 0;
    page-break-inside: avoid;
    font-size: ${t.sizes.body};
  }
  th {
    font-family: ${t.fonts.heading};
    font-weight: 600;
    color: ${t.colors.accent};
    text-align: left;
    padding: 10px 12px;
    border-bottom: 2px solid ${t.colors.primary};
    background: transparent;
  }
  td {
    padding: 10px 12px;
    border-bottom: 1px solid ${t.colors.primary};
    color: ${t.colors.text};
  }
  tr:last-child td { border-bottom: none; }
  blockquote {
    margin: 1.2em 0;
    padding-left: 16px;
    border-left: 3px solid ${t.colors.accent};
    color: ${t.colors.accent};
    font-style: italic;
  }
  code {
    font-family: monospace;
    font-size: 0.9em;
    background: ${t.colors.accent}20;
    padding: 2px 6px;
    border-radius: 4px;
  }
  pre {
    background: ${t.colors.accent}15;
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1em 0;
  }
  pre code { background: none; padding: 0; }
  hr {
    border: none;
    border-top: 1px solid ${t.colors.primary};
    margin: 2em 0;
  }
  /* Page break control */
  h1:first-of-type { margin-top: 0; }
  .page-break { page-break-before: always; }
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

/** Convert styled HTML to PDF via Gotenberg Chromium. */
export async function htmlToStyledPdf(html: string): Promise<Buffer> {
  const gotenbergUrl = process.env.GOTENBERG_URL || "http://localhost:3101";
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
