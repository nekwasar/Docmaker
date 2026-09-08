import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free PDF Merge — Combine Multiple PDFs Online | Docmaker",
  description: "Merge multiple PDF files into one document for free. Drag, reorder and combine up to 20 PDFs. No signup, files auto-delete after 1 hour. Fast and secure.",
  keywords: ["merge pdf", "combine pdf", "join pdf", "pdf merger"],
  openGraph: { title: "Free PDF Merge — Docmaker", description: "Combine multiple PDF files into one for free." },
  alternates: { canonical: "https://docmaker.io/pdf/merge" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
