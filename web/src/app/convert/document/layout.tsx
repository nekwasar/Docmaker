import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Document Converter — DOCX, CSV, TXT | Docmaker",
  description: "Convert documents between DOCX, XLSX, CSV, TXT, HTML, Markdown, EPUB for free.",
  keywords: ["document converter", "docx converter", "csv to xlsx", "text converter"],
  openGraph: { title: "Free Document Converter — Docmaker", description: "Convert documents between formats for free." },
  alternates: { canonical: "https://docmaker.io/convert/document" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
