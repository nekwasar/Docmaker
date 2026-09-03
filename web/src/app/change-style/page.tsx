"use client";

import { useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";

const STYLES = [
  { id: "professional", label: "Professional", desc: "Clean, business-ready" },
  { id: "academic", label: "Academic", desc: "Scholarly, formal" },
  { id: "creative", label: "Creative", desc: "Artistic, expressive" },
  { id: "formal", label: "Formal", desc: "Official, authoritative" },
  { id: "casual", label: "Casual", desc: "Relaxed, friendly" },
  { id: "minimal", label: "Minimal", desc: "Simple, clean" },
];

export default function ChangeStylePage() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("");

  return (
    <ToolPageLayout title="Change Style" color="navy">
      <div className="space-y-8">
        <p className="text-lg text-slate-600">Restyle any document with AI.</p>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-[#121660] transition-colors cursor-pointer">
          <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p className="text-lg font-semibold text-slate-900 mb-2">Drop a document here or click to upload</p>
          <p className="text-sm text-slate-500">Supports PDF, DOCX, TXT, and more</p>
        </div>

        {/* File Info */}
        {file && (
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <FileText className="h-8 w-8 text-[#121660]" />
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={() => setFile(null)} className="p-2 hover:bg-slate-200 rounded">
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        )}

        {/* Style Selector */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Select Style</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedStyle === style.id
                    ? "border-[#121660] bg-[#121660]/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <p className={`font-semibold ${selectedStyle === style.id ? 'text-[#121660]' : 'text-slate-900'}`}>
                  {style.label}
                </p>
                <p className="text-sm text-slate-500 mt-1">{style.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          disabled={!file || !selectedStyle}
          className="w-full py-4 px-6 rounded-full text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#121660' }}
        >
          Apply Style
        </button>
      </div>
    </ToolPageLayout>
  );
}
