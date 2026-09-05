"use client";

import { useState, useRef } from "react";
import { PdfToolLayout } from "@/components/pdf/pdf-tool-layout";
import { Brand } from "@/config/site";
import { Upload, X, Image as ImageIcon } from "lucide-react";

const presets = ["APPROVED", "DRAFT", "CONFIDENTIAL", "REJECTED", "FINAL", "COPY"];

export default function StampPdfPage() {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [text, setText] = useState("APPROVED");
  const [opacity, setOpacity] = useState(0.5);
  const [rotation, setRotation] = useState(-15);
  const [fontSize, setFontSize] = useState(72);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProcess = async (files: File[]) => {
    if (mode === "text" && !text) throw new Error("Please enter stamp text");
    if (mode === "image" && !imageFile) throw new Error("Please select an image");

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("text", text || "");
    formData.append("opacity", String(opacity));
    formData.append("rotation", String(rotation));
    formData.append("fontSize", String(fontSize));

    if (mode === "image" && imageFile) {
      formData.append("image", imageFile);
    }

    const res = await fetch("/api/pdf/stamp", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Stamp failed");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${files[0].name.replace(/\.pdf$/i, "")}-stamped.pdf`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 5000);
  };

  return (
    <PdfToolLayout
      title="Stamp PDF"
      description="Add text or image stamp on top of your PDF pages"
      color={Brand.navy}
      maxFiles={1}
      accept=".pdf"
      onProcess={handleProcess}
    >
      {() => (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode("text")}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                mode === "text" ? "bg-[#121660] text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Text
            </button>
            <button
              onClick={() => setMode("image")}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                mode === "image" ? "bg-[#121660] text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              Image
            </button>
          </div>

          {/* Text Input */}
          {mode === "text" && (
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Stamp Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#121660]/20 focus:border-[#121660]"
                placeholder="e.g., APPROVED, DRAFT, CONFIDENTIAL"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setText(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      text === preset
                        ? "bg-[#121660] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image Upload */}
          {mode === "image" && (
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Stamp Image</label>
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Stamp preview" className="w-full h-32 object-contain bg-slate-50 rounded-xl" />
                  <button
                    onClick={() => { setImageFile(null); setImagePreview(""); }}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50"
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => inputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-[#121660] transition-colors"
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm text-slate-600">Click to upload image</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG</p>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          )}

          {/* Controls */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Opacity</label>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-slate-500 text-center mt-1">{Math.round(opacity * 100)}%</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Rotation</label>
              <input
                type="range"
                min="-90"
                max="90"
                step="5"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-slate-500 text-center mt-1">{rotation}°</p>
            </div>
            {mode === "text" && (
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Font Size</label>
                <input
                  type="range"
                  min="12"
                  max="120"
                  step="4"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-slate-500 text-center mt-1">{fontSize}pt</p>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="relative h-24 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
            {mode === "text" ? (
              <div
                className="text-4xl font-bold text-red-400/30 select-none pointer-events-none"
                style={{
                  fontSize: `${Math.min(fontSize / 2, 48)}px`,
                  opacity,
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                {text || "STAMP"}
              </div>
            ) : imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-16"
                style={{ opacity, transform: `rotate(${rotation}deg)` }}
              />
            ) : (
              <span className="text-xs text-slate-400">Preview</span>
            )}
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
}
