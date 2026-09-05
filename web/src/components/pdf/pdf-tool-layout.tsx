"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload, X, FileText, Loader2, Check, AlertCircle,
  GripVertical, ChevronUp, ChevronDown,
} from "lucide-react";
import { Brand } from "@/config/site";

interface PdfToolLayoutProps {
  title: string;
  description: string;
  color?: string;
  children: (props: {
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    options: Record<string, any>;
    setOptions: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    onProcess: () => Promise<void>;
    processing: boolean;
    result: "success" | "error" | null;
    errorMsg: string;
  }) => React.ReactNode;
  onProcess: (files: File[], options: Record<string, any>) => Promise<void>;
  maxFiles?: number;
  accept?: string;
  showFileList?: boolean;
  allowReorder?: boolean;
}

export function PdfToolLayout({
  title,
  description,
  color = Brand.navy,
  children,
  onProcess,
  maxFiles = 20,
  accept = ".pdf",
  showFileList = true,
  allowReorder = true,
}: PdfToolLayoutProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<Record<string, any>>({});
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      accept.split(",").some((ext) => f.name.toLowerCase().endsWith(ext.trim()))
    );
    if (dropped.length > 0) {
      setFiles((prev) => [...prev, ...dropped].slice(0, maxFiles));
      setResult(null);
    }
  }, [accept, maxFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selected].slice(0, maxFiles));
      setResult(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
  };

  const moveFile = (from: number, to: number) => {
    if (to < 0 || to >= files.length) return;
    const newFiles = [...files];
    const [moved] = newFiles.splice(from, 1);
    newFiles.splice(to, 0, moved);
    setFiles(newFiles);
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setResult(null);
    setErrorMsg("");
    try {
      await onProcess(files, options);
      setResult("success");
    } catch (err: any) {
      setResult("error");
      setErrorMsg(err.message || "Processing failed");
    } finally {
      setProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {/* Header */}
      <div className="relative" style={{ backgroundColor: color }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <a
              href="/pdf"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
            >
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              <p className="text-sm text-white/70 mt-0.5">{description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Upload Area */}
          <div
            className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-white hover:border-blue-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              multiple={maxFiles > 1}
              onChange={handleChange}
              className="hidden"
            />
            <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${color}10` }}>
              <Upload className="h-6 w-6" style={{ color }} />
            </div>
            <p className="text-lg font-semibold text-slate-900">
              {files.length > 0 ? `${files.length} file(s) selected` : "Drop PDF files here"}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {maxFiles > 1 ? `Up to ${maxFiles} files` : "Single file"} &middot; Max 50MB each
            </p>
          </div>

          {/* File List */}
          {showFileList && files.length > 0 && (
            <div className="rounded-2xl bg-white border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">Selected Files</h3>
                <button
                  onClick={() => { setFiles([]); setResult(null); }}
                  className="text-xs text-slate-500 hover:text-red-500 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    {allowReorder && maxFiles > 1 && (
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveFile(index, index - 1)}
                          disabled={index === 0}
                          className="p-0.5 rounded hover:bg-slate-200 disabled:opacity-30"
                        >
                          <ChevronUp className="h-3 w-3 text-slate-400" />
                        </button>
                        <button
                          onClick={() => moveFile(index, index + 1)}
                          disabled={index === files.length - 1}
                          className="p-0.5 rounded hover:bg-slate-200 disabled:opacity-30"
                        >
                          <ChevronDown className="h-3 w-3 text-slate-400" />
                        </button>
                      </div>
                    )}
                    <FileText className="h-5 w-5 text-red-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 rounded-full hover:bg-slate-200 transition-colors"
                    >
                      <X className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Options from children */}
          {children({
            files,
            setFiles,
            options,
            setOptions,
            onProcess: handleProcess,
            processing,
            result,
            errorMsg,
          })}

          {/* Progress */}
          {processing && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 text-blue-700">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Processing your PDF...</span>
            </div>
          )}

          {/* Result */}
          {result && (
            <div
              className={`flex items-center gap-3 p-4 rounded-xl ${
                result === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {result === "success" ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <span className="text-sm font-medium">
                {result === "success" ? "Done! Check your downloads." : errorMsg}
              </span>
            </div>
          )}

          {/* Process Button */}
          <button
            onClick={handleProcess}
            disabled={files.length === 0 || processing}
            className="w-full flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
            style={{ backgroundColor: color }}
          >
            {processing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              title
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
