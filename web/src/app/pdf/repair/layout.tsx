import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free PDF Repair — Fix Corrupted PDF Files | Docmaker",
  description: "Repair corrupted or damaged PDF files. Re-process to fix issues. Free, no limits.",
  keywords: ["repair pdf", "fix pdf", "pdf repair", "corrupted pdf", "damaged pdf"],
  openGraph: { title: "Free PDF Repair — Docmaker", description: "Fix corrupted PDF files for free." },
  alternates: { canonical: "https://docmaker.io/pdf/repair" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
