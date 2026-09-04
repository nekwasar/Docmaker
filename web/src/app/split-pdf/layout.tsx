import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Split PDF — Separate PDF Pages Online | Docmaker",
  description: "Split PDF files into individual pages or custom ranges. Free, fast, and secure. No account required.",
  keywords: ["split pdf free", "separate pdf pages", "pdf split online", "extract pdf pages"],
  openGraph: { title: "Free Split PDF — Docmaker", description: "Split PDF files into individual pages for free.", images: [{ url: "https://docmaker.io/api/og?title=Split+PDF&subtitle=Separate+PDF+pages+free&icon=split", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Free Split PDF — Docmaker" },
  alternates: { canonical: "https://docmaker.io/split-pdf" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
