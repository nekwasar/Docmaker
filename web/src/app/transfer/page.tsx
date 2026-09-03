"use client";

import { useState } from "react";
import { Upload, Download, ArrowUpDown, QrCode } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";

export default function TransferPage() {
  const [mode, setMode] = useState<"send" | "receive" | null>(null);
  const [transferCode] = useState("ABC123");

  return (
    <ToolPageLayout title="File Transfer" color="yellow">
      <div className="space-y-8">
        <p className="text-lg text-slate-600">Send files between your devices instantly.</p>

        {!mode ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <AnimatedPressable
              onPress={() => setMode("send")}
              className="p-8 rounded-lg border border-slate-200 hover:border-[#FFD140] transition-colors cursor-pointer text-center"
            >
              <Upload className="h-12 w-12 mx-auto mb-4" style={{ color: '#FFD140' }} />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Send Files</h3>
              <p className="text-slate-500">Share files to another device</p>
            </AnimatedPressable>
            <AnimatedPressable
              onPress={() => setMode("receive")}
              className="p-8 rounded-lg border border-slate-200 hover:border-[#FFD140] transition-colors cursor-pointer text-center"
            >
              <Download className="h-12 w-12 mx-auto mb-4" style={{ color: '#FFD140' }} />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Receive Files</h3>
              <p className="text-slate-500">Get files from another device</p>
            </AnimatedPressable>
          </div>
        ) : mode === "send" ? (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900">Send Files</h3>
            <p className="text-slate-600">Share this code with the receiving device.</p>
            <div className="text-center p-8 border-2 border-dashed border-slate-300 rounded-lg">
              <p className="text-5xl font-bold tracking-widest" style={{ color: '#FFD140' }}>{transferCode}</p>
              <p className="text-sm text-slate-500 mt-4">Expires in 24 hours</p>
            </div>
            <button
              onClick={() => setMode(null)}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              ← Back
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900">Receive Files</h3>
            <p className="text-slate-600">Enter the code from the sending device.</p>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-[#FFD140] focus:border-transparent"
              maxLength={6}
            />
            <button
              disabled
              className="w-full py-4 px-6 rounded-full text-base font-semibold text-white transition-all disabled:opacity-50"
              style={{ backgroundColor: '#FFD140', color: '#0F172A' }}
            >
              Receive Files
            </button>
            <button
              onClick={() => setMode(null)}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
