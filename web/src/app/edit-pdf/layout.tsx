import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free PDF Editor — Add Text, Images, Annotations | Docmaker",
  description: "Edit PDF documents online for free. Add text, images, shapes, and annotations. No watermarks, no sign-up.",
  keywords: ["pdf editor free", "edit pdf online", "pdf annotation", "add text to pdf"],
  openGraph: { title: "Free PDF Editor — Docmaker", description: "Edit PDF documents online for free. No watermarks, no sign-up.", images: [{ url: "https://docmaker.io/api/og?title=PDF+Editor&subtitle=Edit+PDFs+free&icon=edit", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Free PDF Editor — Docmaker" },
  alternates: { canonical: "https://docmaker.io/edit-pdf" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
