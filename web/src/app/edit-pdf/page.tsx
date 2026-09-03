"use client";

import { useState } from "react";
import { Upload, X, FileText, Type, Image, Pen, Square } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";

const TOOLS = [
  { id: "text", icon: Type, label: "Text" },
  { id: "image", icon: Image, label: "Image" },
  { id: "draw", icon: Pen, label: "Draw" },
  { id: "shape", icon: Square, label: "Shape" },
];

export default function EditPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [activeTool, setActiveTool] = useState("text");

  return (
    <ToolPageLayout title="Edit PDF" color="teal">
      <div className="space-y-8">
        <p className="text-lg text-slate-600">Add text, images, shapes, and annotations to your PDF.</p>

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

        {/* Edit Tools */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Edit Tools</h3>
          <div className="grid grid-cols-4 gap-4">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
                  activeTool === tool.id
                    ? "border-[#3CAE8B] bg-[#3CAE8B]/5"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <tool.icon className="h-6 w-6" style={{ color: activeTool === tool.id ? '#3CAE8B' : '#64748B' }} />
                <span className={`text-sm font-medium ${activeTool === tool.id ? 'text-[#3CAE8B]' : 'text-slate-600'}`}>
                  {tool.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Canvas Placeholder */}
        {file && (
          <div className="border border-slate-200 rounded-lg h-96 flex items-center justify-center bg-slate-50">
            <p className="text-slate-400">PDF preview will appear here</p>
          </div>
        )}

        {/* Action Button */}
        <button
          disabled={!file}
          className="w-full py-4 px-6 rounded-full text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#3CAE8B' }}
        >
          Save Edited PDF
        </button>
      </div>
    </ToolPageLayout>
  );
}
