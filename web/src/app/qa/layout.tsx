import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free AI Document Q&A — Ask Questions About Your Docs | Docmaker",
  description: "Upload a document and ask questions about it. AI-powered answers in seconds. Free, no account required.",
  keywords: ["ai document q&a", "ask questions about pdf", "document ai chat free"],
  openGraph: { title: "Free AI Document Q&A — Docmaker", description: "Ask questions about your documents with AI. Free.", images: [{ url: "https://docmaker.io/api/og?title=AI+Document+Q%26A&subtitle=Ask+questions+about+docs&icon=docmaker", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Free AI Document Q&A — Docmaker" },
  alternates: { canonical: "https://docmaker.io/qa" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
