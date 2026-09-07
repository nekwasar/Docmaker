"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Sparkles, Paperclip, Mic, Loader2, Copy, Check, Download, ChevronRight, FileText, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Brand } from "@/config/site";
import { DOCUMENT_TEMPLATES, TEMPLATE_PREVIEWS } from "@/lib/ai/prompts";

const DOC_TYPES = [
  { id: "auto", label: "Auto" },
  { id: "invoice", label: "Invoice" },
  { id: "report", label: "Report" },
  { id: "contract", label: "Contract" },
  { id: "proposal", label: "Proposal" },
  { id: "resume", label: "Resume" },
  { id: "essay", label: "Essay" },
  { id: "letter", label: "Letter" },
  { id: "memo", label: "Memo" },
  { id: "meeting_notes", label: "Meeting Notes" },
];

export default function GeneratePage() {
  const [text, setText] = useState("");
  const [structure, setStructure] = useState("auto");
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  // Auto-scroll output during generation
  useEffect(() => {
    if (generating && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, generating]);

  const handleTypeSelect = (typeId: string) => {
    setStructure(typeId);
    const template = DOCUMENT_TEMPLATES[typeId];
    if (template?.prompt) {
      setText(template.prompt);
    }
  };

  const handleTemplateSelect = (template: typeof TEMPLATE_PREVIEWS[0]) => {
    setStructure(template.category);
    setText(template.prompt);
    setShowTemplates(false);
  };

  const handleGenerate = async () => {
    if (!text.trim() || generating) return;

    setGenerating(true);
    setOutput("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, structure }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setOutput((prev) => prev + chunk);
        }
      }
    } catch (error: any) {
      setOutput(`[Error: ${error.message}]`);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `document-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Estimate pages based on text length
  const estimatedPages = text.length > 0 ? Math.max(1, Math.round(text.length / 3000)) : 0;

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link href="/" className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <h1 className="text-lg font-bold text-slate-900">AI Generate</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Document Type Selector */}
        <div>
          <p className="text-sm font-semibold text-slate-900 mb-3">Select Document Type</p>
          <div className="flex flex-wrap gap-2">
            {DOC_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  structure === type.id
                    ? "text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
                style={structure === type.id ? { backgroundColor: Brand.navy } : undefined}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Prompt Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe your document or tap a category above..."
            rows={4}
            className="w-full px-5 py-4 text-sm text-slate-900 placeholder-slate-400 resize-none focus:outline-none min-h-[120px]"
          />

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors">
                <Paperclip className="h-3.5 w-3.5" />
                Attach
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors">
                <Mic className="h-3.5 w-3.5" />
                Voice
              </button>
            </div>
            {estimatedPages > 0 && (
              <span className="text-xs text-slate-400 font-medium">~{estimatedPages} {estimatedPages === 1 ? "Page" : "Pages"}</span>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!text.trim() || generating}
          className="w-full flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
          style={{ backgroundColor: Brand.navy }}
        >
          {generating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Generate Document
              <Sparkles className="h-5 w-5" />
            </>
          )}
        </button>

        {/* Streaming Output */}
        {output && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Generated Document</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Copy"
                >
                  <Copy className="h-4 w-4 text-slate-500" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Download"
                >
                  <Download className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>
            <div ref={outputRef} className="p-5 max-h-[500px] overflow-y-auto">
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">
                {output}
              </pre>
            </div>
          </div>
        )}

        {/* Template Preview Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-900">Or start with a template</p>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-xs font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              {showTemplates ? "Show less" : "See All"}
              <ChevronDown className={`h-3 w-3 transition-transform ${showTemplates ? "rotate-180" : ""}`} />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {TEMPLATE_PREVIEWS.slice(0, showTemplates ? TEMPLATE_PREVIEWS.length : 3).map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => handleTemplateSelect(tpl)}
                className="flex-shrink-0 w-40 p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all text-left group"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${tpl.color}15` }}
                >
                  <FileText className="h-5 w-5" style={{ color: tpl.color }} />
                </div>
                <p className="text-sm font-semibold text-slate-900 group-hover:text-[#121660] transition-colors">
                  {tpl.name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 capitalize">{tpl.category.replace("_", " ")}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
