"use client";

import { useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";

export default function WatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");

  return (
    <ToolPageLayout title="Watermark" color="teal">
      <div className="space-y-8">
        <p className="text-lg text-slate-600">Add watermarks to your PDF pages.</p>

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

        {/* Watermark Text */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Watermark Text</h3>
          <input
            type="text"
            value={watermarkText}
            onChange={(e) => setWatermarkText(e.target.value)}
            placeholder="Enter watermark text"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CAE8B] focus:border-transparent"
          />
        </div>

        {/* Preview */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Preview</h3>
          <div className="border border-slate-200 rounded-lg p-8 text-center">
            <p className="text-4xl font-bold text-slate-300 rotate-[-45deg] opacity-30">
              {watermarkText}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          disabled={!file}
          className="w-full py-4 px-6 rounded-full text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#3CAE8B' }}
        >
          Add Watermark
        </button>
      </div>
    </ToolPageLayout>
  );
}
