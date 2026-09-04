import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Docmaker Help Center — FAQs & Support",
  description: "Find answers to common questions about Docmaker. Get help with PDF tools, AI generation, and more.",
  keywords: ["docmaker help", "docmaker faq", "pdf tools help"],
  openGraph: { title: "Docmaker Help Center", description: "FAQs and support for Docmaker.", images: [{ url: "https://docmaker.io/api/og?title=Help+Center&subtitle=FAQs+%26+support&icon=docmaker", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Docmaker Help Center" },
  alternates: { canonical: "https://docmaker.io/help" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
