"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Image, X } from "lucide-react";

interface OCRUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export function OCRUpload({ onFileSelect, selectedFile, onClear }: OCRUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "gif", "webp", "bmp", "tiff"].includes(ext)) {
      return <Image className="h-8 w-8" />;
    }
    if (ext === "pdf") {
      return <FileText className="h-8 w-8" />;
    }
    return <FileText className="h-8 w-8" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
        dragActive
          ? "border-[#FFD140] bg-[#FFD140]/5"
          : selectedFile
          ? "border-green-300 bg-green-50"
          : "border-slate-300 bg-white hover:border-[#FFD140]"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => !selectedFile && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleChange}
        className="hidden"
      />

      {selectedFile ? (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-xl bg-[#FFD140]/10 text-[#FFD140]">
              {getFileIcon(selectedFile.name)}
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-900">{selectedFile.name}</p>
              <p className="text-sm text-slate-500">{formatSize(selectedFile.size)}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="p-1.5 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          </div>
          <p className="text-xs text-slate-400">Click to change file</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="mx-auto w-14 h-14 rounded-xl bg-[#FFD140]/10 flex items-center justify-center">
            <Upload className="h-7 w-7 text-[#FFD140]" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">Upload an image or PDF</p>
            <p className="text-sm text-slate-500 mt-1">
              JPG, PNG, WEBP, GIF, BMP, TIFF, or PDF — Max 50MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
