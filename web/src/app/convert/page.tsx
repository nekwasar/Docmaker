"use client";

import { useState } from "react";
import { ArrowRight, Upload } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { Brand } from "@/config/site";

const FORMATS = [
  { id: "pdf", label: "PDF" },
  { id: "docx", label: "DOCX" },
  { id: "jpg", label: "JPG" },
  { id: "png", label: "PNG" },
  { id: "xlsx", label: "XLSX" },
  { id: "csv", label: "CSV" },
  { id: "pptx", label: "PPTX" },
  { id: "txt", label: "TXT" },
  { id: "html", label: "HTML" },
  { id: "md", label: "MD" },
];

export default function ConvertPage() {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");

  return (
    <ToolPageLayout title="Convert Files" color="blue">
      <div className="space-y-6">
        {/* Source Format */}
        <div className="rounded-2xl bg-white border border-slate-200 p-4">
          <label className="block text-sm font-semibold text-slate-900 mb-2">From</label>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                onClick={() => setSource(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  source === f.id
                    ? "bg-[#0171DF] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <ArrowRight className="h-5 w-5 text-slate-400" />
          </div>
        </div>

        {/* Target Format */}
        <div className="rounded-2xl bg-white border border-slate-200 p-4">
          <label className="block text-sm font-semibold text-slate-900 mb-2">To</label>
          <div className="flex flex-wrap gap-2">
            {FORMATS.filter((f) => f.id !== source).map((f) => (
              <button
                key={f.id}
                onClick={() => setTarget(f.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  target === f.id
                    ? "bg-[#0171DF] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Area */}
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center hover:border-[#0171DF] transition-colors">
          <svg className="h-12 w-12 mx-auto mb-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-lg font-semibold text-slate-900 mb-2">Select file to convert</p>
          <p className="text-sm text-slate-500">Drag and drop or click to upload</p>
        </div>

        {/* Convert Button */}
        <button
          disabled={!source || !target}
          className="w-full flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
          style={{ backgroundColor: Brand.blue }}
        >
          Convert
        </button>
      </div>
    </ToolPageLayout>
  );
}
