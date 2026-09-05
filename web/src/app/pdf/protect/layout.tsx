import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free PDF Protector — Password Protect PDF | Docmaker",
  description: "Add password protection to PDF files. Set permissions for printing, copying, and editing. Free, no limits.",
  keywords: ["protect pdf", "password protect", "pdf security", "lock pdf"],
  openGraph: { title: "Free PDF Protector — Docmaker", description: "Password protect PDF files for free." },
  alternates: { canonical: "https://docmaker.io/pdf/protect" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
