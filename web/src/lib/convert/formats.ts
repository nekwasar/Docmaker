// Conversion categories and format definitions

export const CATEGORIES = {
  audio: {
    label: "Audio",
    description: "Convert between MP3, WAV, AAC, FLAC, OGG, M4A",
    icon: "music",
    color: "#FFD140",
    formats: ["mp3", "wav", "aac", "flac", "ogg", "m4a"],
  },
  video: {
    label: "Video",
    description: "Convert between MP4, AVI, MOV, MKV, WEBM",
    icon: "video",
    color: "#0171DF",
    formats: ["mp4", "avi", "mov", "mkv", "webm"],
  },
  image: {
    label: "Image",
    description: "Convert between JPG, PNG, WEBP, GIF, TIFF, BMP",
    icon: "image",
    color: "#3CAE8B",
    formats: ["jpg", "png", "webp", "gif", "tiff", "bmp"],
  },
  file: {
    label: "Document",
    description: "Convert between DOCX, XLSX, CSV, TXT, HTML, MD, EPUB",
    icon: "file",
    color: "#121660",
    formats: ["docx", "xlsx", "csv", "txt", "html", "md", "epub"],
  },
  mixed: {
    label: "Mixed",
    description: "Cross-format conversions (PDF ↔ Images, Video → Audio, etc.)",
    icon: "mixed",
    color: "#0171DF",
    formats: ["pdf", "jpg", "png", "mp3", "mp4", "docx", "html", "txt"],
  },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

// All supported formats with labels
export const FORMAT_LABELS: Record<string, string> = {
  mp3: "MP3",
  wav: "WAV",
  aac: "AAC",
  flac: "FLAC",
  ogg: "OGG",
  m4a: "M4A",
  mp4: "MP4",
  avi: "AVI",
  mov: "MOV",
  mkv: "MKV",
  webm: "WEBM",
  jpg: "JPG",
  jpeg: "JPEG",
  png: "PNG",
  webp: "WEBP",
  gif: "GIF",
  tiff: "TIFF",
  bmp: "BMP",
  pdf: "PDF",
  docx: "DOCX",
  xlsx: "XLSX",
  csv: "CSV",
  txt: "TXT",
  html: "HTML",
  md: "Markdown",
  epub: "EPUB",
};

// Full conversion map from the API
export const CONVERSION_MAP: Record<string, string[]> = {
  docx: ["pdf"],
  doc: ["pdf"],
  odt: ["pdf"],
  rtf: ["pdf"],
  txt: ["pdf", "html", "docx", "epub"],
  xlsx: ["pdf", "csv"],
  xls: ["pdf", "csv"],
  csv: ["pdf", "xlsx"],
  ods: ["pdf"],
  pptx: ["pdf"],
  ppt: ["pdf"],
  odp: ["pdf"],
  key: ["pdf"],
  pdf: ["jpg", "png", "txt", "html", "docx", "epub"],
  jpg: ["pdf", "png", "webp"],
  jpeg: ["pdf", "png", "webp"],
  png: ["pdf", "jpg", "webp"],
  webp: ["pdf", "jpg", "png"],
  gif: ["pdf", "png"],
  tiff: ["pdf", "png"],
  tif: ["pdf", "png"],
  bmp: ["pdf", "png"],
  mp3: ["wav", "aac", "flac", "ogg", "m4a"],
  wav: ["mp3", "aac", "flac", "ogg"],
  aac: ["mp3", "wav", "flac", "ogg"],
  flac: ["mp3", "wav", "aac", "ogg"],
  ogg: ["mp3", "wav", "aac", "flac"],
  m4a: ["mp3", "wav", "aac"],
  mp4: ["mp3", "avi", "mov", "mkv", "webm", "gif"],
  avi: ["mp4", "mp3", "mov", "mkv"],
  mov: ["mp4", "mp3", "avi", "mkv"],
  mkv: ["mp4", "mp3", "avi", "mov"],
  webm: ["mp4", "mp3"],
  md: ["pdf", "html", "docx", "txt", "epub"],
  html: ["pdf", "epub"],
  htm: ["pdf", "epub"],
  epub: ["pdf", "docx", "txt", "html", "md"],
};

// Get compatible target formats for a source format
export function getTargets(sourceFormat: string): string[] {
  return CONVERSION_MAP[sourceFormat.toLowerCase()] || [];
}

// Get all source formats that can convert to a target
export function getSourcesForTarget(targetFormat: string): string[] {
  return Object.entries(CONVERSION_MAP)
    .filter(([, targets]) => targets.includes(targetFormat))
    .map(([source]) => source);
}

// Get format extension from filename
export function getFormatFromFilename(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

// Get MIME type for file input accept attribute
export function getAcceptAttribute(formats: string[]): string {
  return formats.map((f) => `.${f}`).join(",");
}

// Get MIME type for format
export function getMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    mp3: "audio/mpeg",
    wav: "audio/wav",
    aac: "audio/aac",
    flac: "audio/flac",
    ogg: "audio/ogg",
    m4a: "audio/mp4",
    mp4: "video/mp4",
    avi: "video/x-msvideo",
    mov: "video/quicktime",
    mkv: "video/x-matroska",
    webm: "video/webm",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    tiff: "image/tiff",
    bmp: "image/bmp",
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    csv: "text/csv",
    txt: "text/plain",
    html: "text/html",
    md: "text/markdown",
    epub: "application/epub+zip",
  };
  return mimeTypes[format.toLowerCase()] || "application/octet-stream";
}
