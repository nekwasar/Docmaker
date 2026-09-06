"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, Download, Loader2, Copy, Check, X, ArrowRight } from "lucide-react";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";

interface User {
  id: string;
  email: string;
  name: string | null;
}

export default function TransferPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"send" | "receive" | null>(null);
  const [transferCode] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalPhase, setModalPhase] = useState<"initial" | "redirecting">("initial");
  const [receiveCode, setReceiveCode] = useState("");
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
        if (!data.user) setShowModal(true);
      })
      .catch(() => { setLoading(false); setShowModal(true); });
  }, []);

  useEffect(() => {
    if (!showModal) return;
    const t1 = setTimeout(() => setModalPhase("redirecting"), 2000);
    const t2 = setTimeout(() => router.push("/signup?callbackUrl=/transfer"), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [showModal, router]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setModalPhase("initial");
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) closeModal();
  };

  const copyCode = () => {
    try {
      navigator.clipboard.writeText(transferCode);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = transferCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <ToolPageLayout title="File Transfer" color="yellow">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      </ToolPageLayout>
    );
  }

  return (
    <ToolPageLayout title="File Transfer" color="yellow">
      <div className="space-y-8">
        <p className="text-lg text-slate-600">Send files between your devices instantly.</p>

        {user ? (
          <>
            <p className="text-sm text-slate-400">Logged in as {user.name || user.email}</p>
            {!mode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button onClick={() => setMode("send")} className="p-8 rounded-2xl border border-slate-200 hover:border-[#FFD140] transition-colors bg-white hover:shadow-md text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#FFD140]/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-[#FFD140]" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Send Files</h3>
                  <p className="text-slate-500">Share files to another device</p>
                </button>
                <button onClick={() => setMode("receive")} className="p-8 rounded-2xl border border-slate-200 hover:border-[#FFD140] transition-colors bg-white hover:shadow-md text-center">
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
                  <button onClick={copyCode} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy Code"}
                  </button>
                </div>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center bg-white cursor-pointer hover:border-[#FFD140] transition-colors">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-lg font-semibold text-slate-900 mb-2">Drop files here or click to upload</p>
                  <p className="text-sm text-slate-500">Files will be sent once the receiver enters the code</p>
                </div>
                <button onClick={() => setMode(null)} className="text-sm text-slate-500 hover:text-slate-700">← Back to options</button>
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
                    value={receiveCode}
                    onChange={(e) => setReceiveCode(e.target.value.toUpperCase())}
                    placeholder="Enter 6-character code"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center text-2xl font-bold tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-[#FFD140]/20 focus:border-[#FFD140]"
                  />
                  <button
                    onClick={() => {
                      if (!receiveCode || receiveCode.length < 6) return;
                      setConnecting(true);
                      setTimeout(() => {
                        setConnecting(false);
                        alert(`Connected to code: ${receiveCode}\n\nFile transfer is coming soon.`);
                      }, 1500);
                    }}
                    disabled={!receiveCode || receiveCode.length < 6 || connecting}
                    className="w-full mt-4 py-3 rounded-xl bg-[#FFD140] text-slate-900 font-semibold hover:bg-[#e6bc3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {connecting ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Connecting...</>
                    ) : (
                      "Connect & Receive"
                    )}
                  </button>
                </div>
                <button onClick={() => setMode(null)} className="text-sm text-slate-500 hover:text-slate-700">← Back to options</button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-6 opacity-30 pointer-events-none">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl border border-slate-200 bg-white text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#FFD140]/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-[#FFD140]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Send Files</h3>
                <p className="text-slate-500">Share files to another device</p>
              </div>
              <div className="p-8 rounded-2xl border border-slate-200 bg-white text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#FFD140]/10 flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-[#FFD140]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Receive Files</h3>
                <p className="text-slate-500">Get files from another device</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={handleBackdropClick}>
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
            <button onClick={closeModal} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors">
              <X className="h-5 w-5 text-slate-400" />
            </button>
            <div className="w-16 h-16 rounded-2xl bg-[#FFD140]/10 flex items-center justify-center mx-auto mb-6">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#FFD140" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 5h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/>
                <path d="M12 5V3.5A1.5 1.5 0 0 1 13.5 2h3A1.5 1.5 0 0 1 18 3.5v3a1.5 1.5 0 0 1-1.5 1.5H15"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Transfer Files Securely</h2>
            <p className="text-slate-500 text-sm mb-6">Create an account to store and transfer files securely between your devices.</p>
            <button
              onClick={() => router.push("/signup?callbackUrl=/transfer")}
              disabled={modalPhase === "redirecting"}
              className="w-full flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white bg-[#121660] hover:bg-[#0f1250] transition-all disabled:opacity-70"
            >
              {modalPhase === "redirecting" ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Redirecting...</>
              ) : (
                <>Create Free Account <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
            <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#FFD140] transition-all duration-1000 ease-linear" style={{ width: modalPhase === "redirecting" ? "100%" : "33%" }} />
            </div>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
