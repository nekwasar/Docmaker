import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free PDF Page Numbers — Add Page Numbers to PDF | Docmaker",
  description: "Add page numbers to PDF files online. Choose position and number format. Auto-numbers all pages, centered and clean. Free, no signup.",
  keywords: ["pdf page numbers", "add page numbers", "number pdf pages", "page numbering"],
  openGraph: { title: "Free PDF Page Numbers — Docmaker", description: "Add page numbers to PDF files for free." },
  alternates: { canonical: "https://docmaker.io/pdf/page-numbers" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
