"use client";

import { PdfToolLayout } from "@/components/pdf/pdf-tool-layout";
import { Brand } from "@/config/site";

export default function MergePdfPage() {
  const handleProcess = async (files: File[], options: Record<string, any>) => {
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    const res = await fetch("/api/pdf/merge", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Merge failed");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <PdfToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into one document"
      color={Brand.navy}
      maxFiles={20}
      accept=".pdf"
      onProcess={handleProcess}
    >
      {({ files }) => (
        <div className="rounded-2xl bg-white border border-slate-200 p-4">
          <p className="text-sm text-slate-600">
            {files.length < 2
              ? "Select at least 2 PDF files to merge. Files will be combined in the order shown above."
              : `${files.length} files ready to merge. Use the arrows to reorder.`}
          </p>
        </div>
      )}
    </PdfToolLayout>
  );
}
