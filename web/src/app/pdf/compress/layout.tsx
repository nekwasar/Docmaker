import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free PDF Compressor — Reduce PDF File Size | Docmaker",
  description: "Compress PDF files to reduce file size. Choose quality level. Free, fast, no limits.",
  keywords: ["compress pdf", "reduce pdf size", "pdf compressor", "shrink pdf"],
  openGraph: { title: "Free PDF Compressor — Docmaker", description: "Reduce PDF file size for free." },
  alternates: { canonical: "https://docmaker.io/pdf/compress" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
