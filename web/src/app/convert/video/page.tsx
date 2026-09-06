"use client";

import { ConverterPage } from "@/components/convert/converter-page";

export default function VideoConvertPage() {
  return (
    <ConverterPage
      title="Convert Video"
      description="Convert video files between MP4, AVI, MOV, MKV, WEBM. Also extract audio."
      formats={["mp4", "avi", "mov", "mkv", "webm"]}
    />
  );
}
