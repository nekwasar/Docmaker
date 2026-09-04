import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Docmaker Privacy Policy — How We Handle Your Data",
  description: "Learn how Docmaker collects, uses, and protects your information. Your privacy is our priority.",
  keywords: ["docmaker privacy", "privacy policy", "data protection"],
  openGraph: { title: "Docmaker Privacy Policy", description: "How we handle your data.", images: [{ url: "https://docmaker.io/api/og?title=Privacy+Policy&subtitle=How+we+handle+your+data&icon=docmaker", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Docmaker Privacy Policy" },
  alternates: { canonical: "https://docmaker.io/privacy" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
