"use client";

import { useState } from "react";
import { PdfToolLayout } from "@/components/pdf/pdf-tool-layout";
import { Brand } from "@/config/site";

export default function RotatePdfPage() {
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
  const [pages, setPages] = useState("");

  const handleProcess = async (files: File[], options: Record<string, any>) => {
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("angle", String(angle));
    if (pages) formData.append("pages", pages);

    const res = await fetch("/api/pdf/rotate", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Rotate failed");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${files[0].name.replace(/\.pdf$/i, "")}-rotated.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <PdfToolLayout
      title="Rotate PDF"
      description="Rotate pages in your PDF document"
      color={Brand.navy}
      maxFiles={1}
      accept=".pdf"
      onProcess={handleProcess}
    >
      {({ files }) => (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Rotation Angle</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 90 as const, label: "90°", desc: "Clockwise" },
                { value: 180 as const, label: "180°", desc: "Upside down" },
                { value: 270 as const, label: "270°", desc: "Counter-clockwise" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setAngle(opt.value)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    angle === opt.value
                      ? "border-[#121660] bg-[#121660]/5"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <p className="text-2xl font-bold" style={{ color: Brand.navy }}>{opt.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Pages (optional)</label>
            <input
              type="text"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              placeholder="e.g., 1-3, 5 (leave empty for all pages)"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#121660]/20 focus:border-[#121660]"
            />
          </div>

          {/* Preview */}
          <div className="flex items-center justify-center h-32 bg-slate-100 rounded-xl">
            <div
              className="w-16 h-20 bg-white border-2 border-slate-300 rounded flex items-center justify-center transition-transform"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <span className="text-xs text-slate-400">A4</span>
            </div>
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
}
