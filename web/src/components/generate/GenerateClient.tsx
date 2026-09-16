"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, Mic, Copy, Download, X, User, Square, RotateCcw, FileText, FileUp, LayoutGrid, ArrowUp, Sparkles, ChevronDown } from "lucide-react";
import { templates as staticTemplates, type Template } from "@/data/templates";
import { DocumentPreview } from "./DocumentPreview";

const EXAMPLE_PROMPTS = [
  { label: "Draft a Non-Disclosure Agreement", text: "Draft a mutual Non-Disclosure Agreement between Nova Studio Inc. and Acme Corp, 2-year confidentiality, define confidential information, obligations, term, and return of materials.", cat: "Legal" },
  { label: "Create a Marketing Strategy Brief", text: "Create a marketing strategy brief for Borcelle — a boutique marketing agency targeting mission-driven brands. Include goals, audience, channels, and KPIs to hit $700K yearly revenue.", cat: "Business" },
  { label: "Generate a Modern Invoice", text: "Generate a modern business invoice for Nova Studio charging Acme Corp $6,998.25 with 3 line items, tax 8.5%, due in 14 days.", cat: "Business" },
  { label: "Write a Business Plan Outline", text: "Write a business plan outline for a small creative studio — executive summary, market analysis, services, marketing & sales, operations, team, and financial plan.", cat: "Business" },
  { label: "Draft Meeting Notes", text: "Draft weekly sync meeting notes: sprint review, roadmap Q3, blockers, decisions, and action items with owners and due dates.", cat: "Meeting" },
  { label: "Create Research Brief", text: "Create a research brief on remote work's impact on urban design — abstract, introduction, literature review, analysis, and conclusion.", cat: "Academic" },
] as const;

const MODEL_OPTIONS = ["GPT-4o", "Claude 3.5 Sonnet", "Gemini 1.5 Pro"] as const;
const FORMAT_OPTIONS = ["PDF", "DOCX", "Markdown"] as const;

