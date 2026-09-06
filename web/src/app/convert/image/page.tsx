"use client";

import { ConverterPage } from "@/components/convert/converter-page";

export default function ImageConvertPage() {
  return (
    <ConverterPage
      title="Convert Images"
      description="Convert images between JPG, PNG, WEBP, GIF, TIFF, BMP."
      formats={["jpg", "png", "webp", "gif", "tiff", "bmp"]}
    />
  );
}
