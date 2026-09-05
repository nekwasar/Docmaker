"use client";

import { useState } from "react";
import { PdfToolLayout } from "@/components/pdf/pdf-tool-layout";
import { Brand } from "@/config/site";

const PRESETS = [
  {
    id: "screen" as const,
    label: "Recommended",
    dpi: "72 DPI",
    desc: "Smallest file size, best for web & email",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: "ebook" as const,
    label: "High Quality",
    dpi: "150 DPI",
    desc: "Better quality, slightly larger file",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
];

export default function CompressPdfPage() {
  const [quality, setQuality] = useState<"screen" | "ebook">("screen");
  const [compressionResult, setCompressionResult] = useState<{
    originalSize: number;
    compressedSize: number;
    ratio: number;
  } | null>(null);

  const handleProcess = async (files: File[]) => {
    setCompressionResult(null);

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("quality", quality);

    const res = await fetch("/api/pdf/compress", { method: "POST", body: formData });    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Compress failed");
    }

    // Read compression stats from headers
    const originalSize = parseInt(res.headers.get("X-Original-Size") || "0");
    const compressedSize = parseInt(res.headers.get("X-Compressed-Size") || "0");
    const ratio = parseInt(res.headers.get("X-Compression-Ratio") || "0");

    if (originalSize > 0 && compressedSize > 0) {
      setCompressionResult({ originalSize, compressedSize, ratio });
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${files[0].name.replace(/\.pdf$/i, "")}-compressed.pdf`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 5000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <PdfToolLayout
      title="Compress PDF"
      description="Reduce PDF file size using Ghostscript"
      color={Brand.navy}
      maxFiles={1}
      accept=".pdf"
      onProcess={handleProcess}
    >
      {({ files }) => (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4">
          <label className="block text-sm font-semibold text-slate-900 mb-2">Compression Level</label>
          <div className="grid grid-cols-2 gap-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setQuality(preset.id)}
                className={`p-6 rounded-xl border-2 text-center transition-all ${
                  quality === preset.id
                    ? "border-[#121660] bg-[#121660]/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className={`mx-auto w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                  quality === preset.id ? "bg-[#121660] text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {preset.icon}
                </div>
                <p className="text-sm font-semibold text-slate-900">{preset.label}</p>
                <p className="text-xs text-slate-500 mt-1">{preset.dpi}</p>
                <p className="text-xs text-slate-400 mt-0.5">{preset.desc}</p>
              </button>
            ))}
          </div>

          {files.length > 0 && (
            <p className="text-xs text-slate-500">
              Original: {formatBytes(files[0].size)}
            </p>
          )}

          {compressionResult && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-800">Compression Result</p>
                  <p className="text-xs text-green-600 mt-1">
                    {formatBytes(compressionResult.originalSize)} → {formatBytes(compressionResult.compressedSize)}
                  </p>
                </div>
                <div className="text-right">
                  {compressionResult.ratio > 0 ? (
                    <p className="text-2xl font-bold text-green-600">-{compressionResult.ratio}%</p>
                  ) : (
                    <p className="text-sm text-amber-600 font-medium">Already optimized</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </PdfToolLayout>
  );
}
