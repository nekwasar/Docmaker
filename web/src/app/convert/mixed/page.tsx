"use client";

import { ConverterPage } from "@/components/convert/converter-page";

export default function MixedConvertPage() {
  return (
    <ConverterPage
      title="Convert Files"
      description="Convert between any format — PDF, images, documents, audio, video. 38+ format pairs supported."
      formats={["pdf", "jpg", "png", "webp", "gif", "mp3", "wav", "mp4", "avi", "docx", "xlsx", "csv", "txt", "html", "md", "epub"]}
    />
  );
}
