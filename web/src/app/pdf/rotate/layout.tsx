import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free PDF Rotator — Rotate PDF Pages Online | Docmaker",
  description: "Rotate PDF pages by 90°, 180°, or 270°. Select specific pages or rotate all. Free, no limits.",
  keywords: ["rotate pdf", "pdf rotator", "turn pdf", "flip pdf"],
  openGraph: { title: "Free PDF Rotator — Docmaker", description: "Rotate PDF pages for free." },
  alternates: { canonical: "https://docmaker.io/pdf/rotate" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
