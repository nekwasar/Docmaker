import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "About Docmaker — Our Mission & Story",
  description: "Docmaker makes document tasks effortless, free, and high-quality for everyone. Learn about our mission and team.",
  keywords: ["about docmaker", "docmaker team", "document platform"],
  openGraph: { title: "About Docmaker", description: "Making document tasks effortless, free, and high-quality.", images: [{ url: "https://docmaker.io/api/og?title=About+Docmaker&subtitle=Our+mission+%26+story&icon=docmaker", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "About Docmaker" },
  alternates: { canonical: "https://docmaker.io/about" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
