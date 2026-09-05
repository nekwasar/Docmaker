"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, Image, Film, Music, FileSpreadsheet, Loader2, Check, AlertCircle } from "lucide-react";
import { Brand } from "@/config/site";

interface FileUploadProps {
  accept?: string;
  onConvert: (file: File, targetFormat: string) => Promise<void>;
  targetFormats: { id: string; label: string; icon?: string }[];
  title: string;
  description: string;
  color?: string;
}

export function FileUpload({
  accept,
  onConvert,
  targetFormats,
  title,
  description,
  color = Brand.blue,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState(targetFormats[0]?.id || "");
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
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
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
      setResult(null);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleConvert = async () => {
    if (!file || !targetFormat) return;

    setConverting(true);
    setProgress(0);
    setResult(null);
    setErrorMsg("");

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((p) => Math.min(p + 10, 90));
      }, 200);

      await onConvert(file, targetFormat);

      clearInterval(progressInterval);
      setProgress(100);
      setResult("success");
    } catch (err: any) {
      setResult("error");
      setErrorMsg(err.message || "Conversion failed");
    } finally {
      setConverting(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "tiff"].includes(ext)) return <Image className="h-5 w-5" />;
    if (["mp4", "avi", "mov", "mkv", "webm"].includes(ext)) return <Film className="h-5 w-5" />;
    if (["mp3", "wav", "aac", "flac", "ogg", "m4a"].includes(ext)) return <Music className="h-5 w-5" />;
    if (["csv", "xlsx", "xls"].includes(ext)) return <FileSpreadsheet className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Target Format Selector */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4">
        <label className="block text-sm font-semibold text-slate-900 mb-3">Convert to</label>
        <div className="flex flex-wrap gap-2">
          {targetFormats.map((f) => (
            <button
              key={f.id}
              onClick={() => setTargetFormat(f.id)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                backgroundColor: targetFormat === f.id ? color : "#F1F5F9",
                color: targetFormat === f.id ? "#FFFFFF" : "#64748B",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
          dragActive ? "border-blue-500 bg-blue-50" : file ? "border-green-300 bg-green-50" : "border-slate-300 bg-white hover:border-blue-400"
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
          onChange={handleChange}
          className="hidden"
        />

        {file ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
                <div style={{ color }}>{getFileIcon(file.name)}</div>
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900">{file.name}</p>
                <p className="text-sm text-slate-500">{formatSize(file.size)}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setResult(null);
                }}
                className="p-1 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}10` }}>
              <Upload className="h-6 w-6" style={{ color }} />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{title}</p>
              <p className="text-sm text-slate-500 mt-1">{description}</p>
            </div>
            <p className="text-xs text-slate-400">Maximum file size: 50MB</p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {converting && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Converting...</span>
            <span className="text-slate-600">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: color }}
            />
          </div>
        </div>
      )}

      {/* Result Message */}
      {result && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl ${
            result === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {result === "success" ? (
            <Check className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">
            {result === "success" ? "Conversion complete! Check your downloads." : errorMsg}
          </span>
        </div>
      )}

      {/* Convert Button */}
      <button
        onClick={handleConvert}
        disabled={!file || converting}
        className="w-full flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
        style={{ backgroundColor: color }}
      >
        {converting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Converting...
          </>
        ) : (
          "Convert"
        )}
      </button>
    </div>
  );
}
