import Tesseract from "tesseract.js";

export interface OCRResult {
  text: string;
  confidence: number;
  words: number;
  lines: number;
}

export interface PageResult {
  pageNumber: number;
  text: string;
  confidence: number;
  words: number;
}

export interface PDFOCRResult {
  pages: PageResult[];
  fullText: string;
  totalPages: number;
  averageConfidence: number;
}

// Language code mapping for Tesseract.js
export const OCR_LANGUAGES: Record<string, { code: string; name: string }> = {
  eng: { code: "eng", name: "English" },
  deu: { code: "deu", name: "Deutsch" },
  jpn: { code: "jpn", name: "Japanese" },
  kor: { code: "kor", name: "Korean" },
  chi_sim: { code: "chi_sim", name: "Chinese (Simplified)" },
  chi_tra: { code: "chi_tra", name: "Chinese (Traditional)" },
  spa: { code: "spa", name: "Spanish" },
  ita: { code: "ita", name: "Italian" },
  por: { code: "por", name: "Portuguese" },
  fra: { code: "fra", name: "French" },
  nld: { code: "nld", name: "Dutch" },
};

/**
 * Extract text from an image using Tesseract.js
 */
export async function extractTextFromImage(
  file: File,
  language: string = "eng",
  onProgress?: (progress: number) => void
): Promise<OCRResult> {
  onProgress?.(10);

  const worker = await Tesseract.createWorker(language, 1, {
    logger: (m) => {
      if (m.status === "recognizing text" && m.progress) {
        onProgress?.(10 + Math.round(m.progress * 80));
      }
    },
  });

  try {
    const { data } = await worker.recognize(file);

    onProgress?.(100);

    return {
      text: data.text,
      confidence: Math.round(data.confidence),
      words: data.words.length,
      lines: data.lines.length,
    };
  } finally {
    await worker.terminate();
  }
}

/**
 * Extract text from a PDF using pdfjs-dist + Tesseract.js
 */
export async function extractTextFromPDF(
  file: File,
  language: string = "eng",
  onProgress?: (progress: number, page: number, totalPages: number) => void
): Promise<PDFOCRResult> {
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "";

  onProgress?.(5, 0, 0);

  const arrayBuffer = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const totalPages = doc.numPages;
  const pages: PageResult[] = [];

  // Create worker
  const worker = await Tesseract.createWorker(language, 1, {
    logger: (m) => {
      if (m.status === "recognizing text" && m.progress) {
        const pageProgress = 5 + ((currentPage - 1) / totalPages) * 90 + m.progress * (90 / totalPages);
        onProgress?.(Math.round(pageProgress), currentPage, totalPages);
      }
    },
  });

  let currentPage = 0;

  try {
    for (let i = 1; i <= totalPages; i++) {
      currentPage = i;
      onProgress?.(5 + Math.round(((i - 1) / totalPages) * 90), i, totalPages);

      // Render page to canvas
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 }); // 2x for better OCR

      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;

      await page.render({ canvasContext: ctx, viewport }).promise;

      // OCR the canvas
      const { data } = await worker.recognize(canvas);

      pages.push({
        pageNumber: i,
        text: data.text,
        confidence: Math.round(data.confidence),
        words: data.words.length,
      });
    }

    onProgress?.(100, totalPages, totalPages);

    const fullText = pages.map((p) => p.text).join("\n\n");
    const averageConfidence = Math.round(
      pages.reduce((sum, p) => sum + p.confidence, 0) / pages.length
    );

    return { pages, fullText, totalPages, averageConfidence };
  } finally {
    await worker.terminate();
  }
}
