"use client";

import { useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";

export default function SummarizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState("");

  const handleSummarize = () => {
    if (!file) return;
    setSummary("This document provides a comprehensive overview of the key topics. The main points include project objectives, timeline, budget allocation, and expected outcomes. The document concludes with recommendations for next steps.");
  };

  return (
    <ToolPageLayout title="Summarize" color="navy">
      <div className="space-y-8">
        <p className="text-lg text-slate-600">Create short summaries of long documents instantly.</p>

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

        {/* Summarize Button */}
        <button
          onClick={handleSummarize}
          disabled={!file}
          className="w-full py-4 px-6 rounded-full text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#121660' }}
        >
          Summarize Document
        </button>

        {/* Summary */}
        {summary && (
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Summary</h3>
            <p className="text-slate-600 leading-relaxed">{summary}</p>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
