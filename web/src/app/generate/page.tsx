"use client";

import { useState } from "react";
import { Sparkles, Camera, Mic } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { Brand } from "@/config/site";

const STRUCTURES = ["Auto", "Invoice", "Report", "Contract", "Proposal", "Resume", "Essay", "Letter", "Memo"];

export default function GeneratePage() {
  const [text, setText] = useState("");
  const [structure, setStructure] = useState("Auto");

  return (
    <ToolPageLayout title="AI Generate" color="navy">
      <div className="space-y-6">
        {/* Structure Selector */}
        <div className="rounded-2xl bg-white border border-slate-200 p-4">
          <label className="block text-sm font-semibold text-slate-900 mb-2">Document Structure</label>
          <div className="flex flex-wrap gap-2">
            {STRUCTURES.map((s) => (
              <button
                key={s}
                onClick={() => setStructure(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  structure === s
                    ? "bg-[#121660] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div className="rounded-2xl bg-white border border-slate-200 p-4">
          <label className="block text-sm font-semibold text-slate-900 mb-2">Describe your document</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g., Create a professional invoice for web design services totaling $2,500..."
            className="w-full h-40 p-4 text-sm border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#121660] focus:border-transparent"
          />
          <div className="flex justify-end mt-2">
            <span className="text-xs text-slate-500">{text.length} characters</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all">
            <Camera className="h-4 w-4" />
            Add Image
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all">
            <Mic className="h-4 w-4" />
            Voice Input
          </button>
        </div>

        {/* Generate Button */}
        <button
          disabled={!text.trim()}
          className="w-full flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
          style={{ backgroundColor: Brand.navy }}
        >
          <Sparkles className="h-5 w-5" />
          Generate Document
        </button>
      </div>
    </ToolPageLayout>
  );
}
