import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free PDF Merge — Combine Multiple PDFs Online | Docmaker",
  description: "Merge multiple PDF files into one document for free. Drag and drop to reorder. No limits, no watermarks.",
  keywords: ["merge pdf", "combine pdf", "join pdf", "pdf merger"],
  openGraph: { title: "Free PDF Merge — Docmaker", description: "Combine multiple PDF files into one for free." },
  alternates: { canonical: "https://docmaker.io/pdf/merge" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
