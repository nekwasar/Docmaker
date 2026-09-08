import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Audio Converter — MP3, WAV, AAC | Docmaker",
  description: "Convert audio files between MP3, WAV, AAC, FLAC, OGG and M4A for free. Fast, high-quality, no signup, files auto-delete after 1 hour.",
  keywords: ["audio converter", "mp3 converter", "wav to mp3", "audio format converter"],
  openGraph: { title: "Free Audio Converter — Docmaker", description: "Convert audio files between formats for free." },
  alternates: { canonical: "https://docmaker.io/convert/audio" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
