import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Video Converter — Convert MP4, AVI, MOV Online | Docmaker",
  description: "Convert video files between MP4, AVI, MOV, MKV, and more for free. Fast, no limits.",
  keywords: ["video converter", "mp4 to avi", "video format converter"],
  openGraph: { title: "Free Video Converter — Docmaker", description: "Convert video files between formats for free." },
  alternates: { canonical: "https://docmaker.io/convert/video" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
