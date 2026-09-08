import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free PDF to PDF/A — Convert to Archival Format | Docmaker",
  description: "Convert PDF to PDF/A archival standard for long-term preservation. Supports PDF/A-1b, 2b and 3b. Free, fast, no signup, instant download.",
  keywords: ["pdf to pdfa", "pdf/a converter", "archival pdf", "pdf/a-1b", "pdf/a-2b"],
  openGraph: { title: "Free PDF to PDF/A — Docmaker", description: "Convert PDF to PDF/A archival format for free." },
  alternates: { canonical: "https://docmaker.io/pdf/pdfa" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
