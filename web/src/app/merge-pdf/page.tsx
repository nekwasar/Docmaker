"use client";

import { useState } from "react";
import { Upload, FileText, X, Merge } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { Brand } from "@/config/site";

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <ToolPageLayout title="Merge PDF" color="teal">
      <div className="space-y-6">
        {/* Upload Area */}
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center hover:border-[#3CAE8B] transition-colors">
          <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p className="text-lg font-semibold text-slate-900 mb-2">
            Drop PDF files here or click to upload
          </p>
          <p className="text-sm text-slate-500 mb-4">
            Select 2 or more PDF files to merge
          </p>
          <label className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white cursor-pointer transition-all hover:scale-105" style={{ backgroundColor: Brand.teal }}>
            <Upload className="h-4 w-4" />
            Select Files
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="rounded-2xl bg-white border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Selected Files ({files.length})
            </h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <FileText className="h-5 w-5 text-[#3CAE8B]" />
                  <span className="flex-1 text-sm text-slate-900 truncate">{file.name}</span>
                  <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  <button onClick={() => removeFile(index)} className="p-1 hover:bg-slate-200 rounded">
                    <X className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Merge Button */}
        <button
          disabled={files.length < 2}
          className="w-full flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
          style={{ backgroundColor: Brand.teal }}
        >
          <Merge className="h-5 w-5" />
          Merge {files.length} PDFs
        </button>
      </div>
    </ToolPageLayout>
  );
}
