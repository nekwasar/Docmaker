import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free JPG to PDF Converter — Convert Images to PDF | Docmaker",
  description: "Convert JPG images to PDF documents for free. Fast, accurate, no limits.",
  keywords: ["jpg to pdf free", "convert image to pdf", "jpg to pdf converter", "photo to pdf"],
  openGraph: { title: "Free JPG to PDF — Docmaker", description: "Convert JPG to PDF for free.", images: [{ url: "https://docmaker.io/api/og?title=JPG+to+PDF&subtitle=Convert+images+to+PDF+free&icon=convert", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Free JPG to PDF — Docmaker" },
  alternates: { canonical: "https://docmaker.io/convert/jpg-to-pdf" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
