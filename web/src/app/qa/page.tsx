"use client";

import { useState } from "react";
import { Upload, X, FileText, Send } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";

export default function QAPage() {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = () => {
    if (!question.trim() || !file) return;
    setAnswer("Based on the document, here is the answer to your question. The document contains relevant information about your query.");
  };

  return (
    <ToolPageLayout title="AI Q&A" color="navy">
      <div className="space-y-8">
        <p className="text-lg text-slate-600">Ask questions about your documents and get instant answers.</p>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-[#121660] transition-colors cursor-pointer">
          <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p className="text-lg font-semibold text-slate-900 mb-2">Drop a document here or click to upload</p>
          <p className="text-sm text-slate-500">Supports PDF, DOCX, TXT, and more</p>
        </div>

        {/* File Info */}
        {file && (
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <FileText className="h-8 w-8 text-[#121660]" />
            <div className="flex-1">
              <p className="font-semibold text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={() => setFile(null)} className="p-2 hover:bg-slate-200 rounded">
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        )}

        {/* Question Input */}
        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Ask a Question</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder='e.g., "What are the payment terms?"'
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#121660] focus:border-transparent"
            />
            <button
              onClick={handleAsk}
              disabled={!question.trim() || !file}
              className="px-6 py-3 rounded-lg text-white font-semibold transition-all disabled:opacity-50"
              style={{ backgroundColor: '#121660' }}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Answer */}
        {answer && (
          <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Answer</h3>
            <p className="text-slate-600 leading-relaxed">{answer}</p>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
