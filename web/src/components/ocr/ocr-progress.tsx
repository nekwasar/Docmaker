"use client";

import { Loader2, Globe } from "lucide-react";
import { OCR_LANGUAGES } from "@/lib/ocr-engine";

interface OCRProgressProps {
  isProcessing: boolean;
  progress: number;
  currentStep: string;
  currentPage?: number;
  totalPages?: number;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export function OCRProgress({
  isProcessing,
  progress,
  currentStep,
  currentPage,
  totalPages,
  selectedLanguage,
  onLanguageChange,
}: OCRProgressProps) {
  return (
    <div className="space-y-4">
      {/* Language Selector */}
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
          <Globe className="h-4 w-4" /> Language
        </label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(OCR_LANGUAGES).map(([code, lang]) => (
            <button
              key={code}
              onClick={() => onLanguageChange(code)}
              disabled={isProcessing}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedLanguage === code
                  ? "bg-[#FFD140] text-[#0F172A]"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              } disabled:opacity-50`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {currentStep}
            </span>
            <span className="text-slate-500">{progress}%</span>
          </div>
          {totalPages && totalPages > 1 && currentPage && (
            <p className="text-xs text-slate-400">
              Page {currentPage} of {totalPages}
            </p>
          )}
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FFD140] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
