"use client";

import { useState } from "react";
import { Upload, ArrowRight } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";

export default function JPGToPDFPage() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <ToolPageLayout title="JPG to PDF" color="blue">
      <div className="space-y-8">
        <p className="text-lg text-slate-600">Convert JPG images to PDF documents.</p>

        <div className="flex items-center justify-center gap-6 py-8">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#0171DF]/10 flex items-center justify-center mb-2">
              <Text className="text-2xl font-bold" style={{ color: '#0171DF' }}>JPG</Text>
            </div>
          </div>
          <ArrowRight className="h-8 w-8 text-slate-400" />
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-[#0171DF]/10 flex items-center justify-center mb-2">
              <Text className="text-2xl font-bold" style={{ color: '#0171DF' }}>PDF</Text>
            </div>
          </div>
        </div>

        <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-[#0171DF] transition-colors cursor-pointer">
          <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p className="text-lg font-semibold text-slate-900 mb-2">Drop images here or click to upload</p>
          <p className="text-sm text-slate-500">Supports JPG, PNG, WEBP</p>
        </div>

        <button
          disabled={!file}
          className="w-full py-4 px-6 rounded-full text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#0171DF' }}
        >
          Convert to PDF
        </button>
      </div>
    </ToolPageLayout>
  );
}
