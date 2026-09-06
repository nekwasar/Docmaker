"use client";

import { ConverterPage } from "@/components/convert/converter-page";

export default function FileConvertPage() {
  return (
    <ConverterPage
      title="Convert Documents"
      description="Convert between DOCX, XLSX, CSV, TXT, HTML, Markdown, and EPUB."
      formats={["docx", "xlsx", "csv", "txt", "html", "md", "epub"]}
    />
  );
}
