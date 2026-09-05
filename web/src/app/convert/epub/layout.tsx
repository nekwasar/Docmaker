import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free EPUB Converter — Convert EPUB to PDF, DOCX Online | Docmaker",
  description: "Convert EPUB ebooks to PDF, DOCX, TXT, HTML, and more for free. Also convert documents to EPUB.",
  keywords: ["epub converter", "epub to pdf", "pdf to epub", "epub to docx"],
  openGraph: { title: "Free EPUB Converter — Docmaker", description: "Convert EPUB ebooks to any format for free." },
  alternates: { canonical: "https://docmaker.io/convert/epub" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
