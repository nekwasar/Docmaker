import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Compress PDF — Reduce File Size Without Quality Loss | Docmaker",
  description: "Compress PDF files to reduce size while maintaining quality. Free online PDF compression with no limits.",
  keywords: ["compress pdf free", "reduce pdf size", "pdf compression online", "shrink pdf"],
  openGraph: { title: "Free Compress PDF — Docmaker", description: "Compress PDF files for free. No limits, no watermarks.", images: [{ url: "https://docmaker.io/api/og?title=Compress+PDF&subtitle=Reduce+file+size+free&icon=compress", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Free Compress PDF — Docmaker" },
  alternates: { canonical: "https://docmaker.io/compress-pdf" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
