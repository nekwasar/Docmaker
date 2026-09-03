"use client";

import { useState } from "react";
import { Upload, X, FileText, Pen } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";

export default function SignPage() {
  const [file, setFile] = useState<File | null>(null);
  const [hasSignature, setHasSignature] = useState(false);

  return (
    <ToolPageLayout title="E-Sign" color="teal">
      <div className="space-y-8">
        <p className="text-lg text-slate-600">Sign documents digitally with ease.</p>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-[#3CAE8B] transition-colors cursor-pointer">
          <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p className="text-lg font-semibold text-slate-900 mb-2">Drop a document here or click to upload</p>
          <p className="text-sm text-slate-500">Supports PDF, DOCX, and more</p>
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

        {/* Signature Section */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Your Signature</h3>
          {!hasSignature ? (
            <button
              onClick={() => setHasSignature(true)}
              className="w-full border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-[#3CAE8B] transition-colors"
            >
              <Pen className="h-8 w-8 mx-auto mb-3 text-slate-400" />
              <p className="text-lg font-semibold text-slate-900">Tap to draw your signature</p>
              <p className="text-sm text-slate-500 mt-1">Or upload an image of your signature</p>
            </button>
          ) : (
            <div className="border border-slate-200 rounded-lg p-8 text-center bg-slate-50">
              <p className="text-3xl font-bold italic text-slate-700">John Doe</p>
              <button
                onClick={() => setHasSignature(false)}
                className="mt-4 text-sm text-[#3CAE8B] hover:underline"
              >
                Clear signature
              </button>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          disabled={!file || !hasSignature}
          className="w-full py-4 px-6 rounded-full text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#3CAE8B' }}
        >
          Apply Signature
        </button>
      </div>
    </ToolPageLayout>
  );
}
