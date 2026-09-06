"use client";

import { ConverterPage } from "@/components/convert/converter-page";

export default function AudioConvertPage() {
  return (
    <ConverterPage
      title="Convert Audio"
      description="Convert audio files between MP3, WAV, AAC, FLAC, OGG, and M4A."
      formats={["mp3", "wav", "aac", "flac", "ogg", "m4a"]}
    />
  );
}
