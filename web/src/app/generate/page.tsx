"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Sparkles, Paperclip, Mic, Loader2, Copy, Check, Download } from "lucide-react";
import Link from "next/link";
import { Brand } from "@/config/site";
import { DOCUMENT_TEMPLATES, TEMPLATE_PREVIEWS } from "@/lib/ai/prompts";

const TYPES = ["Auto", "Invoice", "Report", "Contract", "Proposal", "Resume", "Essay", "Letter", "Memo"];

export default function GeneratePage() {
  const [text, setText] = useState("");
  const [type, setType] = useState("Auto");
  const [generating, setGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
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

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([output], { type: "text/markdown" }));
    a.download = `document.md`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <h1 className="text-lg font-semibold text-slate-900">AI Generate</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Type selector — simple text row */}
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

        {/* Textarea */}
        <div>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe what you want to create..."
            rows={5}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#121660]/20 focus:border-[#121660] min-h-[120px]"
          />
          <div className="flex items-center justify-between mt-2 px-1">
            <div className="flex gap-2">
              <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600">
                <Paperclip className="h-3.5 w-3.5" /> Attach
              </button>
              <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600">
                <Mic className="h-3.5 w-3.5" /> Voice
              </button>
            </div>
            {pages > 0 && <span className="text-xs text-slate-400">~{pages} {pages === 1 ? "page" : "pages"}</span>}
          </div>
        </div>

        {/* Generate */}
        <button
          onClick={generate}
          disabled={!text.trim() || generating}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: Brand.navy }}
        >
          {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : <>Generate <Sparkles className="h-4 w-4" /></>}
        </button>

        {/* Output */}
        {output && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-500">Output</span>
              <div className="flex gap-1">
                <button onClick={copy} className="p-1.5 rounded hover:bg-slate-100"><Copy className="h-3.5 w-3.5 text-slate-400" /></button>
                <button onClick={download} className="p-1.5 rounded hover:bg-slate-100"><Download className="h-3.5 w-3.5 text-slate-400" /></button>
              </div>
            </div>
            <div ref={outputRef} className="p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">{output}</pre>
            </div>
          </div>
        )}

        {/* Templates */}
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Templates</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {TEMPLATE_PREVIEWS.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => { setType(tpl.category.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")); setText(tpl.prompt); }}
                className="flex-shrink-0 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 hover:border-slate-300 transition-colors text-left"
              >
                {tpl.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
