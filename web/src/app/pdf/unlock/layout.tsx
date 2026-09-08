import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free PDF Unlocker — Remove PDF Password | Docmaker",
  description: "Remove password protection from PDF files instantly. Enter the password to unlock and save an unlocked copy. Free, secure, no signup.",
  keywords: ["unlock pdf", "remove pdf password", "pdf unlocker", "open locked pdf"],
  openGraph: { title: "Free PDF Unlocker — Docmaker", description: "Remove PDF password protection for free." },
  alternates: { canonical: "https://docmaker.io/pdf/unlock" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
