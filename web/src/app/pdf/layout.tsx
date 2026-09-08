import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free PDF Tools — Merge, Split, Compress & More | Docmaker",
  description: "10 free PDF tools in one place. Merge, split, compress, rotate, protect, and convert PDFs online. No signup, files auto-delete. Fast and secure.",
  keywords: ["free pdf tools", "merge pdf", "split pdf", "compress pdf", "pdf tools online"],
  openGraph: {
    title: "Free PDF Tools — Merge, Split, Compress & More | Docmaker",
    description: "10 free PDF tools. Merge, split, compress and protect PDFs online for free.",
    url: "https://docmaker.io/pdf",
    siteName: "Docmaker",
    type: "website",
    locale: "en_US",
    images: [{ url: "https://docmaker.io/api/og?title=PDF+Tools&subtitle=Merge,+Split,+Compress+%26+More", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Tools — Docmaker",
    description: "10 free PDF tools for every task.",
    images: ["https://docmaker.io/api/og?title=PDF+Tools&subtitle=Merge,+Split,+Compress+%26+More"],
  },
  alternates: { canonical: "https://docmaker.io/pdf" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
