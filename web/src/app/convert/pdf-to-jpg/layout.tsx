import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free PDF to JPG Converter — Convert PDF to Images | Docmaker",
  description: "Convert PDF pages to JPG images for free. Fast, accurate, no limits.",
  keywords: ["pdf to jpg free", "convert pdf to image", "pdf to jpg converter"],
  openGraph: { title: "Free PDF to JPG — Docmaker", description: "Convert PDF to JPG for free.", images: [{ url: "https://docmaker.io/api/og?title=PDF+to+JPG&subtitle=Convert+PDF+to+images+free&icon=convert", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Free PDF to JPG — Docmaker" },
  alternates: { canonical: "https://docmaker.io/convert/pdf-to-jpg" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
