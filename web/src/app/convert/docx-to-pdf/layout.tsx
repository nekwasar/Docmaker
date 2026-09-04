import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Word to PDF Converter — Convert DOCX to PDF | Docmaker",
  description: "Convert Word documents to PDF format for free. Fast, accurate, no limits.",
  keywords: ["word to pdf free", "convert docx to pdf", "word to pdf converter"],
  openGraph: { title: "Free Word to PDF — Docmaker", description: "Convert Word to PDF for free.", images: [{ url: "https://docmaker.io/api/og?title=Word+to+PDF&subtitle=Convert+DOCX+to+PDF+free&icon=convert", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Free Word to PDF — Docmaker" },
  alternates: { canonical: "https://docmaker.io/convert/docx-to-pdf" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
