"use client";

import { FileUpload } from "@/components/convert/file-upload";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { ArrowRight } from "lucide-react";

const TARGET_FORMATS = [
  { id: "jpg", label: "JPG" },
  { id: "png", label: "PNG" },
  { id: "webp", label: "WEBP" },
  { id: "gif", label: "GIF" },
  { id: "tiff", label: "TIFF" },
];

export default function ImageConvertPage() {
  const handleConvert = async (file: File, targetFormat: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target", targetFormat);

    const res = await fetch("/api/convert", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Conversion failed");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name.split(".")[0]}.${targetFormat}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout title="Convert Images" color="blue">
      <div className="space-y-8">
        <p className="text-lg text-slate-600">Convert images between formats. JPG, PNG, WEBP, GIF, TIFF, and more.</p>

        <div className="flex items-center justify-center gap-6 py-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0171DF]/10 flex items-center justify-center mb-2">
              <span className="text-lg font-bold text-[#0171DF]">IMG</span>
            </div>
          </div>
          <ArrowRight className="h-6 w-6 text-slate-400" />
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0171DF]/10 flex items-center justify-center mb-2">
              <span className="text-lg font-bold text-[#0171DF]">IMG</span>
            </div>
          </div>
        </div>

        <FileUpload
          accept=".jpg,.jpeg,.png,.webp,.gif,.tiff,.tif,.bmp,.avif"
          onConvert={handleConvert}
          targetFormats={TARGET_FORMATS}
          title="Drop images here"
          description="Supports JPG, PNG, WEBP, GIF, TIFF, BMP, AVIF"
          color="#0171DF"
        />
      </div>
    </ToolPageLayout>
  );
}
