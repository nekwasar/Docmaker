import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free PDF Split — Extract Pages from PDF | Docmaker",
  description: "Split PDF files by page ranges or intervals. Extract specific pages for free. No limits, no watermarks.",
  keywords: ["split pdf", "extract pages", "pdf splitter", "separate pdf"],
  openGraph: { title: "Free PDF Split — Docmaker", description: "Extract pages from PDF files for free." },
  alternates: { canonical: "https://docmaker.io/pdf/split" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
