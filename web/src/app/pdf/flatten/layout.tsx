import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free PDF Flattener — Flatten PDF Forms | Docmaker",
  description: "Flatten PDF files to make form fields non-editable. Merge interactive elements into page content. Free, no limits.",
  keywords: ["flatten pdf", "pdf flattener", "make pdf non-editable", "freeze pdf"],
  openGraph: { title: "Free PDF Flattener — Docmaker", description: "Flatten PDF form fields for free." },
  alternates: { canonical: "https://docmaker.io/pdf/flatten" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