export default function GeneratePage() {
  const [text, setText] = useState("");
  const [selectedModel, setSelectedModel] = useState<(typeof MODEL_OPTIONS)[number]>("GPT-4o");
  const [selectedFormat, setSelectedFormat] = useState<(typeof FORMAT_OPTIONS)[number]>("PDF");
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [previewPage, setPreviewPage] = useState(0);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<string>("");
  const [templates, setTemplates] = useState<Template[]>(staticTemplates);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetch("/api/templates/list?limit=20")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.templates)) {
          const mapped: Template[] = d.templates.map((t: any) => ({
            id: t.id,
            title: t.title,
            author: t.author || t.user?.name || "Docmaker",
            category: (t.category as Template["category"]) || "Business",
            thumbnails: Array.isArray(t.thumbnails) && t.thumbnails.length ? t.thumbnails : [],
            content: t.content || t.prompt || t.description || "",
            fileUrl: t.fileUrl || null,
          }));
          setTemplates(mapped);
        }
      })
      .catch(() => {});
  }, []);

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

  useEffect(() => {
    if (attachedFiles.length === 0) { setFilePreview(""); return; }
    const f = attachedFiles[0];
    if (f.name.endsWith(".txt") || f.name.endsWith(".csv") || f.type.startsWith("text/")) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview((e.target?.result as string)?.slice(0, 2000) || "");
      reader.readAsText(f);
    } else {
      setFilePreview(`• ${f.name} (${(f.size / 1024).toFixed(1)} KB) — will be used as generation context`);
    }
  }, [attachedFiles]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter((f) => /(\.pdf|\.docx|\.txt|\.csv|\.xlsx|\.png|\.jpg|\.jpeg|\.webp)$/i.test(f.name));
    setAttachedFiles((prev) => [...prev, ...valid].slice(0, 3));
  };

  const handlePromptClick = (prompt: string) => {
    setText(prompt);
    textareaRef.current?.focus();
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
      form.append("structure", "business");
      form.append("model", selectedModel);
      form.append("format", selectedFormat.toLowerCase());
      attachedFiles.forEach((f) => form.append("files", f));

      const res = await fetch("/api/generate", { method: "POST", body: form, signal: controller.signal });
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

  const useTemplate = async (tpl: Template) => {
    setPreviewTemplate(null);
    if (tpl.fileUrl) {
      try {
        const res = await fetch(tpl.fileUrl);
        const blob = await res.blob();
        const name = tpl.fileUrl.split("/").pop() || `${tpl.title}.pdf`;
        const file = new File([blob], name, { type: blob.type || "application/pdf" });
        setAttachedFiles((prev) => {
          if (prev.some((p) => p.name === file.name && p.size === file.size)) return prev;
          return [file, ...prev].slice(0, 3);
        });
      } catch {}
    }
    const guided = tpl.fileUrl
      ? `<!-- ✎ Add your main content above — replace this line -->\nYour content here: \n\n---\nUse the attached template "${tpl.title}" as the exact structure and styling reference. Keep its sections, headings, and layout (see attached file), but replace the body with new content based on what I wrote above. Generate a complete, paginated document.\n`
      : `<!-- ✎ Add your main content above — this template's text is below for reference -->\nYour content here: \n\n---\nTemplate reference — "${tpl.title}":\n${tpl.content}\n\n---\nUsing the template above as structure, generate a new document with my content. Keep the same headings and flow.\n`;
    setText(guided);
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.focus();
        const v = el.value;
        const endMarker = "---\n";
        const end = v.indexOf(endMarker);
        if (end !== -1) el.setSelectionRange(0, end + endMarker.length);
        else el.select();
        el.scrollTop = 0;
      }, 50);
    });
  };

  useEffect(() => { setPreviewPage(0); }, [previewTemplate]);

  const copy = () => navigator.clipboard.writeText(output);
  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([output], { type: "text/markdown" }));
    a.download = `document.${selectedFormat.toLowerCase() === "pdf" ? "pdf" : selectedFormat.toLowerCase() === "docx" ? "docx" : "md"}`;
    a.click();
  };

  const isEmpty = !output && !generating;

  return (
    <div className="min-h-[calc(100dvh-64px)] bg-white">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[720px] px-4 sm:px-6 py-6 sm:py-8 space-y-6">
          {/* Intent-Focused Hero Section — replaces Sponsored + Help us grow */}
          <div className="text-center sm:text-left space-y-3 py-2">
            <h1 className="text-[30px] sm:text-[38px] font-bold tracking-[-0.03em] leading-[1.05] text-[#0F172A]">
              Generate Formatted Documents in Seconds with AI.
            </h1>
            <p className="mx-auto sm:mx-0 max-w-[560px] text-[13px] leading-5 text-[#475569]">
              Turn raw text or files into paginated, print-ready PDFs and DOCXs — no manual formatting.
            </p>
          </div>

          {/* One-Click Prompt Templates — replaces generic category pills */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold tracking-wide text-[#0F172A] uppercase">Try one</p>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-none">
              {EXAMPLE_PROMPTS.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => handlePromptClick(ex.text)}
                  className="shrink-0 snap-start rounded-[8px] border border-[#E2E8F0] bg-white px-3 py-2 text-left hover:border-[#0F172A] hover:bg-[#FAFAFA] transition-colors"
                >
                  <span className="block text-[12px] font-medium leading-4 text-[#0F172A] whitespace-nowrap">{ex.label}</span>
                  <span className="block text-[11px] text-[#475569]">{ex.cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Area — un-stuck, directly under hero, with exposed controls */}
          <div className="rounded-[12px] border border-[#E2E8F0] bg-white shadow-sm focus-within:border-[#0F172A] focus-within:ring-1 focus-within:ring-[#0F172A] overflow-hidden">
            {/* Exposed Interactive Controls */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E8F0] bg-[#FAFAFA] px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-[#475569]">Model</span>
                <div className="relative">
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as any)}
                    className="appearance-none rounded-[6px] border border-[#E2E8F0] bg-white pl-2 pr-6 py-1 text-[12px] font-medium text-[#0F172A] focus:outline-none focus:border-[#0F172A]"
                  >
                    {MODEL_OPTIONS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#475569]" strokeWidth={1.5} />
                </div>
              </div>
              <span className="h-4 w-px bg-[#E2E8F0]" />
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-[#475569]">Format</span>
                <div className="relative">
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value as any)}
                    className="appearance-none rounded-[6px] border border-[#E2E8F0] bg-white pl-2 pr-6 py-1 text-[12px] font-medium text-[#0F172A] focus:outline-none focus:border-[#0F172A]"
                  >
                    {FORMAT_OPTIONS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-[#475569]" strokeWidth={1.5} />
                </div>
              </div>
              <span className="ml-auto hidden sm:inline text-[11px] text-[#64748B]">~{pages} {pages === 1 ? "page" : "pages"}</span>
            </div>

            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe what you want to create, paste your draft, or drop a file — we’ll structure and format it…"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) generate();
              }}
              className="min-h-[96px] max-h-[200px] w-full resize-none bg-white px-3 py-3 text-[13px] leading-5 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
            />

            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-3 pb-2">
                {attachedFiles.map((f, i) => (
                  <span key={`${f.name}-${f.size}-${i}`} className="inline-flex items-center gap-1 rounded-[6px] border border-[#E2E8F0] bg-[#FAFAFA] px-1.5 py-0.5 text-[11px] text-[#0F172A]">
                    {f.name}
                    <button onClick={() => setAttachedFiles((prev) => prev.filter((x) => x !== f))} className="ml-1 rounded-[4px] p-0.5 hover:bg-white">
                      <X className="h-2.5 w-2.5" strokeWidth={1.5} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between gap-2 border-t border-[#E2E8F0] bg-[#FAFAFA] px-3 py-2.5">
              <div className="flex items-center gap-2">
                <input ref={fileInputRef as any} type="file" multiple accept=".pdf,.docx,.txt,.csv,.xlsx,.png,.jpg,.jpeg,.webp" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                <button
                  type="button"
                  onClick={() => (fileInputRef as any).current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-[12px] font-medium text-[#0F172A] hover:bg-slate-50"
                >
                  <Paperclip className="h-3.5 w-3.5" strokeWidth={1.5} /> Attach
                </button>
                <button type="button" className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-[12px] font-medium text-[#0F172A] hover:bg-slate-50">
                  <Mic className="h-3.5 w-3.5" strokeWidth={1.5} /> Voice
                </button>
              </div>
              {generating ? (
                <button onClick={stop} className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#0F172A] px-4 py-2 text-[13px] font-semibold text-white hover:bg-black">
                  <Square className="h-3.5 w-3.5 fill-white" strokeWidth={1.5} /> Stop
                </button>
              ) : (
                <button
                  onClick={generate}
                  className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#0F172A] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-black shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Generate Document <span aria-hidden>→</span>
                </button>
              )}
            </div>
          </div>

          {/* Agent thinking indicator (kept, but compact) */}
          {generating && (
            <div className="flex items-center gap-2 rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2.5">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-30" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[12px] font-medium text-[#0F172A]">Generating response...</span>
            </div>
          )}

          {/* Output preview */}
          {!isEmpty && (
            <div className="space-y-4">
              {text && (
                <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-4">
                  <p className="text-[11px] font-medium tracking-wide text-[#475569] uppercase">Your prompt</p>
                  <p className="mt-2 whitespace-pre-wrap text-[13px] leading-5 text-[#0F172A]">{text}</p>
                  {attachedFiles.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {attachedFiles.map((f, i) => (
                        <span key={`${f.name}-${f.size}-${i}`} className="inline-flex items-center gap-1 rounded-[6px] border border-[#E2E8F0] bg-[#FAFAFA] px-1.5 py-0.5 text-[11px] text-[#0F172A]">
                          <FileText className="h-2.5 w-2.5" strokeWidth={1.5} /> {f.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] px-3 py-2">
                  <span className="inline-flex items-center gap-2 text-[11px] font-medium tracking-wide text-[#475569] uppercase">
                    {generating && <span className="h-2 w-2 rounded-[2px] bg-emerald-500 animate-pulse" />} {generating ? "Generating" : "Preview"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={copy} className="rounded-[6px] border border-[#E2E8F0] bg-white p-1.5 hover:bg-slate-50" aria-label="Copy">
                      <Copy className="h-3.5 w-3.5 text-slate-600" strokeWidth={1.5} />
                    </button>
                    <button onClick={download} className="rounded-[6px] border border-[#E2E8F0] bg-white p-1.5 hover:bg-slate-50" aria-label="Download">
                      <Download className="h-3.5 w-3.5 text-slate-600" strokeWidth={1.5} />
                    </button>
                    {!generating && output && (
                      <button onClick={() => setOutput("")} className="rounded-[6px] border border-[#E2E8F0] bg-white p-1.5 hover:bg-slate-50" aria-label="Regenerate">
                        <RotateCcw className="h-3.5 w-3.5 text-slate-600" strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-[56vh] overflow-y-auto bg-[#F8FAFC] p-4">
                  <div className="rounded-[8px] border border-[#E2E8F0] bg-white p-4">
                    <DocumentPreview content={output} category="Business" paginated />
                    {generating && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-[#0F172A] align-middle" />}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Templates — kept below input for discovery */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2">
                <LayoutGrid className="h-3.5 w-3.5 text-[#475569]" strokeWidth={1.5} />
                <p className="text-[11px] font-semibold tracking-wide text-[#0F172A] uppercase">Templates</p>
                <span className="rounded-[6px] border border-[#E2E8F0] bg-[#FAFAFA] px-1.5 py-0.5 text-[10px] font-medium text-[#475569]">{templates.length}</span>
              </div>
              <a href="/templates" className="inline-flex items-center gap-1 rounded-[6px] border border-[#E2E8F0] bg-white px-2 py-1 text-[11px] font-medium text-[#0F172A] hover:bg-slate-50">
                See all <ArrowUp className="h-3 w-3 rotate-45" strokeWidth={1.5} />
              </a>
            </div>
            {templates.length === 0 ? (
              <div className="overflow-hidden rounded-[10px] border border-dashed border-[#E2E8F0] bg-white">
                <div className="grid grid-cols-3 divide-x divide-dashed divide-[#E2E8F0]">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex flex-col items-center justify-center gap-2 p-5 text-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#E2E8F0] bg-[#FAFAFA]">
                        <FileUp className="h-4 w-4 text-[#475569]" strokeWidth={1.5} />
                      </div>
                      <span className="text-[11px] font-medium text-[#475569]">{i === 0 ? "No templates" : "Empty slot"}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center border-t border-dashed border-[#E2E8F0] bg-[#FAFAFA] px-4 py-3">
                  <a href="/upload/template" className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#0F172A] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-black">
                    Upload template <ArrowUp className="h-3 w-3 rotate-45" strokeWidth={1.5} />
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-2.5 sm:overflow-visible sm:pb-0">
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setPreviewTemplate(tpl)}
                    className="group shrink-0 w-[48%] snap-start overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white text-left hover:border-[#CBD5E1] hover:bg-[#FAFAFA] transition-colors sm:w-auto"
                  >
                    <div className="h-[195px] border-b border-[#E2E8F0] bg-[#F8FAFC] p-2">
                      {tpl.fileUrl ? (
                        tpl.thumbnails && tpl.thumbnails.length > 0 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={tpl.thumbnails[0]} alt={tpl.title} className="h-full w-full object-cover rounded-[6px] border border-[#E2E8F0] bg-white" />
                        ) : (
                          <div className="flex h-full items-center justify-center rounded-[6px] border border-[#E2E8F0] bg-white p-2 text-center">
                            <div>
                              <FileText className="mx-auto h-5 w-5 text-[#475569]" strokeWidth={1.5} />
                              <p className="mt-1 text-[10px] font-medium text-[#475569]">PDF • {tpl.title.slice(0, 18)}</p>
                              <p className="text-[10px] text-[#94A3B8]">Tap to preview</p>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="h-full overflow-hidden rounded-[6px] border border-[#E2E8F0] bg-white">
                          <DocumentPreview content={tpl.content} category={tpl.category} scale={0.32} />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="truncate text-[13px] font-semibold leading-none text-[#0F172A]">{tpl.title}</p>
                      <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#475569]">
                        <User className="h-3 w-3" strokeWidth={1.5} /> {tpl.author}
                        <span className="ml-1 rounded-[4px] border border-[#E2E8F0] bg-[#FAFAFA] px-1 py-0 text-[10px] font-medium">{tpl.category}</span>
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button aria-label="Close preview" onClick={() => setPreviewTemplate(null)} className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-[2px]" />
          <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3">
              <div>
                <h2 className="text-[14px] font-semibold text-[#0F172A]">{previewTemplate.title}</h2>
                <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-[#475569]">
                  <User className="h-3 w-3" strokeWidth={1.5} /> {previewTemplate.author}
                  <span className="rounded-[6px] border border-[#E2E8F0] bg-[#FAFAFA] px-1.5 py-0.5 text-[10px] font-medium text-[#0F172A]">{previewTemplate.category}</span>
                </p>
              </div>
              <button onClick={() => setPreviewTemplate(null)} className="rounded-[6px] border border-[#E2E8F0] bg-white p-1.5 hover:bg-slate-50" aria-label="Close">
                <X className="h-4 w-4 text-[#475569]" strokeWidth={1.5} />
              </button>
            </div>
            <div className="space-y-3 overflow-y-auto p-4">
              {previewTemplate.fileUrl ? (
                previewTemplate.thumbnails && previewTemplate.thumbnails.length > 0 ? (
                  <div className="space-y-3">
                    <div className="overflow-hidden rounded-[8px] border border-[#E2E8F0] bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewTemplate.thumbnails[previewPage]} alt={`Page ${previewPage + 1}`} className="w-full object-contain" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-[#475569]">Page {previewPage + 1} of {previewTemplate.thumbnails.length}</span>
                      <div className="flex gap-1">
                        <button disabled={previewPage === 0} onClick={() => setPreviewPage((p) => Math.max(0, p - 1))} className="rounded-[6px] border border-[#E2E8F0] bg-white px-2 py-1 text-[11px] disabled:opacity-40">Prev</button>
                        <button disabled={previewPage === previewTemplate.thumbnails.length - 1} onClick={() => setPreviewPage((p) => Math.min(previewTemplate.thumbnails.length - 1, p + 1))} className="rounded-[6px] border border-[#E2E8F0] bg-white px-2 py-1 text-[11px] disabled:opacity-40">Next</button>
                      </div>
                    </div>
                    <div className="flex justify-center gap-1.5">
                      {previewTemplate.thumbnails.map((_, i) => (
                        <button key={i} onClick={() => setPreviewPage(i)} aria-label={`Go to page ${i + 1}`} className={`h-1.5 w-6 rounded-full ${i === previewPage ? "bg-[#0F172A]" : "bg-[#E2E8F0]"}`} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-[8px] border border-[#E2E8F0] bg-white" style={{ height: 420 }}>
                    <iframe src={previewTemplate.fileUrl} title={previewTemplate.title} className="h-full w-full border-0" />
                  </div>
                )
              ) : (
                <div className="rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <DocumentPreview content={previewTemplate.content} category={previewTemplate.category} paginated />
                </div>
              )}
            </div>
            <div className="border-t border-[#E2E8F0] p-3">
              <button onClick={() => useTemplate(previewTemplate)} className="w-full rounded-[6px] bg-[#0F172A] py-2.5 text-[13px] font-semibold text-white hover:bg-black">
                Use this template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
