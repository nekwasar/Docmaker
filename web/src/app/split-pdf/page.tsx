"use client";

import { useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";

export default function SplitPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [splitOption, setSplitOption] = useState("all");

  return (
    <ToolPageLayout title="Split PDF" color="teal">
      <div className="space-y-8">
        <p className="text-lg text-slate-600">Separate a PDF into individual pages or custom ranges.</p>

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

        {/* Split Options */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Split Options</h3>
          <div className="space-y-3">
            {[
              { id: "all", label: "Extract all pages", desc: "Each page becomes a separate PDF" },
              { id: "range", label: "Page range", desc: "Specify start and end pages" },
              { id: "custom", label: "Custom pages", desc: "Select specific pages to extract" },
            ].map((option) => (
              <label
                key={option.id}
                className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                  splitOption === option.id
                    ? "border-[#3CAE8B] bg-[#3CAE8B]/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="splitOption"
                  value={option.id}
                  checked={splitOption === option.id}
                  onChange={() => setSplitOption(option.id)}
                  className="w-4 h-4 text-[#3CAE8B]"
                />
                <div>
                  <p className="font-semibold text-slate-900">{option.label}</p>
                  <p className="text-sm text-slate-500">{option.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          disabled={!file}
          className="w-full py-4 px-6 rounded-full text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#3CAE8B' }}
        >
          Split PDF
        </button>
      </div>
    </ToolPageLayout>
  );
}
