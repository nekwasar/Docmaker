import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free PDF to Word Converter — Convert PDF to DOCX | Docmaker",
  description: "Convert PDF documents to editable Word files for free. Fast, accurate, no limits.",
  keywords: ["pdf to word free", "convert pdf to docx", "pdf to word converter", "pdf to editable"],
  openGraph: { title: "Free PDF to Word — Docmaker", description: "Convert PDF to Word for free.", images: [{ url: "https://docmaker.io/api/og?title=PDF+to+Word&subtitle=Convert+PDF+to+DOCX+free&icon=convert", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Free PDF to Word — Docmaker" },
  alternates: { canonical: "https://docmaker.io/convert/pdf-to-docx" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
