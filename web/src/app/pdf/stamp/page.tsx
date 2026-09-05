"use client";

import { useState } from "react";
import { PdfToolLayout } from "@/components/pdf/pdf-tool-layout";
import { Brand } from "@/config/site";

export default function StampPdfPage() {
  const [text, setText] = useState("APPROVED");

  const handleProcess = async (files: File[]) => {
    if (!text) throw new Error("Please enter stamp text");

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("text", text);

    const res = await fetch("/api/pdf/stamp", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Stamp failed");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${files[0].name.replace(/\.pdf$/i, "")}-stamped.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const presets = ["APPROVED", "DRAFT", "CONFIDENTIAL", "REJECTED", "FINAL", "COPY"];

  return (
    <PdfToolLayout
      title="Stamp PDF"
      description="Add a text stamp on top of your PDF pages"
      color={Brand.navy}
      maxFiles={1}
      accept=".pdf"
      onProcess={handleProcess}
    >
      {({ files }) => (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Stamp Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#121660]/20 focus:border-[#121660]"
              placeholder="e.g., APPROVED, DRAFT, CONFIDENTIAL"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Quick Presets</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setText(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    text === preset
                      ? "bg-[#121660] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="relative h-32 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl font-bold text-red-400/30 rotate-[-15deg] select-none pointer-events-none">
                {text || "STAMP"}
              </div>
            </div>
            <div className="relative text-xs text-slate-400">Preview</div>
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
}
