"use client";

import { useState } from "react";
import { PdfToolLayout } from "@/components/pdf/pdf-tool-layout";
import { Brand } from "@/config/site";

export default function SplitPdfPage() {
  const [mode, setMode] = useState<"pages" | "intervals">("pages");
  const [span, setSpan] = useState("");
  const [unify, setUnify] = useState(false);

  const handleProcess = async (files: File[], options: Record<string, any>) => {
    if (!span) throw new Error("Please enter page ranges");

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("mode", mode);
    formData.append("span", span);
    formData.append("unify", String(unify));

    const res = await fetch("/api/pdf/split", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Split failed");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = blob.type === "application/zip" ? "split.zip" : "split.pdf";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <PdfToolLayout
      title="Split PDF"
      description="Extract pages from a PDF file"
      color={Brand.navy}
      maxFiles={1}
      accept=".pdf"
      onProcess={handleProcess}
    >
      {({ files, options, setOptions }) => (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Split Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode("pages")}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                  mode === "pages" ? "bg-[#121660] text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                Page Ranges
              </button>
              <button
                onClick={() => setMode("intervals")}
                className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                  mode === "intervals" ? "bg-[#121660] text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                Intervals
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {mode === "pages" ? "Page Ranges" : "Interval Size"}
            </label>
            <input
              type="text"
              value={span}
              onChange={(e) => setSpan(e.target.value)}
              placeholder={mode === "pages" ? "e.g., 1-3, 5, 7-10" : "e.g., 1 (split every page)"}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#121660]/20 focus:border-[#121660]"
            />
            <p className="text-xs text-slate-500 mt-1">
              {mode === "pages"
                ? "Enter page numbers or ranges separated by commas"
                : "Split every N pages into separate files"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="unify"
              checked={unify}
              onChange={(e) => setUnify(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#121660] focus:ring-[#121660]"
            />
            <label htmlFor="unify" className="text-sm text-slate-600">
              Combine extracted pages into single file
            </label>
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
}
