"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Upload, Download, Loader2, Copy, Check, QrCode } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";

export default function TransferPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mode, setMode] = useState<"send" | "receive" | null>(null);
  const [transferCode] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());
  const [copied, setCopied] = useState(false);

  // Redirect to signup if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signup?callbackUrl=/transfer");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <ToolPageLayout title="File Transfer" color="yellow">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      </ToolPageLayout>
    );
  }

  if (!session) {
    return (
      <ToolPageLayout title="File Transfer" color="yellow">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          <span className="ml-3 text-slate-500">Redirecting to sign up...</span>
        </div>
      </ToolPageLayout>
    );
  }

  const copyCode = () => {
    navigator.clipboard.writeText(transferCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPageLayout title="File Transfer" color="yellow">
      <div className="space-y-8">
        <p className="text-lg text-slate-600">
          Send files between your devices instantly.
          <span className="text-sm text-slate-400 ml-2">
            Logged in as {session.user?.name || session.user?.email}
          </span>
        </p>

        {!mode ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={() => setMode("send")}
              className="p-8 rounded-2xl border border-slate-200 hover:border-[#FFD140] transition-colors cursor-pointer text-center bg-white hover:shadow-md"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#FFD140]/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-[#FFD140]" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Send Files</h3>
              <p className="text-slate-500">Share files to another device</p>
            </button>
            <button
              onClick={() => setMode("receive")}
              className="p-8 rounded-2xl border border-slate-200 hover:border-[#FFD140] transition-colors cursor-pointer text-center bg-white hover:shadow-md"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#FFD140]/10 flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-[#FFD140]" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Receive Files</h3>
              <p className="text-slate-500">Get files from another device</p>
            </button>
          </div>
        ) : mode === "send" ? (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900">Send Files</h3>
            <p className="text-slate-600">Share this code with the receiving device.</p>

            <div className="text-center p-8 border-2 border-dashed border-[#FFD140] rounded-2xl bg-[#FFD140]/5">
              <p className="text-5xl font-bold tracking-widest text-[#FFD140]">{transferCode}</p>
              <button
                onClick={copyCode}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center bg-white cursor-pointer hover:border-[#FFD140] transition-colors">
              <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p className="text-lg font-semibold text-slate-900 mb-2">Drop files here or click to upload</p>
              <p className="text-sm text-slate-500">Files will be sent once the receiver enters the code</p>
            </div>

            <button
              onClick={() => setMode(null)}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              ← Back to options
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900">Receive Files</h3>
            <p className="text-slate-600">Enter the code from the sending device.</p>

            <div className="p-6 border border-slate-200 rounded-2xl bg-white">
              <label className="block text-sm font-semibold text-slate-900 mb-2">Transfer Code</label>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-character code"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center text-2xl font-bold tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-[#FFD140]/20 focus:border-[#FFD140]"
              />
              <button className="w-full mt-4 py-3 rounded-xl bg-[#FFD140] text-slate-900 font-semibold hover:bg-[#e6bc3a] transition-colors">
                Connect & Receive
              </button>
            </div>

            <button
              onClick={() => setMode(null)}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              ← Back to options
            </button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
