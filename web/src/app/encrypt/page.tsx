"use client";

import { useState } from "react";
import { Upload, X, FileText, Eye, EyeOff } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";

export default function EncryptPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ToolPageLayout title="Encrypt PDF" color="teal">
      <div className="space-y-8">
        <p className="text-lg text-slate-600">Password-protect your PDF documents.</p>

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

        {/* Password Input */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Set Password</h3>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CAE8B] focus:border-transparent"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-slate-400" />
              ) : (
                <Eye className="h-5 w-5 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          disabled={!file || !password}
          className="w-full py-4 px-6 rounded-full text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#3CAE8B' }}
        >
          Encrypt PDF
        </button>
      </div>
    </ToolPageLayout>
  );
}
