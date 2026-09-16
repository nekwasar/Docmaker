"use client";

import { Loader2, Sparkles, X, FileText, Megaphone } from "lucide-react";

type AgentStatus = "idle" | "analyzing" | "generating" | "thinking";

interface TopStatusSlotProps {
  agentStatus: AgentStatus;
  agentText?: string;
  adAvailable?: boolean;
  adTitle?: string;
  adBody?: string;
  onCloseAd?: () => void;
  activeFile?: File | null;
  onRemoveFile?: () => void;
  compact?: boolean;
}

export function TopStatusSlot({
  agentStatus,
  agentText,
  adAvailable = false,
  adTitle = "Sponsored — New templates weekly",
  adBody = "Get 5 premium business templates. Limited time.",
  onCloseAd,
  activeFile,
  onRemoveFile,
}: TopStatusSlotProps) {
  // State 1: Agent Activity / Thinking — highest priority
  if (agentStatus !== "idle") {
    const label =
      agentText ??
      (agentStatus === "analyzing"
        ? "Agent is analyzing document..."
        : agentStatus === "generating"
          ? "Generating response..."
          : agentStatus === "thinking"
            ? "Agent is thinking..."
            : "Agent is working...");

    return (
      <div className="flex items-center gap-3 rounded-[10px] border border-[#E2E8F0] bg-white px-3 py-2.5">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-30" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <Loader2 className="h-3.5 w-3.5 animate-spin text-[#475569] shrink-0" strokeWidth={1.5} />
        <span className="text-[12px] font-medium text-[#0F172A]">{label}</span>
        <span className="ml-auto hidden sm:inline-flex items-center gap-1 text-[11px] text-[#475569]">
          <Sparkles className="h-3 w-3" strokeWidth={1.5} /> AI
        </span>
      </div>
    );
  }

  // State 2: Promotional / Ad Slot
  if (adAvailable) {
    return (
      <div className="relative overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-[#FAFAFA] px-3 py-3 sm:py-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-2.5">
            <span className="shrink-0 rounded-[6px] border border-[#E2E8F0] bg-white px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-[#475569]">Sponsored</span>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold leading-4 text-[#0F172A] truncate">{adTitle}</p>
              <p className="text-[11px] leading-4 text-[#475569] line-clamp-1">{adBody}</p>
            </div>
          </div>
          {onCloseAd && (
            <button onClick={onCloseAd} aria-label="Dismiss ad" className="shrink-0 rounded-[6px] p-1 hover:bg-white">
              <X className="h-3.5 w-3.5 text-[#475569]" strokeWidth={1.5} />
            </button>
          )}
        </div>
        {/* Placeholder dimensions for future dynamic ads — keep 60-90px tall on desktop, compact on mobile */}
        <div className="mt-2 hidden sm:flex h-[56px] items-center justify-center rounded-[8px] border border-dashed border-[#E2E8F0] bg-white text-[11px] text-[#94A3B8]">
          Ad placeholder — 680×56
        </div>
      </div>
    );
  }

  // State 3: Idle / Compact — show file chip if present, otherwise hide to save space
  if (activeFile) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-[10px] border border-[#E2E8F0] bg-white px-2.5 py-1.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-[#0F172A] min-w-0">
          <FileText className="h-3.5 w-3.5 text-[#475569] shrink-0" strokeWidth={1.5} />
          <span className="truncate max-w-[180px] sm:max-w-[260px]">{activeFile.name}</span>
          <span className="hidden sm:inline text-[#94A3B8]">• {(activeFile.size / 1024).toFixed(1)} KB</span>
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Ready
        </span>
        {onRemoveFile && (
          <button onClick={onRemoveFile} aria-label="Remove file" className="ml-1 shrink-0 rounded-[6px] p-1 hover:bg-slate-50">
            <X className="h-3 w-3 text-[#475569]" strokeWidth={1.5} />
          </button>
        )}
      </div>
    );
  }

  // No agent, no ad, no file → hide entirely (saves vertical space on mobile)
  // Alternatively, return a tiny pill if you want to keep something visible:
  // return <div className="flex justify-center"><span className="rounded-full border bg-white px-2 py-0.5 text-[11px] text-[#475569]">Idle</span></div>;
  return null;
}
