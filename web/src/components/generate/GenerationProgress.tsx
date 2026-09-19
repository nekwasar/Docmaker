"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

type Stage = "thinking" | "designing" | "writing" | "compiling";

interface Props {
  stage: Stage;
  templateTitle?: string | null;
}

// Rotating micro-statuses (gerunds, concrete, honest).
// Research: the "labor illusion" — showing real, specific work reduces
// perceived wait time and builds trust. Never show a stalled static label.
const MESSAGES: Record<Stage, string[]> = {
  thinking: [
    "Reading your request",
    "Understanding the brief",
    "Planning the document structure",
  ],
  designing: [
    "Studying the template pages",
    "Extracting the colour palette",
    "Matching the typography",
    "Sketching the cover page",
    "Placing the header details",
    "Laying out the table of contents",
    "Composing the section pages",
    "Writing your content into the layout",
    "Checking the page breaks",
    "Polishing margins and spacing",
    "Finalising the design",
  ],
  writing: [
    "Drafting your document",
    "Structuring the sections",
    "Writing the body content",
    "Formatting headings and lists",
    "Reviewing the full draft",
  ],
  compiling: [
    "Compiling the pages",
    "Rendering the high-quality PDF",
    "Wrapping up",
  ],
};

// Progress asymptotes per stage — a creeping bar that never stalls, lies,
// or resets (UX Tigers / Nielsen: keep it honest and always moving).
const CEILING: Record<Stage, number> = {
  thinking: 14,
  designing: 90,
  writing: 90,
  compiling: 97,
};

const STEPS: Array<{ key: string; label: (tpl?: string | null) => string }> = [
  { key: "thinking", label: () => "Understanding your request" },
  { key: "content", label: (tpl) => (tpl ? "Studying the template design" : "Writing your content") },
  { key: "compiling", label: () => "Compiling the document" },
  { key: "ready", label: () => "Ready to download" },
];

function Dots() {
  return (
    <span className="inline-flex items-end gap-[3px] pb-[2px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-[3px] w-[3px] rounded-full bg-[#3D4D4E] animate-bounce"
          style={{ animationDelay: `${i * 160}ms`, animationDuration: "900ms" }}
        />
      ))}
    </span>
  );
}

export default function GenerationProgress({ stage, templateTitle }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(3);

  // Elapsed seconds
  useEffect(() => {
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Rotate the micro-status every 4.5s
  useEffect(() => {
    setMsgIdx(0);
    const t = setInterval(() => setMsgIdx((i) => i + 1), 4500);
    return () => clearInterval(t);
  }, [stage]);

  // Creeping progress toward the stage ceiling
  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        const ceiling = CEILING[stage] ?? 90;
        if (p >= ceiling) return p;
        return Math.min(ceiling, p + Math.max(0.4, (ceiling - p) * 0.04));
      });
    }, 900);
    return () => clearInterval(t);
  }, [stage]);

  const messages = MESSAGES[stage] ?? MESSAGES.thinking;
  const currentMessage = messages[msgIdx % messages.length];

  const stepState = (key: string): "done" | "active" | "pending" => {
    const order = ["thinking", "content", "compiling", "ready"];
    const activeIdx =
      stage === "thinking" ? 0 : stage === "designing" || stage === "writing" ? 1 : 2;
    const idx = order.indexOf(key);
    if (idx < activeIdx) return "done";
    if (idx === activeIdx) return "active";
    return "pending";
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(1, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="rounded-[10px] border border-[#E2E8F0] bg-white overflow-hidden">
      {/* Header row — live message + dots */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#3D4D4E]" strokeWidth={1.5} />
        <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-[#0F172A]">
          {currentMessage}
        </p>
        <Dots />
      </div>

      {/* Progress bar */}
      <div className="px-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EEF1F5]">
          <div
            className="h-full rounded-full bg-[#0F172A] transition-[width] duration-[900ms] ease-linear"
            style={{ width: `${Math.round(progress)}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-2 px-4 py-3.5">
        {STEPS.map((s) => {
          const state = stepState(s.key);
          const label = s.key === "content" && state === "active" ? currentMessage : s.label(templateTitle);
          return (
            <div key={s.key} className="flex items-center gap-2.5 text-[12px]">
              {state === "done" ? (
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200">
                  <Check className="h-2.5 w-2.5 text-emerald-600" strokeWidth={2.5} />
                </span>
              ) : state === "active" ? (
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#0F172A]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0F172A] animate-pulse" />
                </span>
              ) : (
                <span className="h-4 w-4 shrink-0 rounded-full border border-[#E2E8F0] bg-white" />
              )}
              <span
                className={
                  state === "done"
                    ? "text-[#64748B]"
                    : state === "active"
                      ? "font-medium text-[#0F172A]"
                      : "text-[#94A3B8]"
                }
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer — elapsed + honest expectation */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E8F0] bg-[#FAFAFA] px-4 py-2.5">
        <span className="text-[11px] text-[#64748B]">
          Elapsed {mm}:{ss} • usually takes 1–2 minutes
        </span>
        <span className="text-[11px] text-[#64748B]">
          Keep this tab open — your download will appear here.
        </span>
      </div>
    </div>
  );
}
