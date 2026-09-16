"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Paperclip, Mic, Loader2, Copy, Download, X, User, Square, RotateCcw, FileText } from "lucide-react";
import { Brand } from "@/config/site";
import { DOCUMENT_TEMPLATES } from "@/lib/ai/prompts";
import { templates as staticTemplates, type Template } from "@/data/templates";
import { DocumentPreview } from "./DocumentPreview";

const TYPES = ["Auto", "Business", "Personal", "Academic", "Meeting"];

export default function GeneratePage() {
  const [text, setText] = useState("");
  const [type, setType] = useState("Auto");
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<string>("");
  const [templates, setTemplates] = useState<Template[]>(staticTemplates);
  const STARTER_TEMPLATES = templates.slice(0, 3);

  useEffect(() => {
    fetch("/api/templates/list?limit=20")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.templates) && d.templates.length > 0) {
          const mapped: Template[] = d.templates.map((t: any) => ({
            id: t.id,
            title: t.title,
            author: t.author || t.user?.name || "Docmaker",
            category: (t.category as Template["category"]) || "Business",
            thumbnails: Array.isArray(t.thumbnails) && t.thumbnails.length ? t.thumbnails : ["/api/og?title=" + encodeURIComponent(t.title)],
            content: t.content || t.prompt || t.description || "",
          }));
          setTemplates(mapped);
        }
      })
      .catch(() => {});
  }, []);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [text]);

  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current;
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
      if (isNearBottom) el.scrollTop = el.scrollHeight;
    }
  }, [output]);

  const pages = text.length > 0 ? Math.max(1, Math.round(text.length / 3000)) : 0;

  const selectType = (t: string) => {
    setType(t);
    const tpl = DOCUMENT_TEMPLATES[t.toLowerCase().replace(" ", "_")];
    if (tpl?.prompt) setText(tpl.prompt);
  };

  useEffect(() => {
    if (attachedFiles.length === 0) { setFilePreview(""); return; }
    const f = attachedFiles[0];
    if (f.name.endsWith(".txt") || f.name.endsWith(".csv") || f.type.startsWith("text/")) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview((e.target?.result as string)?.slice(0, 2000) || "");
      reader.readAsText(f);
    } else {
      setFilePreview(`\u2022 ${f.name} (${(f.size/1024).toFixed(1)} KB) — will be used as generation context`);
    }
  }, [attachedFiles]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((f) => /(\.pdf|\.docx|\.txt|\.csv|\.xlsx|\.png|\.jpg|\.jpeg|\.webp)$/i.test(f.name));
    setAttachedFiles((prev) => [...prev, ...valid].slice(0, 3));
  };

  const generate = async () => {
    if ((!text.trim() && attachedFiles.length === 0) || generating) return;
    setGenerating(true);
    setOutput("");
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const form = new FormData();
      form.append("text", text);
      form.append("structure", type.toLowerCase().replace(" ", "_"));
      attachedFiles.forEach((f) => form.append("files", f));

      const res = await fetch("/api/generate", {
        method: "POST",
        body: form,
        signal: controller.signal,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
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
      if (e.name !== "AbortError") setOutput(`Error: ${e.message}`);
    } finally {
      setGenerating(false);
      abortRef.current = null;
    }
  };

  const stop = () => abortRef.current?.abort();

  const useTemplate = (tpl: Template) => {
    setText(tpl.content);
    const mapped = tpl.category.charAt(0).toUpperCase() + tpl.category.slice(1);
    if (TYPES.map((x) => x.toLowerCase()).includes(mapped.toLowerCase())) setType(mapped);
    setPreviewTemplate(null);
    textareaRef.current?.focus();
  };

  const copy = () => navigator.clipboard.writeText(output);
  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([output], { type: "text/markdown" }));
    a.download = `document.md`;
    a.click();
  };

  const isEmpty = !output && !generating;

  return (
    <div className="flex flex-col h-[calc(100dvh-64px)] bg-[#F4F6FB]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: Brand.navy }}>
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">What will you create today?</h1>
              <p className="text-sm text-slate-500 mt-2 max-w-md">Describe your idea, paste text, or attach a source file. Choose a starter below or start typing.</p>
              <div className="flex flex-wrap gap-2 justify-center mt-6">
                {STARTER_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setPreviewTemplate(tpl)}
                    className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm text-slate-700 hover:border-slate-300 hover:shadow-sm transition-all"
                  >
                    {tpl.title}
                  </button>
                ))}
                <a href="/templates" className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm text-slate-600 hover:border-slate-300">
                  Browse all →
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {text && (
                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Your prompt • {type}</p>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{text}</p>
                  {attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {attachedFiles.map((f) => (
                        <span key={f.name} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-xs text-slate-700">
                          <FileText className="h-3 w-3" /> {f.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-2">
                    {generating && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />} {generating ? "Generating..." : "Preview"}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={copy} className="p-1.5 rounded hover:bg-slate-100" aria-label="Copy">
                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                    <button onClick={download} className="p-1.5 rounded hover:bg-slate-100" aria-label="Download">
                      <Download className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                    {!generating && output && (
                      <button onClick={() => setOutput("")} className="p-1.5 rounded hover:bg-slate-100" aria-label="Regenerate">
                        <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-0 max-h-[60vh] overflow-y-auto bg-[#EEF1F5]">
                  <div className="p-4">
                    <DocumentPreview content={output} category={type} paginated />
                    {generating && <span className="inline-block w-2 h-4 bg-slate-900 ml-0.5 animate-pulse align-middle" />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {filePreview && !output && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Attached document preview</span>
                <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{attachedFiles[0]?.name}</span>
              </div>
              <div className="p-3 bg-[#EEF1F5]">
                <DocumentPreview content={filePreview} category={type} scale={0.42} />
              </div>
            </div>
          )}

          <div className="mt-8">
            <div className="flex items-baseline justify-between mb-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Templates</p>
              <a href="/templates" className="text-xs text-slate-500 hover:text-slate-700">See all →</a>
            </div>
            {templates.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center">
                <p className="text-sm text-slate-500">No templates yet.</p>
                <p className="text-xs text-slate-400 mt-1">Upload templates in <a href="/admin/templates" className="text-[#121660] underline">Admin → Templates</a>.</p>
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setPreviewTemplate(tpl)}
                    className="group flex-shrink-0 w-[220px] text-left bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all"
                  >
                    <div className="h-[140px] bg-[#EEF1F5] overflow-hidden p-2">
                      <div className="bg-white shadow-sm rounded-sm overflow-hidden h-full">
                        <DocumentPreview content={tpl.content} category={tpl.category} scale={0.32} />
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-slate-900 line-clamp-1">{tpl.title}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <User className="h-3 w-3" /> {tpl.author}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sticky bottom-[76px] lg:bottom-0 bg-[#F4F6FB] border-t border-slate-200 lg:border-0">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#121660]/20 focus-within:border-[#121660]">
            <div className="flex flex-wrap gap-1.5 px-3 pt-3">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => selectType(t)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                    type === t ? "bg-[#121660] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe or paste what you want to turn into a document — just paste any copied text and we'll format it beautifully..."
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate();
              }}
              className="w-full px-4 py-3 bg-transparent text-sm text-slate-900 placeholder-slate-400 resize-none focus:outline-none min-h-[56px] max-h-[160px]"
            />
            {attachedFiles.length > 0 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {attachedFiles.map((f) => (
                  <span key={f.name} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-xs text-slate-700">
                    {f.name}
                    <button onClick={() => setAttachedFiles((prev) => prev.filter((x) => x !== f))}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-slate-50 border-t border-slate-100">
              <div className="flex gap-2">
                <input ref={fileInputRef as any} type="file" multiple accept=".pdf,.docx,.txt,.csv,.xlsx,.png,.jpg,.jpeg,.webp" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                <button
                  type="button"
                  onClick={() => (fileInputRef as any).current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Paperclip className="h-3.5 w-3.5" /> Attach
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-700"
                >
                  <Mic className="h-3.5 w-3.5" /> Voice
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-slate-400">~{pages} {pages === 1 ? "page" : "pages"}</span>
                {generating ? (
                  <button onClick={stop} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold">
                    <Square className="h-3 w-3 fill-white" /> Stop
                  </button>
                ) : (
                  <button
                    onClick={generate}
                    disabled={!text.trim() && attachedFiles.length === 0}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#121660] text-white text-xs font-semibold disabled:opacity-40"
                  >
                    Generate <Sparkles className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-2">Press ⌘+Enter to generate • AI can make mistakes. Review before sharing.</p>
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
              <div className="bg-[#EEF1F5] p-4 rounded-xl">
                <DocumentPreview content={previewTemplate.content} category={previewTemplate.category} paginated />
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 max-h-56 overflow-auto">
                <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">{previewTemplate.content}</pre>
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex gap-3">
              <button onClick={() => setPreviewTemplate(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Close
              </button>
              <button onClick={() => useTemplate(previewTemplate)} className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: Brand.navy }}>
                Use this template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
