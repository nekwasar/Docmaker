import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Video Converter — MP4, AVI, MOV | Docmaker",
  description: "Convert video files between MP4, AVI, MOV, MKV and WEBM for free. Fast, high-quality, no signup, files auto-delete after 1 hour.",
  keywords: ["video converter", "mp4 converter", "avi to mp4", "video format converter"],
  openGraph: { title: "Free Video Converter — Docmaker", description: "Convert video files between formats for free." },
  alternates: { canonical: "https://docmaker.io/convert/video" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
