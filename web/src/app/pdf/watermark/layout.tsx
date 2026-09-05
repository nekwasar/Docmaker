import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free PDF Watermark — Add Text Watermark to PDF | Docmaker",
  description: "Add text watermarks to PDF files online. Customize font, opacity, rotation. Free, no limits.",
  keywords: ["pdf watermark", "add watermark", "watermark pdf", "stamp pdf"],
  openGraph: { title: "Free PDF Watermark — Docmaker", description: "Add text watermarks to PDF files for free." },
  alternates: { canonical: "https://docmaker.io/pdf/watermark" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
