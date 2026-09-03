"use client";

import { useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";

const LEVELS = [
  { id: "low", label: "Low", desc: "Best quality, larger file" },
  { id: "medium", label: "Medium", desc: "Balanced quality and size" },
  { id: "high", label: "High", desc: "Smallest file size" },
];

export default function CompressPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState("medium");

  return (
    <ToolPageLayout title="Compress PDF" color="teal">
      <div className="space-y-8">
        <p className="text-lg text-slate-600">Reduce PDF file size without losing quality.</p>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-[#3CAE8B] transition-colors cursor-pointer">
          <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p className="text-lg font-semibold text-slate-900 mb-2">Drop a PDF here or click to upload</p>
          <p className="text-sm text-slate-500">Maximum file size: 50MB</p>
        </div>

        {/* File Info */}
        {file && (
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <FileText className="h-8 w-8 text-[#3CAE8B]" />
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={() => setFile(null)} className="p-2 hover:bg-slate-200 rounded">
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        )}

        {/* Compression Level */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Compression Level</h3>
          <div className="grid grid-cols-3 gap-4">
            {LEVELS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLevel(l.id)}
                className={`p-4 rounded-lg border text-center transition-all ${
                  level === l.id
                    ? "border-[#3CAE8B] bg-[#3CAE8B]/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <p className="font-semibold text-slate-900">{l.label}</p>
                <p className="text-sm text-slate-500 mt-1">{l.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          disabled={!file}
          className="w-full py-4 px-6 rounded-full text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#3CAE8B' }}
        >
          Compress PDF
        </button>
      </div>
    </ToolPageLayout>
  );
}
