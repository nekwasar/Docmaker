"use client";

import { PdfToolLayout } from "@/components/pdf/pdf-tool-layout";
import { Brand } from "@/config/site";
import { SeoBlock } from "@/components/seo/seo-block";

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
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <>
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
      <SeoMerge />
    </>
  );
}

function SeoMerge() {
  return (
    <SeoBlock
      title="Merge PDF files free online"
      intro="Combine multiple PDFs into a single document in seconds. Docmaker merges your PDFs in the correct order, preserves quality, and keeps your files private. No signup, no watermark, and your files are auto-deleted after 1 hour."
      steps={[
        { title: "Upload 2+ PDFs", desc: "Drag and drop your PDF files. Reorder them using the arrow buttons." },
        { title: "Click Merge PDF", desc: "We combine them in the exact order shown into one PDF." },
        { title: "Download", desc: "Save your merged PDF instantly. Share or store it securely." },
      ]}
      benefits={[
        "Free and unlimited — merge up to 20 PDFs (50MB each) at once",
        "Preserves quality, fonts, and layout",
        "Files processed on our servers and deleted after 1 hour",
        "Works on desktop and mobile, no software to install",
      ]}
      faqs={[
        { q: "Is merging PDF free?", a: "Yes, Docmaker lets you merge PDFs free with no limits or watermarks." },
        { q: "Can I reorder PDFs before merging?", a: "Yes, use the up/down arrows to arrange files in your desired order." },
        { q: "Is it safe to upload PDFs?", a: "Files are encrypted in transit (TLS) and auto-deleted after 1 hour." },
        { q: "What is the file size limit?", a: "Each PDF can be up to 50MB; you can merge up to 20 files at once." },
      ]}
      related={[
        { label: "Split PDF", href: "/pdf/split" },
        { label: "Compress PDF", href: "/pdf/compress" },
        { label: "PDF Tools", href: "/pdf" },
      ]}
    />
  );
}
