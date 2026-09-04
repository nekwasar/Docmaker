import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Docmaker API Documentation — RESTful Endpoints",
  description: "Complete API documentation for Docmaker. RESTful endpoints for document generation, conversion, and processing.",
  keywords: ["docmaker api", "document api", "pdf api", "document generation api"],
  openGraph: { title: "Docmaker API Documentation", description: "RESTful API for document processing.", images: [{ url: "https://docmaker.io/api/og?title=API+Documentation&subtitle=RESTful+endpoints+for+document+processing&icon=docmaker", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Docmaker API Documentation" },
  alternates: { canonical: "https://docmaker.io/api-docs" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
