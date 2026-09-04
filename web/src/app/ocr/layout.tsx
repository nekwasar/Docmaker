import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free OCR — Extract Text from Images & PDFs | Docmaker",
  description: "Extract text from images, scanned PDFs, and documents using OCR. Free, no limits.",
  keywords: ["ocr free", "extract text from image", "pdf ocr", "text recognition free"],
  openGraph: { title: "Free OCR — Docmaker", description: "Extract text from images and PDFs for free.", images: [{ url: "https://docmaker.io/api/og?title=OCR&subtitle=Extract+text+free&icon=ocr", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Free OCR — Docmaker" },
  alternates: { canonical: "https://docmaker.io/ocr" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
