"use client";

import { FileUpload } from "@/components/convert/file-upload";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { ArrowRight } from "lucide-react";

const TARGET_FORMATS = [
  { id: "pdf", label: "PDF" },
  { id: "docx", label: "DOCX" },
  { id: "txt", label: "TXT" },
  { id: "html", label: "HTML" },
  { id: "md", label: "Markdown" },
];

export default function EPUBConvertPage() {
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
    <ToolPageLayout title="EPUB Converter" color="blue">
      <div className="space-y-8">
        <p className="text-lg text-slate-600">Convert EPUB ebooks to PDF, DOCX, TXT, HTML, and more. Also create EPUBs from documents.</p>

        <div className="flex items-center justify-center gap-6 py-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#0171DF]/10 flex items-center justify-center mb-2">
              <span className="text-lg font-bold text-[#0171DF]">EPUB</span>
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
          accept=".epub"
          onConvert={handleConvert}
          targetFormats={TARGET_FORMATS}
          title="Drop an EPUB file here"
          description="Converts EPUB to PDF, DOCX, TXT, HTML, or Markdown"
          color="#0171DF"
        />
      </div>
    </ToolPageLayout>
  );
}
