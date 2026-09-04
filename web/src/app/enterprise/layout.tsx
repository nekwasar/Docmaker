import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Docmaker Enterprise — API, Batch Processing, Team Collaboration",
  description: "Enterprise document processing with API access, batch processing, team collaboration, and admin dashboard. $49/month.",
  keywords: ["enterprise document api", "batch processing", "document automation", "team collaboration"],
  openGraph: { title: "Docmaker Enterprise", description: "API, batch processing, team collaboration. $49/month.", images: [{ url: "https://docmaker.io/api/og?title=Enterprise&subtitle=API%2C+batch+processing%2C+teams&icon=enterprise", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Docmaker Enterprise" },
  alternates: { canonical: "https://docmaker.io/enterprise" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
