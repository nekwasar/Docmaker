import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Merge PDF — Combine Multiple PDFs Online | Docmaker",
  description: "Merge multiple PDF files into one document for free. No limits, no watermarks, no sign-up required. Fast and secure PDF merging.",
  keywords: ["merge pdf free", "combine pdf", "pdf merge online", "merge multiple pdf", "pdf combiner free"],
  openGraph: {
    title: "Free Merge PDF — Combine Multiple PDFs | Docmaker",
    description: "Merge multiple PDF files into one for free. No limits, no watermarks.",
    images: [{ url: "https://docmaker.io/api/og?title=Merge+PDF&subtitle=Combine+multiple+PDFs+free&icon=merge", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Free Merge PDF — Docmaker" },
  alternates: { canonical: "https://docmaker.io/merge-pdf" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
