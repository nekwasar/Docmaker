"use client";

import { useState } from "react";
import {
  Copy, Check, Download, FileText, FileImage, Code, FileCode,
  ChevronDown, ChevronUp, BarChart3,
} from "lucide-react";
import { copyToClipboard, exportAsTXT, exportAsDOCX, exportAsPDF, exportAsHTML, exportAsMarkdown } from "@/lib/ocr-export";
import type { PageResult } from "@/lib/ocr-engine";

interface OCRResultsProps {
  pages: PageResult[];
  fullText: string;
  averageConfidence: number;
}

export function OCRResults({ pages, fullText, averageConfidence }: OCRResultsProps) {
  const [copied, setCopied] = useState(false);
  const [activePage, setActivePage] = useState<number | "all">("all");
  const [showExports, setShowExports] = useState(false);

  const displayText = activePage === "all" ? fullText : pages.find((p) => p.pageNumber === activePage)?.text || "";

  const handleCopy = async () => {
    const success = await copyToClipboard(displayText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const exportFilename = activePage === "all" ? "ocr-extracted-text" : `ocr-page-${activePage}`;

  return (
    <div className="space-y-4">
      {/* Confidence Score */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
        <BarChart3 className="h-5 w-5 text-slate-500" />
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-900">
            {averageConfidence}% confidence
          </p>
          <p className="text-xs text-slate-500">
            {pages.length > 1 ? `${pages.length} pages` : "1 page"} • {fullText.split(/\s+/).length} words
          </p>
        </div>
      </div>

      {/* Page Tabs (multi-page only) */}
      {pages.length > 1 && (
        <div className="flex gap-1 overflow-x-auto pb-1">
          <button
            onClick={() => setActivePage("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activePage === "all"
                ? "bg-[#FFD140] text-[#0F172A]"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Pages
          </button>
          {pages.map((page) => (
            <button
              key={page.pageNumber}
              onClick={() => setActivePage(page.pageNumber)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activePage === page.pageNumber
                  ? "bg-[#FFD140] text-[#0F172A]"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Page {page.pageNumber}
              <span className="ml-1 opacity-60">({page.confidence}%)</span>
            </button>
          ))}
        </div>
      )}

      {/* Text Display */}
      <div className="relative rounded-2xl bg-white border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-900">Extracted Text</h3>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-[#FFD140] transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
            {displayText || "No text extracted"}
          </pre>
        </div>
      </div>

      {/* Export Buttons */}
      <div>
        <button
          onClick={() => setShowExports(!showExports)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#FFD140] transition-colors"
        >
          <Download className="h-4 w-4" />
          Export as...
          {showExports ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {showExports && (
          <div className="mt-2 grid grid-cols-3 sm:grid-cols-5 gap-2">
            <ExportButton
              icon={<FileText className="h-4 w-4" />}
              label="TXT"
              onClick={() => exportAsTXT(displayText, exportFilename)}
            />
            <ExportButton
              icon={<FileText className="h-4 w-4" />}
              label="DOCX"
              onClick={() => exportAsDOCX(displayText, exportFilename)}
            />
            <ExportButton
              icon={<FileImage className="h-4 w-4" />}
              label="PDF"
              onClick={() => exportAsPDF(displayText, exportFilename)}
            />
            <ExportButton
              icon={<Code className="h-4 w-4" />}
              label="HTML"
              onClick={() => exportAsHTML(displayText, exportFilename)}
            />
            <ExportButton
              icon={<FileCode className="h-4 w-4" />}
              label="Markdown"
              onClick={() => exportAsMarkdown(displayText, exportFilename)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ExportButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all"
    >
      {icon}
      {label}
    </button>
  );
}
