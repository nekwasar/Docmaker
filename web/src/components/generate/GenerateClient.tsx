"use client";

import { useState, useRef, useEffect } from "react";
import { Paperclip, Mic, Download, X, User, Square, RotateCcw, FileText, FileUp, LayoutGrid, ArrowUp, Sparkles, ChevronDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { templates as staticTemplates, type Template } from "@/data/templates";
import type { DocumentTheme } from "@/lib/render/document";
import { DocumentPreview } from "./DocumentPreview";
import GenerationProgress from "./GenerationProgress";

const EXAMPLE_PROMPTS = [
  { label: "Draft a Non-Disclosure Agreement", text: "Draft a mutual Non-Disclosure Agreement between Nova Studio Inc. and Acme Corp, 2-year confidentiality, define confidential information, obligations, term, and return of materials.", cat: "Legal" },
  { label: "Create a Marketing Strategy Brief", text: "Create a marketing strategy brief for Borcelle — a boutique marketing agency targeting mission-driven brands. Include goals, audience, channels, and KPIs to hit $700K yearly revenue.", cat: "Business" },
  { label: "Generate a Modern Invoice", text: "Generate a modern business invoice for Nova Studio charging Acme Corp $6,998.25 with 3 line items, tax 8.5%, due in 14 days.", cat: "Business" },
  { label: "Write a Business Plan Outline", text: "Write a business plan outline for a small creative studio — executive summary, market analysis, services, marketing & sales, operations, team, and financial plan.", cat: "Business" },
  { label: "Draft Meeting Notes", text: "Draft weekly sync meeting notes: sprint review, roadmap Q3, blockers, decisions, and action items with owners and due dates.", cat: "Meeting" },
  { label: "Create Research Brief", text: "Create a research brief on remote work's impact on urban design — abstract, introduction, literature review, analysis, and conclusion.", cat: "Academic" },
] as const;

const STYLE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "simple", label: "Simple English" },
] as const;
const FORMAT_OPTIONS = ["PDF", "DOCX", "Markdown"] as const;

