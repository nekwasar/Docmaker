import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Docmaker Blog — Tips, Guides & Insights",
  description: "Read tips, guides, and insights about document processing, PDF tools, and AI document generation.",
  keywords: ["docmaker blog", "pdf tips", "document guides"],
  openGraph: { title: "Docmaker Blog", description: "Tips, guides, and insights about document processing.", images: [{ url: "https://docmaker.io/api/og?title=Blog&subtitle=Tips+%26+guides&icon=docmaker", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Docmaker Blog" },
  alternates: { canonical: "https://docmaker.io/blog" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
