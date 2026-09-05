import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free PDF Stamp — Add Text Stamp to PDF | Docmaker",
  description: "Add text stamps to PDF files online. Mark documents as DRAFT, APPROVED, or custom text. Free, no limits.",
  keywords: ["pdf stamp", "stamp pdf", "add stamp", "mark pdf"],
  openGraph: { title: "Free PDF Stamp — Docmaker", description: "Add text stamps to PDF files for free." },
  alternates: { canonical: "https://docmaker.io/pdf/stamp" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
