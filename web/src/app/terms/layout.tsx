import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Docmaker Terms of Service — Usage Terms",
  description: "Read the terms and conditions for using Docmaker's document processing platform.",
  keywords: ["docmaker terms", "terms of service", "usage terms"],
  openGraph: { title: "Docmaker Terms of Service", description: "Usage terms and conditions.", images: [{ url: "https://docmaker.io/api/og?title=Terms+of+Service&subtitle=Usage+terms&icon=docmaker", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Docmaker Terms of Service" },
  alternates: { canonical: "https://docmaker.io/terms" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
