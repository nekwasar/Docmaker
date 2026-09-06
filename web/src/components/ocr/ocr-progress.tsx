"use client";

import { Loader2, Globe } from "lucide-react";

interface OCRProgressProps {
  isProcessing: boolean;
  progress: number;
  currentStep: string;
  currentPage?: number;
  totalPages?: number;
}

export function OCRProgress({
  isProcessing,
  progress,
  currentStep,
  currentPage,
  totalPages,
}: OCRProgressProps) {
  return (
    <div className="space-y-4">
      {/* Auto-detect notice */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 text-blue-700 text-sm">
        <Globe className="h-4 w-4 flex-shrink-0" />
        <span>Language is auto-detected. Supports English, German, Japanese, Korean, Chinese, Spanish, Italian, Portuguese, French, Dutch.</span>
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
