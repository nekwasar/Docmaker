"use client";

import { useState } from "react";
import { PdfToolLayout } from "@/components/pdf/pdf-tool-layout";
import { Brand } from "@/config/site";

export default function PageNumbersPage() {
  const [position, setPosition] = useState("bottom-center");
  const [format, setFormat] = useState("page-of-total");

  const handleProcess = async (files: File[]) => {
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("position", position);
    formData.append("format", format);

    const res = await fetch("/api/pdf/page-numbers", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Adding page numbers failed");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${files[0].name.replace(/\.pdf$/i, "")}-numbered.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <PdfToolLayout
      title="Add Page Numbers"
      description="Add page numbers to your PDF document"
      color={Brand.navy}
      maxFiles={1}
      accept=".pdf"
      onProcess={handleProcess}
    >
      {() => (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Position</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "bottom-left", label: "Bottom Left" },
                { id: "bottom-center", label: "Bottom Center" },
                { id: "bottom-right", label: "Bottom Right" },
              ].map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => setPosition(pos.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    position === pos.id
                      ? "bg-[#121660] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Format</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "page-of-total", label: "1 of 10", desc: "Page of Total" },
                { id: "page-only", label: "1", desc: "Page Number Only" },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setFormat(fmt.id)}
                  className={`p-3 rounded-xl text-left transition-all ${
                    format === fmt.id
                      ? "bg-[#121660]/5 border-2 border-[#121660]"
                      : "border-2 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{fmt.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{fmt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
}
