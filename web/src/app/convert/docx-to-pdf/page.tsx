"use client";

import { FileUpload } from "@/components/convert/file-upload";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { ArrowRight } from "lucide-react";

const TARGET_FORMATS = [
  { id: "pdf", label: "PDF" },
];

export default function WordToPDFPage() {
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
    a.download = `${file.name.split(".")[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout title="Word to PDF" color="blue">
      <div className="space-y-8">
        <p className="text-lg text-slate-600">Convert Word documents to PDF format. Supports DOCX, DOC, ODT, RTF, and more.</p>

        <div className="flex items-center justify-center gap-6 py-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0171DF]/10 flex items-center justify-center mb-2">
              <span className="text-lg font-bold text-[#0171DF]">DOCX</span>
            </div>
          </div>
          <ArrowRight className="h-6 w-6 text-slate-400" />
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0171DF]/10 flex items-center justify-center mb-2">
              <span className="text-lg font-bold text-[#0171DF]">PDF</span>
            </div>
          </div>
        </div>

        <FileUpload
          accept=".doc,.docx,.docm,.dot,.dotm,.dotx,.odt,.fodt,.ott,.rtf,.txt"
          onConvert={handleConvert}
          targetFormats={TARGET_FORMATS}
          title="Drop a Word document here"
          description="Supports DOCX, DOC, ODT, RTF, TXT"
          color="#0171DF"
        />
      </div>
    </ToolPageLayout>
  );
}
