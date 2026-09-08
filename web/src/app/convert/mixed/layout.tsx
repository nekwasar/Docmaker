import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free File Converter — PDF, Images, Video | Docmaker",
  description: "Convert between any format: PDF ↔ Images, Video → Audio, Image → PDF, and more. 38+ format pairs.",
  keywords: ["file converter", "pdf converter", "convert files online", "free converter"],
  openGraph: { title: "Free Cross-Format Converter — Docmaker", description: "Convert between any file format for free." },
  alternates: { canonical: "https://docmaker.io/convert/mixed" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
