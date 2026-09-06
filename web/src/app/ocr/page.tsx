"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { Brand } from "@/config/site";
import { OCRUpload } from "@/components/ocr/ocr-upload";
import { OCRProgress } from "@/components/ocr/ocr-progress";
import { OCRResults } from "@/components/ocr/ocr-results";
import { extractTextFromImage, extractTextFromPDF } from "@/lib/ocr-engine";
import type { PageResult } from "@/lib/ocr-engine";

export default function OCRPage() {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("eng");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [pages, setPages] = useState<PageResult[]>([]);
  const [fullText, setFullText] = useState("");
  const [averageConfidence, setAverageConfidence] = useState(0);
  const [error, setError] = useState("");

  const handleExtract = async () => {
    if (!file) return;

    setProcessing(true);
    setProgress(0);
    setError("");
    setPages([]);
    setFullText("");
    setAverageConfidence(0);

    try {
      const isPDF = file.name.toLowerCase().endsWith(".pdf");

      if (isPDF) {
        setCurrentStep("Loading PDF...");
        setProgress(5);

        const result = await extractTextFromPDF(file, language, (prog, page, total) => {
          setProgress(prog);
          setCurrentPage(page);
          setTotalPages(total);
          if (page > 0) {
            setCurrentStep(`Processing page ${page} of ${total}...`);
          }
        });

        setPages(result.pages);
        setFullText(result.fullText);
        setAverageConfidence(result.averageConfidence);
      } else {
        setCurrentStep("Loading language model...");
        setProgress(10);

        const result = await extractTextFromImage(file, language, (prog) => {
          setProgress(prog);
          if (prog < 30) {
            setCurrentStep("Loading language model...");
          } else if (prog < 90) {
            setCurrentStep("Recognizing text...");
          } else {
            setCurrentStep("Finalizing...");
          }
        });

        setPages([
          {
            pageNumber: 1,
            text: result.text,
            confidence: result.confidence,
            words: result.words,
          },
        ]);
        setFullText(result.text);
        setAverageConfidence(result.confidence);
      }
    } catch (err: any) {
      setError(err.message || "OCR processing failed. Please try again.");
    } finally {
      setProcessing(false);
      setProgress(0);
      setCurrentStep("");
    }
  };

  return (
    <ToolPageLayout title="Extract Text (OCR)" color="yellow">
      <div className="space-y-6">
        <p className="text-lg text-slate-600">
          Extract text from images, scanned documents, and PDFs using AI-powered OCR.
        </p>

        {/* Upload */}
        <OCRUpload
          selectedFile={file}
          onFileSelect={(f) => { setFile(f); setPages([]); setFullText(""); setError(""); }}
          onClear={() => { setFile(null); setPages([]); setFullText(""); setError(""); }}
        />

        {/* Language & Progress */}
        <OCRProgress
          isProcessing={processing}
          progress={progress}
          currentStep={currentStep}
          currentPage={currentPage}
          totalPages={totalPages}
          selectedLanguage={language}
          onLanguageChange={setLanguage}
        />

        {/* Error */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
        )}

        {/* Extract Button */}
        <button
          onClick={handleExtract}
          disabled={!file || processing}
          className="w-full flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
          style={{ backgroundColor: Brand.yellow, color: "#0F172A" }}
        >
          {processing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Extracting...
            </>
          ) : (
            "Extract Text"
          )}
        </button>

        {/* Results */}
        {fullText && (
          <OCRResults pages={pages} fullText={fullText} averageConfidence={averageConfidence} />
        )}
      </div>
    </ToolPageLayout>
  );
}
