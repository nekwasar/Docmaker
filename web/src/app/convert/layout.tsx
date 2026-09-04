import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free File Converter — 200+ Format Pairs | Docmaker",
  description: "Convert between 200+ file formats for free. PDF, Word, Excel, images, and more. No limits.",
  keywords: ["free file converter", "convert pdf to word", "convert image to pdf", "200 format converter"],
  openGraph: { title: "Free File Converter — Docmaker", description: "Convert between 200+ formats for free.", images: [{ url: "https://docmaker.io/api/og?title=File+Converter&subtitle=200%2B+formats+free&icon=convert", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Free File Converter — Docmaker" },
  alternates: { canonical: "https://docmaker.io/convert" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
