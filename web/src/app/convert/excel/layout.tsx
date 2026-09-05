import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Excel Converter — Convert CSV, XLSX Online | Docmaker",
  description: "Convert CSV to XLSX, XLSX to CSV, and JSON to XLSX for free. Fast, no limits.",
  keywords: ["csv to xlsx", "xlsx to csv", "excel converter", "json to xlsx"],
  openGraph: { title: "Free Excel Converter — Docmaker", description: "Convert CSV and Excel files for free." },
  alternates: { canonical: "https://docmaker.io/convert/excel" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
