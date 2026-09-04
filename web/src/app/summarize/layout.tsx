import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Document Summarizer — AI Summarize Any Document | Docmaker",
  description: "Summarize long documents instantly with AI. Free, no limits, no account required.",
  keywords: ["summarize document free", "ai summarizer", "document summary tool"],
  openGraph: { title: "Free Document Summarizer — Docmaker", description: "Summarize documents with AI for free.", images: [{ url: "https://docmaker.io/api/og?title=Summarize&subtitle=AI+summarize+documents+free&icon=docmaker", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Free Document Summarizer — Docmaker" },
  alternates: { canonical: "https://docmaker.io/summarize" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