export default function GeneratePage() {
  const [text, setText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<(typeof STYLE_OPTIONS)[number]["value"]>("professional");
  const [selectedFormat, setSelectedFormat] = useState<(typeof FORMAT_OPTIONS)[number]>("PDF");
  const [tplTheme, setTplTheme] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [docTheme, setDocTheme] = useState<DocumentTheme | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genStage, setGenStage] = useState<"idle" | "thinking" | "designing" | "writing" | "compiling">("idle");
  const [output, setOutput] = useState("");
  const [outputHtml, setOutputHtml] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [previewPage, setPreviewPage] = useState(0);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<string>("");
  const [templates, setTemplates] = useState<Template[]>(staticTemplates);
  const [gateMustSubscribe, setGateMustSubscribe] = useState(false);
  const [gateInfo, setGateInfo] = useState<{ generations: number; threshold: number }>({ generations: 0, threshold: 2 });
  const [gateEmail, setGateEmail] = useState("");
  const [gateError, setGateError] = useState<string | null>(null);
  const [gateSubmitting, setGateSubmitting] = useState(false);

function getClientSessionId(): string {
  try {
    const m = document.cookie.match(/(?:^|;\s*)dm_sid=([^;]+)/);
    if (m?.[1]) {
      try { localStorage.setItem("dm_sid", m[1]); } catch {}
      return m[1];
    }
    try {
      const ls = localStorage.getItem("dm_sid");
      if (ls) {
        document.cookie = `dm_sid=${ls}; path=/; max-age=${365 * 24 * 3600}; samesite=lax`;
        return ls;
      }
    } catch {}
    const id = (crypto as any)?.randomUUID
      ? (crypto as any).randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    try { localStorage.setItem("dm_sid", id); } catch {}
    document.cookie = `dm_sid=${id}; path=/; max-age=${365 * 24 * 3600}; samesite=lax`;
    return id;
  } catch {
    return "";
  }
}

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const touchStartX = useRef<number | null>(null);
  const tplFileRef = useRef<string | null>(null);

  const checkGate = async (sid?: string) => {
    try {
      const sessionId = sid || getClientSessionId();
      if (!sessionId) return;
      let email = "";
      try { email = localStorage.getItem("dm_email") || ""; } catch {}
      const qs = new URLSearchParams({ sessionId });
      if (email) qs.set("email", email);
      const res = await fetch(`/api/newsletter/status?${qs}`);
      const data = await res.json().catch(() => null);
      if (!data || data.enabled === false) {
        setGateMustSubscribe(false);
        return;
      }
      setGateInfo({ generations: data.generations ?? 0, threshold: data.threshold ?? 2 });
      setGateMustSubscribe(!!data.mustSubscribe);
    } catch {}
  };

  useEffect(() => {
    // Sitewide beacon now lives in <Tracker/> (root layout); here just check the gate.
    try {
      checkGate(getClientSessionId());
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep bottom nav hidden while the gate modal is open (same signal as preview modal).
  useEffect(() => {
    if (!gateMustSubscribe) return;
    document.body.dataset.modalOpen = "true";
    window.dispatchEvent(new CustomEvent("preview-modal-change", { detail: { open: true } }));
    return () => {
      if (!previewTemplate) {
        document.body.dataset.modalOpen = "false";
        window.dispatchEvent(new CustomEvent("preview-modal-change", { detail: { open: false } }));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gateMustSubscribe]);

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
    setText((prev) => {
      const cur = prev.trimEnd();
      if (!cur) return prompt;
      // Never replace the user's text — append. Skip exact duplicates.
      if (cur.includes(prompt)) return prev;
      return `${cur}\n\n${prompt}`;
    });
    textareaRef.current?.focus();
  };

  const generate = async () => {
    if ((!text.trim() && attachedFiles.length === 0) || generating) return;
    if (gateMustSubscribe) return;
    setGenerating(true);
    setGenStage("thinking");
    setOutput("");
    setOutputHtml("");
    setDocTheme(null);
    const controller = new AbortController();
    abortRef.current = controller;
    const sid = getClientSessionId();
    let failed = false;
    try {
      const form = new FormData();
      form.append("text", text);
      form.append("structure", "business");
      form.append("style", selectedStyle);
      form.append("format", selectedFormat.toLowerCase());
      if (selectedTemplate) form.append("templateId", selectedTemplate.id);
      attachedFiles.forEach((f) => form.append("files", f));

      const res = await fetch("/api/generate", {
        method: "POST",
        body: form,
        signal: controller.signal,
        headers: sid ? { "x-session-id": sid } : undefined,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed");
      }

      // Read stage events (SSE) — never render raw streamed content.
      const reader = res.body?.getReader();
      const dec = new TextDecoder();
      let buffer = "";
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += dec.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const evt = JSON.parse(line.slice(6));
              if (evt.stage === "done") {
                setOutput(evt.markdown || "");
                setOutputHtml(evt.html || "");
                setDocTheme(evt.themeConfig || null);
                setGenStage("idle");
              } else if (evt.stage === "error") {
                throw new Error(evt.error || "Generation failed");
              } else if (evt.stage) {
                setGenStage(evt.stage);
              }
            } catch (parseErr: any) {
              if (parseErr?.message && !parseErr.message.includes("JSON")) throw parseErr;
            }
          }
        }
      }
    } catch (e: any) {
      failed = true;
      if (e.name !== "AbortError") setOutput(`Error: ${e.message}`);
      setGenStage("idle");
    } finally {
      setGenerating(false);
      abortRef.current = null;
      if (!failed) checkGate(sid);
    }
  };

  const subscribeGate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setGateError(null);
    const email = gateEmail.trim();
    if (!email) {
      setGateError("Please enter your email address");
      return;
    }
    setGateSubmitting(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "gate" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Subscribe failed");
      try { localStorage.setItem("dm_email", email); } catch {}
      setGateMustSubscribe(false);
      setGateEmail("");
      textareaRef.current?.focus();
    } catch (err: any) {
      setGateError(err.message || "Subscribe failed");
    } finally {
      setGateSubmitting(false);
    }
  };

  const stop = () => abortRef.current?.abort();

  const applyTemplate = async (tpl: Template) => {
    setPreviewTemplate(null);
    setTplTheme("liceria");
    // Single template at a time: selecting a new one drops the previous
    // template's attached file (and its selection implicitly).
    if (tplFileRef.current) {
      const oldName = tplFileRef.current;
      tplFileRef.current = null;
      setAttachedFiles((prev) => prev.filter((f) => f.name !== oldName));
    }
    setSelectedTemplate(tpl);
    let attached = false;
    if (tpl.fileUrl) {
      try {
        const res = await fetch(tpl.fileUrl);
        const blob = await res.blob();
        const name = tpl.fileUrl.split("/").pop() || `${tpl.title}.pdf`;
        const file = new File([blob], name, { type: blob.type || "application/pdf" });
        attached = true;
        tplFileRef.current = name;
        setAttachedFiles((prev) => {
          if (prev.some((p) => p.name === file.name && p.size === file.size)) return prev;
          return [file, ...prev].slice(0, 3);
        });
      } catch {}
    }
    const guided = attached
      ? `<!-- ✎ Add your main content above — replace this line -->\nYour content here: \n\n---\nUse the attached template "${tpl.title}" as the exact structure and styling reference. Keep its sections, headings, and layout (see attached file), but replace the body with new content based on what I wrote above. Generate a complete, paginated document.\n`
      : `<!-- ✎ Add your main content above — this template's text is below for reference -->\nYour content here: \n\n---\nTemplate reference — "${tpl.title}":\n${tpl.content}\n\n---\nUsing the template above as structure, generate a new document with my content. Keep the same headings and flow.\n`;
    // Only insert the guided prompt when the input box is empty — never
    // replace or append to text the user already wrote.
    let inserted = false;
    setText((prev) => {
      if (prev.trim()) return prev;
      inserted = true;
      return guided;
    });
    if (inserted) {
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
    }
  };

  useEffect(() => { setPreviewPage(0); }, [previewTemplate]);

  const handleCreateTemplate = () => {
    window.location.href = "/upload/template";
  };

  useEffect(() => {
    const isOpen = !!previewTemplate;
    document.body.dataset.modalOpen = isOpen ? "true" : "false";
    document.body.style.overflow = isOpen ? "hidden" : "";
    window.dispatchEvent(new CustomEvent("preview-modal-change", { detail: { open: isOpen } }));
    return () => {
      document.body.dataset.modalOpen = "false";
      document.body.style.overflow = "";
      window.dispatchEvent(new CustomEvent("preview-modal-change", { detail: { open: false } }));
    };
  }, [previewTemplate]);

  const handleSwipeStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleSwipeEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !previewTemplate?.thumbnails) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0 && previewPage < previewTemplate.thumbnails.length - 1) setPreviewPage((p) => p + 1);
      else if (diff > 0 && previewPage > 0) setPreviewPage((p) => p - 1);
    }
    touchStartX.current = null;
  };

  const [downloading, setDownloading] = useState(false);

  // Derive a human filename from the generated document (first heading).
  const outputExt = selectedFormat.toLowerCase() === "docx" ? "docx" : selectedFormat.toLowerCase() === "markdown" ? "md" : "pdf";
  const docFileName = (() => {
    const h1 = outputHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const md = output.match(/^#\s+(.+)$/m);
    const raw = (h1 ? h1[1].replace(/<[^>]+>/g, " ") : md ? md[1] : "document")
      .replace(/&#?\w+;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const slug = raw
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
    return slug || "document";
  })();

  const downloadRendered = async () => {
    if ((!outputHtml.trim() && !output.trim()) || downloading) return;
    setDownloading(true);
    try {
      const fmt = selectedFormat.toLowerCase();
      // Markdown downloads the raw text directly.
      if (fmt === "markdown") {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([output], { type: "text/markdown" }));
        a.download = `${docFileName}.md`;
        a.click();
        URL.revokeObjectURL(a.href);
        return;
      }
      const themeName = tplTheme || "liceria";
      const payload: Record<string, unknown> = { format: fmt === "docx" ? "docx" : "pdf", theme: themeName };
      // Default flow (no template): reuse the exact dynamic design from generation.
      if (!outputHtml.trim()) {
        if (docTheme) payload.themeConfig = docTheme;
      }
      if (outputHtml.trim()) payload.html = outputHtml;
      else payload.markdown = output;
      const res = await fetch("/api/generate/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Render failed");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${docFileName}.${fmt === "docx" ? "docx" : "pdf"}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setOutput((p) => p + `\n\n[Download error: ${e.message}]`);
    } finally {
      setDownloading(false);
    }
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([output], { type: "text/markdown" }));
    a.download = `document.md`;
    a.click();
  };


  return (
    <div className="min-h-[calc(100dvh-64px)] bg-[#F8FAFC]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[720px] px-4 sm:px-6 py-6 sm:py-8 space-y-4">
          {/* Intent-Focused Hero Section — clean, no badges, tight 16px gap */}
          <div className="text-center sm:text-left">
            <h1 className="text-[30px] sm:text-[38px] font-bold tracking-[-0.03em] leading-[1.05] text-[#0F172A]">
              Generate Formatted Documents
              <span className="block text-[#2563EB]">In Seconds with AI</span>
            </h1>
          </div>

          {/* One-Click Prompt Templates — clickable pill cards */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold tracking-wide text-[#0F172A] uppercase">TRY A QUICK PROMPT</p>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-none">
              {EXAMPLE_PROMPTS.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => handlePromptClick(ex.text)}
                  className="shrink-0 snap-start inline-flex items-center gap-1.5 rounded-full border border-[#BFDBFE] border-blue-200 bg-[#EFF6FF] bg-blue-50 px-4 py-2 text-left hover:border-[#2563EB] hover:bg-[#DBEAFE] active:scale-95 transition-all"
                >
                  <span className="text-[12px] font-medium leading-4 text-[#0F172A] whitespace-nowrap">✨ {ex.label} <span aria-hidden>→</span></span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Area — un-stuck, directly under hero, with exposed controls */}
          <div className="rounded-[12px] border border-[#E2E8F0] bg-white shadow-xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.06)] focus-within:border-[#0F172A] focus-within:ring-1 focus-within:ring-[#0F172A] overflow-hidden">
            {/* Exposed Interactive Controls */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E8F0] bg-[#FAFAFA] px-3 py-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-[#475569]">Style</span>
                <div className="relative">
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value as any)}
                    className="appearance-none rounded-[6px] border border-[#E2E8F0] bg-white pl-2 pr-6 py-1 text-[12px] font-medium text-[#0F172A] focus:outline-none focus:border-[#0F172A]"
                  >
                    {STYLE_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
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
                  className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#0F172A] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-black shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Generate Document <span aria-hidden>→</span>
                </button>
              )}
            </div>
          </div>

          {/* Generation progress — animated, honest, never a static label */}
          {generating && (
            <GenerationProgress
              stage={genStage === "idle" ? "thinking" : genStage}
              templateTitle={selectedTemplate?.title ?? null}
            />
          )}

          {/* Minimal download card — the only post-generation UI */}
          {!generating && (outputHtml || output) && !output.startsWith("Error:") && (
            <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[#E2E8F0] bg-[#FAFAFA]">
                  <FileText className="h-4 w-4 text-[#3D4D4E]" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[#0F172A]">
                    {docFileName}.{outputExt}
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    {outputExt.toUpperCase()} ready{selectedTemplate ? ` • ${selectedTemplate.title}` : ""}
                  </p>
                </div>
                <button
                  onClick={downloadRendered}
                  disabled={downloading}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-[6px] bg-[#0F172A] px-4 py-2 text-[12px] font-semibold text-white hover:bg-black disabled:opacity-40"
                >
                  {downloading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
                  ) : (
                    <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
                  )}
                  Download {outputExt.toUpperCase()}
                </button>
                <button
                  onClick={() => { setOutput(""); setOutputHtml(""); }}
                  className="shrink-0 rounded-[6px] border border-[#E2E8F0] bg-white p-1.5 hover:bg-slate-50"
                  aria-label="Start over"
                  title="Start over"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-600" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          )}

          {/* Generation error */}
          {!generating && output.startsWith("Error:") && (
            <div className="rounded-[10px] border border-red-200 bg-red-50 p-4">
              <p className="text-[12px] font-medium text-red-700">{output.replace(/^Error:\s*/, "")}</p>
              <button
                onClick={() => setOutput("")}
                className="mt-2 rounded-[6px] border border-red-200 bg-white px-3 py-1.5 text-[12px] font-medium text-red-700 hover:bg-red-50"
              >
                Try again
              </button>
            </div>
          )}

          {/* Templates — kept below input for discovery */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 min-w-0">
                <LayoutGrid className="h-3.5 w-3.5 text-[#475569] shrink-0" strokeWidth={1.5} />
                <p className="text-[11px] font-semibold tracking-wide text-[#0F172A] uppercase">Templates</p>
                <span className="rounded-[6px] border border-[#E2E8F0] bg-[#FAFAFA] px-1.5 py-0.5 text-[10px] font-medium text-[#475569]">{templates.length}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleCreateTemplate}
                  className="inline-flex items-center gap-1 rounded-[6px] bg-[#0F172A] px-2 py-1 text-[11px] font-semibold text-white hover:bg-black active:scale-[0.98]"
                >
                  + Add Template
                </button>
                <a href="/templates" className="inline-flex items-center gap-1 rounded-[6px] border border-[#E2E8F0] bg-white px-2 py-1 text-[11px] font-medium text-[#0F172A] hover:bg-slate-50">
                  See all <ArrowUp className="h-3 w-3 rotate-45" strokeWidth={1.5} />
                </a>
              </div>
            </div>
            {templates.length === 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-2.5 sm:overflow-visible sm:pb-0">
                <button
                  onClick={handleCreateTemplate}
                  className="group shrink-0 w-[48%] snap-start flex flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] hover:bg-white hover:border-[#0F172A] p-6 text-center transition-colors sm:w-auto min-h-[260px]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-dashed border-[#CBD5E1] group-hover:border-[#0F172A] transition-colors">
                    <span className="text-[22px] font-light leading-none text-[#475569] group-hover:text-[#0F172A]">+</span>
                  </div>
                  <p className="text-[13px] font-semibold text-[#0F172A]">Create Template</p>
                  <p className="text-[11px] text-[#64748B]">Create or Upload Template</p>
                </button>
                {[0, 1].map((i) => (
                  <div key={i} className="hidden sm:flex flex-col items-center justify-center gap-2 p-5 text-center rounded-[10px] border border-dashed border-[#E2E8F0] bg-white min-h-[260px]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#E2E8F0] bg-[#FAFAFA]">
                      <FileUp className="h-4 w-4 text-[#475569]" strokeWidth={1.5} />
                    </div>
                    <span className="text-[11px] font-medium text-[#475569]">Empty slot</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:gap-2.5 sm:overflow-visible sm:pb-0">
                <button
                  onClick={handleCreateTemplate}
                  className="group shrink-0 w-[48%] snap-start flex flex-col items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] hover:bg-white hover:border-[#0F172A] p-6 text-center transition-colors sm:w-auto min-h-[260px]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-dashed border-[#CBD5E1] group-hover:border-[#0F172A] transition-colors">
                    <span className="text-[22px] font-light leading-none text-[#475569] group-hover:text-[#0F172A]">+</span>
                  </div>
                  <p className="text-[13px] font-semibold text-[#0F172A]">Create Template</p>
                  <p className="text-[11px] text-[#64748B]">Create or Upload Template</p>
                </button>
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setPreviewTemplate(tpl)}
                    className="group shrink-0 w-[48%] snap-start overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white text-left hover:border-[#CBD5E1] hover:bg-[#FAFAFA] transition-colors sm:w-auto"
                  >
                    <div className="h-[195px] sm:h-[300px] border-b border-[#E2E8F0] bg-[#F8FAFC] p-2">
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
        <div data-full-modal className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className="flex shrink-0 items-center justify-between border-b border-[#E2E8F0] bg-white px-4 py-3">
            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-semibold text-[#0F172A]">{previewTemplate.title}</h2>
              <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-[#475569]">
                <User className="h-3 w-3 shrink-0" strokeWidth={1.5} /> <span className="truncate">{previewTemplate.author}</span>
                <span className="rounded-[6px] border border-[#E2E8F0] bg-[#FAFAFA] px-1.5 py-0.5 text-[10px] font-medium text-[#0F172A]">{previewTemplate.category}</span>
              </p>
            </div>
            <button onClick={() => setPreviewTemplate(null)} className="ml-3 shrink-0 rounded-[6px] border border-[#E2E8F0] bg-white p-2 hover:bg-slate-50" aria-label="Close">
              <X className="h-4 w-4 text-[#475569]" strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-[#F8FAFC] p-4">
            {previewTemplate.fileUrl ? (
              previewTemplate.thumbnails && previewTemplate.thumbnails.length > 0 ? (
                <div className="space-y-3">
                  <div
                    className="relative overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white group"
                    onTouchStart={handleSwipeStart}
                    onTouchEnd={handleSwipeEnd}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewTemplate.thumbnails[previewPage]} alt={`Page ${previewPage + 1}`} className="w-full object-contain select-none" draggable={false} />
                    {previewPage > 0 && (
                      <button
                        onClick={() => setPreviewPage((p) => Math.max(0, p - 1))}
                        aria-label="Previous page"
                        className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur border border-[#E2E8F0] shadow-md hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5 text-[#0F172A]" strokeWidth={1.75} />
                      </button>
                    )}
                    {previewPage < previewTemplate.thumbnails.length - 1 && (
                      <button
                        onClick={() => setPreviewPage((p) => Math.min(previewTemplate.thumbnails.length - 1, p + 1))}
                        aria-label="Next page"
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur border border-[#E2E8F0] shadow-md hover:bg-white transition-colors"
                      >
                        <ChevronRight className="h-5 w-5 text-[#0F172A]" strokeWidth={1.75} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[11px] font-medium text-[#475569]">Page {previewPage + 1} of {previewTemplate.thumbnails.length}</span>
                    <span className="h-3 w-px bg-[#E2E8F0]" aria-hidden />
                    <div className="flex gap-1.5">
                      {previewTemplate.thumbnails.map((_, i) => (
                        <button key={i} onClick={() => setPreviewPage(i)} aria-label={`Go to page ${i + 1}`} className={`h-1.5 w-6 rounded-full transition-colors ${i === previewPage ? "bg-[#0F172A]" : "bg-[#E2E8F0]"}`} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white" style={{ height: "60vh" }}>
                  <iframe src={previewTemplate.fileUrl} title={previewTemplate.title} className="h-full w-full border-0" />
                </div>
              )
            ) : (
              <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
                <DocumentPreview content={previewTemplate.content} category={previewTemplate.category} paginated />
              </div>
            )}
          </div>
          <div className="shrink-0 border-t border-[#E2E8F0] bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <button onClick={() => applyTemplate(previewTemplate)} className="w-full rounded-[10px] bg-[#0F172A] py-3 text-[14px] font-semibold text-white hover:bg-black active:scale-[0.99]">
              Use this template
            </button>
          </div>
        </div>
      )}

      {gateMustSubscribe && (
        <div data-full-modal className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/50 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-[12px] border border-[#E2E8F0] bg-white p-6 shadow-xl">
            <h2 className="text-[18px] font-bold tracking-tight text-[#0F172A]">Keep creating for free</h2>
            <p className="mt-1 text-[13px] leading-5 text-[#475569]">
              You&apos;ve used {gateInfo.generations} free generation{gateInfo.generations === 1 ? "" : "s"}. Subscribe to
              the newsletter to continue — no spam, unsubscribe anytime.
            </p>
            <form onSubmit={subscribeGate} className="mt-4 space-y-2">
              <input
                type="email"
                required
                value={gateEmail}
                onChange={(e) => setGateEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-[8px] border border-[#E2E8F0] bg-white px-3 py-2.5 text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]"
              />
              {gateError && <p className="text-[12px] text-red-600">{gateError}</p>}
              <button
                type="submit"
                disabled={gateSubmitting}
                className="w-full rounded-[8px] bg-[#0F172A] py-2.5 text-[13px] font-semibold text-white hover:bg-black disabled:opacity-50"
              >
                {gateSubmitting ? "Subscribing…" : "Subscribe & continue"}
              </button>
            </form>
            <p className="mt-3 text-center text-[11px] text-[#94A3B8]">We&apos;ll only email you product updates.</p>
          </div>
        </div>
      )}
    </div>
  );
}
