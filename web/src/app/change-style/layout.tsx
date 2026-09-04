import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Document Style Changer — AI Restyle Documents | Docmaker",
  description: "Restyle any document with AI. Change from professional to creative in seconds. Free.",
  keywords: ["change document style", "restyle document", "ai style changer"],
  openGraph: { title: "Free Document Style Changer — Docmaker", description: "Restyle documents with AI for free.", images: [{ url: "https://docmaker.io/api/og?title=Change+Style&subtitle=Restyle+documents+free&icon=docmaker", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Free Document Style Changer — Docmaker" },
  alternates: { canonical: "https://docmaker.io/change-style" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
