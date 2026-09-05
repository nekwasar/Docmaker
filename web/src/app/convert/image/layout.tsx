import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Image Converter — Convert JPG, PNG, WEBP Online | Docmaker",
  description: "Convert images between JPG, PNG, WEBP, GIF, TIFF, and more for free. Fast, no limits.",
  keywords: ["image converter", "jpg to png", "png to jpg", "webp converter"],
  openGraph: { title: "Free Image Converter — Docmaker", description: "Convert images between formats for free." },
  alternates: { canonical: "https://docmaker.io/convert/image" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
