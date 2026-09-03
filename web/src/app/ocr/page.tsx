"use client";

import { useState } from "react";
import { Upload, Copy, Check } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { Brand } from "@/config/site";

export default function OCRPage() {
  const [extractedText, setExtractedText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPageLayout title="Extract Text (OCR)" color="yellow">
      <div className="space-y-6">
        {/* Upload Area */}
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center hover:border-[#FFD140] transition-colors">
          <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p className="text-lg font-semibold text-slate-900 mb-2">
            Upload an image or PDF
          </p>
          <p className="text-sm text-slate-500 mb-4">
            Extract text from images, scanned documents, or PDFs
          </p>
          <label className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold cursor-pointer transition-all hover:scale-105" style={{ backgroundColor: Brand.yellow, color: '#0F172A' }}>
            <Upload className="h-4 w-4" />
            Select File
            <input type="file" accept="image/*,.pdf" className="hidden" />
          </label>
        </div>

        {/* Extract Button */}
        <button
          className="w-full flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold transition-all hover:scale-[1.02]"
          style={{ backgroundColor: Brand.yellow, color: '#0F172A' }}
        >
          Extract Text
        </button>

        {/* Extracted Text */}
        {extractedText && (
          <div className="rounded-2xl bg-white border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">Extracted Text</h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-sm font-medium hover:underline"
                style={{ color: Brand.yellow }}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-700 whitespace-pre-wrap">
              {extractedText}
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
