"use client";

import { useState } from "react";
import { PdfToolLayout } from "@/components/pdf/pdf-tool-layout";
import { Brand } from "@/config/site";

export default function CompressPdfPage() {
  const [quality, setQuality] = useState<"low" | "medium" | "high">("medium");

  const handleProcess = async (files: File[], options: Record<string, any>) => {
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("quality", quality);

    const res = await fetch("/api/pdf/compress", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Compress failed");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${files[0].name.replace(/\.pdf$/i, "")}-compressed.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <PdfToolLayout
      title="Compress PDF"
      description="Reduce PDF file size while maintaining quality"
      color={Brand.navy}
      maxFiles={1}
      accept=".pdf"
      onProcess={handleProcess}
    >
      {({ files }) => (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4">
          <label className="block text-sm font-semibold text-slate-900 mb-2">Compression Level</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "high" as const, label: "Best Quality", desc: "Larger file", size: "~90%" },
              { id: "medium" as const, label: "Balanced", desc: "Recommended", size: "~70%" },
              { id: "low" as const, label: "Smallest", desc: "Lower quality", size: "~50%" },
            ].map((level) => (
              <button
                key={level.id}
                onClick={() => setQuality(level.id)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  quality === level.id
                    ? "border-[#121660] bg-[#121660]/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">{level.label}</p>
                <p className="text-xs text-slate-500 mt-1">{level.desc}</p>
                <p className="text-xs font-medium mt-2" style={{ color: Brand.navy }}>{level.size}</p>
              </button>
            ))}
          </div>
          {files.length > 0 && (
            <p className="text-xs text-slate-500">
              Original: {(files[0].size / (1024 * 1024)).toFixed(1)} MB
            </p>
          )}
        </div>
      )}
    </PdfToolLayout>
  );
}
