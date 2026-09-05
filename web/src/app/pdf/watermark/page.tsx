"use client";

import { useState, useRef } from "react";
import { PdfToolLayout } from "@/components/pdf/pdf-tool-layout";
import { Brand } from "@/config/site";
import { Upload, X, Image as ImageIcon, Minus, Plus } from "lucide-react";

function NumberControl({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  suffix: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-900 mb-2">{label}</label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <Minus className="h-3 w-3 text-slate-600" />
        </button>
        <div className="flex-1 text-center">
          <span className="text-sm font-semibold text-slate-900">{value}{suffix}</span>
        </div>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <Plus className="h-3 w-3 text-slate-600" />
        </button>
      </div>
    </div>
  );
}

export default function WatermarkPdfPage() {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0);
  const [rotation, setRotation] = useState(-45);
  const [fontSize, setFontSize] = useState(72);
  const [imageScale, setImageScale] = useState(50);
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
    if (mode === "text" && !text) throw new Error("Please enter watermark text");
    if (mode === "image" && !imageFile) throw new Error("Please select an image");

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("text", text || "");
    formData.append("opacity", String(opacity));
    formData.append("rotation", String(rotation));
    formData.append("fontSize", String(fontSize));
    formData.append("scale", String(imageScale));

    if (mode === "image" && imageFile) {
      formData.append("image", imageFile);
    }

    const res = await fetch("/api/pdf/watermark", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Watermark failed");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${files[0].name.replace(/\.pdf$/i, "")}-watermarked.pdf`;
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
      title="Watermark PDF"
      description="Add text or image watermark behind your PDF content"
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
              <label className="block text-sm font-semibold text-slate-900 mb-2">Watermark Text</label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#121660]/20 focus:border-[#121660]"
                placeholder="e.g., CONFIDENTIAL, DRAFT, SAMPLE"
              />
            </div>
          )}

          {/* Image Upload */}
          {mode === "image" && (
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Watermark Image</label>
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Watermark preview" className="w-full h-32 object-contain bg-slate-50 rounded-xl" />
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
          <div className="grid grid-cols-2 gap-4">
            <NumberControl
              label="Opacity"
              value={Math.round(opacity * 100)}
              onChange={(v) => setOpacity(v / 100)}
              min={0}
              max={100}
              step={5}
              suffix="%"
            />
            <NumberControl
              label="Rotation"
              value={rotation}
              onChange={setRotation}
              min={-90}
              max={90}
              step={5}
              suffix="°"
            />
            {mode === "text" && (
              <NumberControl
                label="Font Size"
                value={fontSize}
                onChange={setFontSize}
                min={12}
                max={120}
                step={4}
                suffix="pt"
              />
            )}
            {mode === "image" && (
              <NumberControl
                label="Size"
                value={imageScale}
                onChange={setImageScale}
                min={10}
                max={100}
                step={5}
                suffix="%"
              />
            )}
          </div>

          {/* Preview */}
          <div className="relative h-24 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
            {mode === "text" ? (
              <div
                className="text-slate-400 font-bold select-none pointer-events-none"
                style={{
                  fontSize: `${Math.min(fontSize / 2, 36)}px`,
                  opacity,
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                {text || "PREVIEW"}
              </div>
            ) : imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-20"
                style={{ opacity, transform: `rotate(${rotation}deg)`, width: `${imageScale}%` }}
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
