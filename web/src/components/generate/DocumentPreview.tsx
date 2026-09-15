"use client";

import { Brand } from "@/config/site";

function mdToHtml(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^\- \[( |x)\] (.+)$/gm, '<div class="check"><span>$1</span><span>$2</span></div>');

  // tables
  html = html.replace(/^\|(.+)\|$/gm, (m, row) => {
    const cells = row.split("|").map((c: string) => c.trim()).filter(Boolean);
    const isSep = cells.every((c: string) => /^[-:]+$/.test(c));
    if (isSep) return "<!--sep-->";
    return `<tr>${cells.map((c: string) => `<td>${c}</td>`).join("")}</tr>`;
  });
  html = html.replace(/(<tr>.*<\/tr>\n?)+/g, (m) => {
    if (m.includes("<!--sep-->")) {
      const rows = m.split("<!--sep-->").filter(Boolean);
      const head = rows[0] || "";
      const body = rows.slice(1).join("");
      return `<table><thead>${head}</thead><tbody>${body}</tbody></table>`;
    }
    return `<table><tbody>${m}</tbody></table>`;
  });

  // paragraphs
  html = html
    .split(/\n{2,}/)
    .map((block) => {
      const t = block.trim();
      if (!t) return "";
      if (/^<(h[1-3]|table|tr|ul|ol|div)/.test(t)) return block;
      if (t.startsWith("|")) return block;
      return `<p>${t.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");

  return html;
}

const skins: Record<string, { accent: string; titleSize: string }> = {
  business: { accent: Brand.navy, titleSize: "18px" },
  personal: { accent: Brand.blue, titleSize: "20px" },
  academic: { accent: Brand.teal, titleSize: "18px" },
  meeting: { accent: Brand.yellow, titleSize: "16px" },
  legal: { accent: "#0F172A", titleSize: "16px" },
};

export function DocumentPreview({
  content,
  category = "Business",
  scale = 1,
  paginated = false,
}: {
  content: string;
  category?: string;
  scale?: number;
  paginated?: boolean;
}) {
  const key = category.toLowerCase() as keyof typeof skins;
  const skin = skins[key] || skins.business;
  const html = mdToHtml(content);

  return (
    <div
      className="bg-white text-slate-800 overflow-hidden"
      style={{
        fontFamily: "Inter, ui-sans-serif, system-ui",
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: scale !== 1 ? `${100 / scale}%` : undefined,
      }}
    >
      <div
        className="p-6"
        style={{
          borderTop: `4px solid ${skin.accent}`,
          minHeight: paginated ? 520 : undefined,
        }}
      >
        <div className="text-[9px] font-bold tracking-widest uppercase mb-3" style={{ color: skin.accent }}>
          {category}
        </div>
        <div
          className="prose prose-sm max-w-none prose-headings:font-bold prose-h1:text-[18px] prose-h2:text-[14px] prose-h3:text-[13px] prose-p:text-[11px] prose-p:leading-relaxed prose-table:text-[10px] prose-th:bg-slate-50 prose-th:font-semibold prose-td:border prose-th:border prose-table:border-collapse"
          style={{ fontSize: skin.titleSize }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

export function DocumentPaper({
  content,
  category,
  title,
}: {
  content: string;
  category: string;
  title?: string;
}) {
  return (
    <div className="bg-[#EEF1F5] p-3 flex justify-center">
      <div className="w-full max-w-[420px] bg-white shadow-lg rounded-sm border border-slate-200 overflow-hidden">
        <div className="aspect-[210/297] overflow-hidden">
          <DocumentPreview content={content} category={category} scale={0.45} />
        </div>
        {title && <div className="px-3 py-2 border-t border-slate-100 text-xs font-medium text-slate-700 truncate">{title}</div>}
      </div>
    </div>
  );
}
