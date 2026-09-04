import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Document Generator — Create Professional Documents | Docmaker",
  description: "Generate professional documents from text prompts using AI. Create invoices, reports, contracts, resumes, and more in seconds. Free, no account required.",
  keywords: ["ai document generator free", "create document from text", "ai writing tool", "free document creator", "professional documents ai"],
  openGraph: {
    title: "Free AI Document Generator — Docmaker",
    description: "Create professional documents from text prompts using AI. Free, no account required.",
    images: [{ url: "https://docmaker.io/api/og?title=AI+Document+Generator&subtitle=Create+professional+documents+free&icon=generate", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Free AI Document Generator — Docmaker" },
  alternates: { canonical: "https://docmaker.io/generate" },
};

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
