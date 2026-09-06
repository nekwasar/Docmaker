import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Audio Converter — Convert MP3, WAV, AAC Online | Docmaker",
  description: "Convert audio files between MP3, WAV, AAC, FLAC, OGG, M4A for free. Fast, no limits.",
  keywords: ["audio converter", "mp3 converter", "wav to mp3", "audio format converter"],
  openGraph: { title: "Free Audio Converter — Docmaker", description: "Convert audio files between formats for free." },
  alternates: { canonical: "https://docmaker.io/convert/audio" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
