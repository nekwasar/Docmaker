"use client";

import { useState, useRef } from "react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { Upload, ArrowRight, ChevronDown, Check, Loader2, AlertCircle } from "lucide-react";
import { Brand } from "@/config/site";
import {
  CONVERSION_MAP,
  FORMAT_LABELS,
  getTargets,
  getAcceptAttribute,
} from "@/lib/convert/formats";

interface ConverterPageProps {
  title: string;
  description: string;
  color?: string;
  formats: readonly string[];
}

export function ConverterPage({
  title,
  description,
  color = Brand.blue,
  formats,
}: ConverterPageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [sourceFormat, setSourceFormat] = useState("");
  const [targetFormat, setTargetFormat] = useState("");
  const [converting, setConverting] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const targets = sourceFormat ? getTargets(sourceFormat) : [];
  const allFormats = Array.from(formats);

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
      const dropped = e.dataTransfer.files[0];
      setFile(dropped);
      const ext = dropped.name.split(".").pop()?.toLowerCase() || "";
      setSourceFormat(ext);
      setTargetFormat("");
      setResult(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      const ext = selected.name.split(".").pop()?.toLowerCase() || "";
      setSourceFormat(ext);
      setTargetFormat("");
      setResult(null);
    }
  };

  const handleConvert = async () => {
    if (!file || !targetFormat) return;

    setConverting(true);
    setResult(null);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("target", targetFormat);

      const res = await fetch("/api/convert", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Conversion failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name.split(".")[0]}.${targetFormat}`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 5000);

      setResult("success");
    } catch (err: any) {
      setResult("error");
      setErrorMsg(err.message || "Conversion failed");
    } finally {
      setConverting(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <ToolPageLayout title={title} color="blue">
      <div className="space-y-6">
        <p className="text-lg text-slate-600">{description}</p>

        {/* From / To selectors */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-900 mb-2">From</label>
            <div className="relative">
              <select
                value={sourceFormat}
                onChange={(e) => {
                  setSourceFormat(e.target.value);
                  setTargetFormat("");
                  setResult(null);
                }}
                className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#0171DF]/20 focus:border-[#0171DF]"
              >
                <option value="">Select format...</option>
                {allFormats.map((f) => (
                  <option key={f} value={f}>{FORMAT_LABELS[f] || f.toUpperCase()}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="pt-6">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
              <ArrowRight className="h-5 w-5 text-slate-400" />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-900 mb-2">To</label>
            <div className="relative">
              <select
                value={targetFormat}
                onChange={(e) => {
                  setTargetFormat(e.target.value);
                  setResult(null);
                }}
                disabled={!sourceFormat}
                className="w-full appearance-none px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-[#0171DF]/20 focus:border-[#0171DF] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select format...</option>
                {targets.map((f) => (
                  <option key={f} value={f}>{FORMAT_LABELS[f] || f.toUpperCase()}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Compatible targets info */}
        {sourceFormat && targets.length > 0 && (
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">
              <span className="font-medium">{FORMAT_LABELS[sourceFormat] || sourceFormat.toUpperCase()}</span> can convert to:{" "}
              {targets.map((f) => FORMAT_LABELS[f] || f.toUpperCase()).join(", ")}
            </p>
          </div>
        )}

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
            accept={sourceFormat ? `.${sourceFormat}` : getAcceptAttribute(allFormats)}
            onChange={handleChange}
            className="hidden"
          />
          {file ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-slate-900">{file.name}</span>
                <span className="text-sm text-slate-500">({formatSize(file.size)})</span>
              </div>
              <p className="text-xs text-slate-500">Click to change file</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="h-10 w-10 mx-auto text-slate-400" />
              <p className="text-lg font-semibold text-slate-900">Drop a file here or click to upload</p>
              <p className="text-sm text-slate-500">Max 50MB</p>
            </div>
          )}
        </div>

        {/* Progress */}
        {converting && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 text-blue-700">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Converting {FORMAT_LABELS[sourceFormat]} → {FORMAT_LABELS[targetFormat]}...</span>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`flex items-center gap-3 p-4 rounded-xl ${result === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {result === "success" ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="text-sm font-medium">
              {result === "success" ? "Done! Check your downloads." : errorMsg}
            </span>
          </div>
        )}

        {/* Convert Button */}
        <button
          onClick={handleConvert}
          disabled={!file || !targetFormat || converting}
          className="w-full flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
          style={{ backgroundColor: color }}
        >
          {converting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              Convert {sourceFormat && targetFormat ? `${FORMAT_LABELS[sourceFormat]} → ${FORMAT_LABELS[targetFormat]}` : "File"}
            </>
          )}
        </button>
      </div>
    </ToolPageLayout>
  );
}
