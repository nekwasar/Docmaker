"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Paperclip, Mic, Loader2, Copy, Download, X, User, Eye } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { Brand } from "@/config/site";
import { DOCUMENT_TEMPLATES } from "@/lib/ai/prompts";
import { templates, type Template } from "@/data/templates";

const TYPES = ["Auto", "Business", "Personal", "Academic", "Meeting"];

export default function GeneratePage() {
  const [text, setText] = useState("");
  const [type, setType] = useState("Auto");
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [text]);

  useEffect(() => {
    if (generating && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, generating]);

  const pages = text.length > 0 ? Math.max(1, Math.round(text.length / 3000)) : 0;

  const selectType = (t: string) => {
    setType(t);
    const tpl = DOCUMENT_TEMPLATES[t.toLowerCase().replace(" ", "_")];
    if (tpl?.prompt) setText(tpl.prompt);
  };

  const generate = async () => {
    if (!text.trim() || generating) return;
    setGenerating(true);
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, structure: type.toLowerCase().replace(" ", "_") }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed");
      }
      const reader = res.body?.getReader();
      const dec = new TextDecoder();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          setOutput((p) => p + dec.decode(value, { stream: true }));
        }
      }
    } catch (e: any) {
      setOutput(`Error: ${e.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const useTemplate = (tpl: Template) => {
    setText(tpl.content);
    const mapped = tpl.category.charAt(0).toUpperCase() + tpl.category.slice(1);
    if (TYPES.map((x) => x.toLowerCase()).includes(mapped.toLowerCase())) {
      setType(mapped);
    }
    setPreviewTemplate(null);
    textareaRef.current?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
  };
  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([output], { type: "text/markdown" }));
    a.download = `document.md`;
    a.click();
  };

  return (
    <ToolPageLayout title="AI Generate" color="yellow">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Document type</p>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => selectType(t)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  type === t
                    ? "bg-[#121660] text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#121660]/20 focus-within:border-[#121660] transition-shadow">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe what you want to create..."
            rows={5}
            className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 placeholder-slate-400 resize-none focus:outline-none min-h-[120px]"
          />
          <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-slate-50 border-t border-slate-100">
            <div className="flex gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                <Paperclip className="h-3.5 w-3.5 text-slate-700" /> Attach
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
              >
                <Mic className="h-3.5 w-3.5 text-slate-700" /> Voice
              </button>
            </div>
            {pages > 0 ? (
              <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm">
                ~{pages} {pages === 1 ? "page" : "pages"}
              </span>
            ) : (
              <span className="text-xs text-slate-400">Attach files or describe your idea</span>
            )}
          </div>
        </div>

        <button
          onClick={generate}
          disabled={!text.trim() || generating}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: Brand.navy }}
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            <>
              Generate <Sparkles className="h-4 w-4" />
            </>
          )}
        </button>

        {output && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-500">Output</span>
              <div className="flex gap-1">
                <button onClick={copy} className="p-1.5 rounded hover:bg-slate-100" aria-label="Copy output">
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                </button>
                <button onClick={download} className="p-1.5 rounded hover:bg-slate-100" aria-label="Download output">
                  <Download className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </div>
            </div>
            <div ref={outputRef} className="p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">{output}</pre>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Templates</p>
            <span className="text-xs text-slate-400">{templates.length} curated</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-thin">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setPreviewTemplate(tpl)}
                className="group flex-shrink-0 w-[220px] text-left bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="h-[124px] bg-slate-100 overflow-hidden flex">
                  {tpl.thumbnails.slice(0, 2).map((src) => (
                    <img key={src} src={src} alt="" className="w-1/2 h-full object-cover group-hover:scale-[1.02] transition-transform" loading="lazy" />
                  ))}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-slate-900 leading-tight line-clamp-1">{tpl.title}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <User className="h-3 w-3" /> {tpl.author}
                    <span className="mx-1">•</span>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">{tpl.category}</span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button aria-label="Close preview" onClick={() => setPreviewTemplate(null)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden bg-white rounded-2xl shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-900">{previewTemplate.title}</h2>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> {previewTemplate.author}
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 ml-1">{previewTemplate.category}</span>
                </p>
              </div>
              <button onClick={() => setPreviewTemplate(null)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {previewTemplate.thumbnails.map((src, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img src={src} alt={`Thumbnail ${i + 1} for ${previewTemplate.title}`} className="w-full h-40 object-cover" loading="lazy" />
                    <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-medium text-slate-700 shadow">
                      <Eye className="h-3 w-3" /> {i + 1} / {previewTemplate.thumbnails.length}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 max-h-56 overflow-auto">
                <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">{previewTemplate.content}</pre>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 flex gap-3">
              <button onClick={() => setPreviewTemplate(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Close
              </button>
              <button
                onClick={() => useTemplate(previewTemplate)}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white hover:opacity-90"
                style={{ backgroundColor: Brand.navy }}
              >
                Use this template
              </button>
            </div>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
