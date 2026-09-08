import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Image Converter — JPG, PNG, WEBP | Docmaker",
  description: "Convert images between JPG, PNG, WEBP, GIF, TIFF and BMP for free. Fast, high-quality, no signup, files auto-delete after 1 hour.",
  keywords: ["image converter", "jpg to png", "png to jpg", "webp converter"],
  openGraph: { title: "Free Image Converter — Docmaker", description: "Convert images between formats for free." },
  alternates: { canonical: "https://docmaker.io/convert/image" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
