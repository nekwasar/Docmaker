"use client";

import { useState } from "react";
import { PdfToolLayout } from "@/components/pdf/pdf-tool-layout";
import { Brand } from "@/config/site";

export default function PdfaPage() {
  const [standard, setStandard] = useState("PDF/A-2b");

  const handleProcess = async (files: File[]) => {
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("standard", standard);

    const res = await fetch("/api/pdf/pdfa", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "PDF/A conversion failed");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${files[0].name.replace(/\.pdf$/i, "")}-pdfa.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <PdfToolLayout
      title="PDF to PDF/A"
      description="Convert PDF to PDF/A archival standard"
      color={Brand.navy}
      maxFiles={1}
      accept=".pdf"
      onProcess={handleProcess}
    >
      {() => (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">PDF/A Standard</label>
            <div className="space-y-2">
              {[
                {
                  id: "PDF/A-1b",
                  label: "PDF/A-1b",
                  desc: "ISO 19005-1. Most compatible. Embeds all fonts. No encryption or annotations.",
                },
                {
                  id: "PDF/A-2b",
                  label: "PDF/A-2b",
                  desc: "ISO 19005-2. Supports JPEG2000, transparency, and embedded attachments. Recommended.",
                },
                {
                  id: "PDF/A-3b",
                  label: "PDF/A-3b",
                  desc: "ISO 19005-3. Like PDF/A-2b but allows any file format as attachment.",
                },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStandard(s.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    standard === s.id
                      ? "border-[#121660] bg-[#121660]/5"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{s.label}</p>
                    {standard === s.id && (
                      <div className="w-5 h-5 rounded-full bg-[#121660] flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 text-amber-700">
            <svg className="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="text-sm">
              <p className="font-medium">About PDF/A</p>
              <p className="mt-1 text-amber-600">
                PDF/A is an ISO-standardized format for long-term archiving. It ensures your document
                can be opened and rendered consistently years from now. Commonly required for legal,
                government, and archival submissions.
              </p>
            </div>
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
}
