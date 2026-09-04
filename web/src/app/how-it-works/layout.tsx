import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "How Docmaker Works — Step-by-Step Guide",
  description: "Learn how to use Docmaker in 3 simple steps. No account required, start processing documents immediately.",
  keywords: ["how to use docmaker", "docmaker tutorial", "document tool guide"],
  openGraph: { title: "How Docmaker Works", description: "3 simple steps to process any document.", images: [{ url: "https://docmaker.io/api/og?title=How+It+Works&subtitle=3+simple+steps&icon=docmaker", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "How Docmaker Works" },
  alternates: { canonical: "https://docmaker.io/how-it-works" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
