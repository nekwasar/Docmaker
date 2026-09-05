"use client";

import { useState } from "react";
import { PdfToolLayout } from "@/components/pdf/pdf-tool-layout";
import { Brand } from "@/config/site";

export default function WatermarkPdfPage() {
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.3);
  const [rotation, setRotation] = useState(45);
  const [fontSize, setFontSize] = useState(48);

  const handleProcess = async (files: File[], options: Record<string, any>) => {
    if (!text) throw new Error("Please enter watermark text");
    if (!files[0]) throw new Error("No file selected");

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("text", text);

    const res = await fetch("/api/pdf/watermark", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Watermark failed");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${files[0].name.replace(/\.pdf$/i, "")}-watermarked.pdf`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 5000);
  };

  return (
    <PdfToolLayout
      title="Watermark PDF"
      description="Add a text watermark to your PDF document"
      color={Brand.navy}
      maxFiles={1}
      accept=".pdf"
      onProcess={handleProcess}
    >
      {({ files }) => (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Watermark Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#121660]/20 focus:border-[#121660]"
              placeholder="e.g., CONFIDENTIAL, DRAFT, SAMPLE"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Opacity</label>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-slate-500 text-center mt-1">{Math.round(opacity * 100)}%</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Rotation</label>
              <input
                type="range"
                min="-90"
                max="90"
                step="5"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-slate-500 text-center mt-1">{rotation}°</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Font Size</label>
              <input
                type="range"
                min="12"
                max="120"
                step="4"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-slate-500 text-center mt-1">{fontSize}pt</p>
            </div>
          </div>

          {/* Preview */}
          <div className="relative h-32 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
            <div
              className="text-slate-400 font-bold select-none pointer-events-none"
              style={{
                fontSize: `${Math.min(fontSize / 2, 36)}px`,
                opacity,
                transform: `rotate(${rotation}deg)`,
              }}
            >
              {text || "PREVIEW"}
            </div>
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
}
