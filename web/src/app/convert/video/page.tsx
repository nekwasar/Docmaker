"use client";

import { FileUpload } from "@/components/convert/file-upload";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { ArrowRight } from "lucide-react";

const TARGET_FORMATS = [
  { id: "mp3", label: "MP3 (audio only)" },
  { id: "mp4", label: "MP4" },
  { id: "avi", label: "AVI" },
  { id: "mov", label: "MOV" },
  { id: "mkv", label: "MKV" },
  { id: "webm", label: "WEBM" },
  { id: "gif", label: "GIF" },
];

export default function VideoConvertPage() {
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
    <ToolPageLayout title="Convert Video" color="blue">
      <div className="space-y-8">
        <p className="text-lg text-slate-600">Convert video files between formats. MP4, AVI, MOV, MKV, and more.</p>

        <div className="flex items-center justify-center gap-6 py-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0171DF]/10 flex items-center justify-center mb-2">
              <span className="text-lg font-bold text-[#0171DF]">MP4</span>
            </div>
          </div>
          <ArrowRight className="h-6 w-6 text-slate-400" />
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0171DF]/10 flex items-center justify-center mb-2">
              <span className="text-lg font-bold text-[#0171DF]">AVI</span>
            </div>
          </div>
        </div>

        <FileUpload
          accept=".mp4,.avi,.mov,.mkv,.webm,.wmv,.flv,.3gp"
          onConvert={handleConvert}
          targetFormats={TARGET_FORMATS}
          title="Drop video files here"
          description="Supports MP4, AVI, MOV, MKV, WEBM, WMV, FLV, 3GP"
          color="#0171DF"
        />
      </div>
    </ToolPageLayout>
  );
}
