"use client";

import { PdfToolLayout } from "@/components/pdf/pdf-tool-layout";
import { Brand } from "@/config/site";

export default function RepairPdfPage() {
  const handleProcess = async (files: File[]) => {
    const formData = new FormData();
    formData.append("file", files[0]);

    const res = await fetch("/api/pdf/repair", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Repair failed");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${files[0].name.replace(/\.pdf$/i, "")}-repaired.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <PdfToolLayout
      title="Repair PDF"
      description="Fix corrupted or damaged PDF files"
      color={Brand.navy}
      maxFiles={1}
      accept=".pdf"
      onProcess={handleProcess}
    >
      {() => (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 text-blue-700">
            <svg className="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <p className="font-medium">How repair works</p>
              <p className="mt-1 text-blue-600">
                Our repair tool re-processes your PDF through LibreOffice, which can fix:
              </p>
              <ul className="mt-2 space-y-1 text-blue-600">
                <li>• Corrupted file headers</li>
                <li>• Broken cross-reference tables</li>
                <li>• Invalid object references</li>
                <li>• Missing or damaged fonts</li>
              </ul>
              <p className="mt-2 text-blue-600">
                Note: Heavily corrupted files may not be fully recoverable.
              </p>
            </div>
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
}
