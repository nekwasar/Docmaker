import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free PDF Watermark — Add Watermarks to PDFs | Docmaker",
  description: "Add watermarks to your PDF pages for free. Custom text, no limits.",
  keywords: ["add watermark pdf", "pdf watermark free", "watermark tool"],
  openGraph: { title: "Free PDF Watermark — Docmaker", description: "Add watermarks to PDF pages for free.", images: [{ url: "https://docmaker.io/api/og?title=Watermark+PDF&subtitle=Add+watermarks+free&icon=watermark", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Free PDF Watermark — Docmaker" },
  alternates: { canonical: "https://docmaker.io/watermark" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
