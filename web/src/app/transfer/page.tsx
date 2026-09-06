"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSendTransfer, useReceiveTransfer } from "@/hooks/useTransfer";
import { Upload, Download, Loader2, Copy, Check, X, ArrowRight, Shield, Clock, Users, Trash2 } from "lucide-react";
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
  const [showModal, setShowModal] = useState(false);
  const [modalPhase, setModalPhase] = useState<"initial" | "redirecting">("initial");

  // Send state
  const [sendFile, setSendFile] = useState<File | null>(null);
  const [retentionDays, setRetentionDays] = useState(1);
  const [maxDownloads, setMaxDownloads] = useState(1);
  const [copied, setCopied] = useState(false);
  const { progress: sendProgress, transferInfo, sendFile: doSend, cleanup: cleanupSend } = useSendTransfer();

  // Receive state
  const [receiveCode, setReceiveCode] = useState("");
  const { progress: receiveProgress, fileInfo, receiveFile, cleanup: cleanupReceive } = useReceiveTransfer();

  // Check auth
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

  // Modal auto-redirect
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
    if (!transferInfo?.code) return;
    try {
      navigator.clipboard.writeText(transferInfo.code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = transferInfo.code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = async () => {
    if (!sendFile) return;
    try {
      await doSend(sendFile, retentionDays, maxDownloads);
    } catch (error) {
      console.error("Send error:", error);
    }
  };

  const handleReceive = async () => {
    if (!receiveCode || receiveCode.length < 6) return;
    try {
      await receiveFile(receiveCode.toUpperCase());
    } catch (error) {
      console.error("Receive error:", error);
    }
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

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  return (
    <ToolPageLayout title="File Transfer" color="yellow">
      <div className="space-y-8">
        {/* Security Banner */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200">
          <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-800">End-to-End Encrypted</p>
            <p className="text-xs text-green-600">Files are encrypted on your device before upload. The server never sees your data.</p>
          </div>
        </div>

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
              <SendView
                file={sendFile}
                setFile={setSendFile}
                retentionDays={retentionDays}
                setRetentionDays={setRetentionDays}
                maxDownloads={maxDownloads}
                setMaxDownloads={setMaxDownloads}
                progress={sendProgress}
                transferInfo={transferInfo}
                onSend={handleSend}
                onBack={() => { setMode(null); setSendFile(null); }}
                copied={copied}
                onCopy={copyCode}
                formatSize={formatSize}
              />
            ) : (
              <ReceiveView
                code={receiveCode}
                setCode={setReceiveCode}
                progress={receiveProgress}
                fileInfo={fileInfo}
                onReceive={handleReceive}
                onBack={() => { setMode(null); setReceiveCode(""); }}
                formatSize={formatSize}
              />
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

      {/* Auth Modal */}
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

// Send View Component
function SendView({ file, setFile, retentionDays, setRetentionDays, maxDownloads, setMaxDownloads, progress, transferInfo, onSend, onBack, copied, onCopy, formatSize }: any) {
  const [dragActive, setDragActive] = useState(false);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-900">Send Files</h3>

      {transferInfo ? (
        // Code display
        <div className="text-center p-8 border-2 border-dashed border-[#FFD140] rounded-2xl bg-[#FFD140]/5">
          <p className="text-sm text-slate-500 mb-2">Share this code with the receiver</p>
          <p className="text-5xl font-bold tracking-widest text-[#FFD140]">{transferInfo.code}</p>
          <p className="text-xs text-slate-400 mt-2">Expires: {new Date(transferInfo.expiresAt).toLocaleString()}</p>
          <button onClick={onCopy} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy Code"}
          </button>
          {progress.phase === "complete" && (
            <p className="mt-3 text-sm text-green-600 font-medium">Transfer ready! Waiting for receiver...</p>
          )}
        </div>
      ) : (
        <>
          {/* File upload */}
          <div
            className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
              dragActive ? "border-[#FFD140] bg-[#FFD140]/5" : file ? "border-green-300 bg-green-50" : "border-slate-300 bg-white hover:border-[#FFD140]"
            }`}
            onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
            }}
            onClick={() => document.getElementById("send-file-input")?.click()}
          >
            <input id="send-file-input" type="file" className="hidden" onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])} />
            {file ? (
              <div className="space-y-2">
                <p className="font-semibold text-slate-900">{file.name}</p>
                <p className="text-sm text-slate-500">{formatSize(file.size)}</p>
                <p className="text-xs text-slate-400">Click to change file</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-10 w-10 mx-auto text-slate-400" />
                <p className="text-lg font-semibold text-slate-900">Drop a file here or click to upload</p>
                <p className="text-sm text-slate-500">Maximum 500MB</p>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> Expires after
              </label>
              <select value={retentionDays} onChange={(e) => setRetentionDays(parseInt(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD140]/20 focus:border-[#FFD140]">
                <option value={1}>1 day</option>
                <option value={3}>3 days</option>
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <Users className="h-4 w-4" /> Max downloads
              </label>
              <select value={maxDownloads} onChange={(e) => setMaxDownloads(parseInt(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD140]/20 focus:border-[#FFD140]">
                <option value={1}>1 download</option>
                <option value={5}>5 downloads</option>
                <option value={10}>10 downloads</option>
                <option value={50}>50 downloads</option>
              </select>
            </div>
          </div>
        </>
      )}

      {/* Progress */}
      {progress.phase !== "idle" && progress.phase !== "complete" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">{progress.message}</span>
            <span className="text-slate-500">{progress.percent}%</span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#FFD140] rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} />
          </div>
        </div>
      )}

      {/* Error */}
      {progress.phase === "error" && (
        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{progress.message}</div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button onClick={onBack} className="px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
          ← Back
        </button>
        {!transferInfo && (
          <button
            onClick={onSend}
            disabled={!file || progress.phase === "uploading" || progress.phase === "encrypting"}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white bg-[#FFD140] hover:bg-[#e6bc3a] text-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {progress.phase === "uploading" || progress.phase === "encrypting" ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
            ) : (
              <>Send File</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// Receive View Component
function ReceiveView({ code, setCode, progress, fileInfo, onReceive, onBack, formatSize }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-slate-900">Receive Files</h3>
      <p className="text-slate-600">Enter the 6-character code from the sender.</p>

      <div className="p-6 border border-slate-200 rounded-2xl bg-white space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">Transfer Code</label>
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter 6-character code"
            disabled={progress.phase === "downloading" || progress.phase === "decrypting"}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center text-2xl font-bold tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-[#FFD140]/20 focus:border-[#FFD140] disabled:opacity-50"
          />
        </div>

        {/* File info */}
        {fileInfo && (
          <div className="p-3 rounded-xl bg-slate-50 text-sm">
            <p className="font-medium text-slate-900">{fileInfo.fileName}</p>
            <p className="text-slate-500">{formatSize(fileInfo.fileSize)}</p>
          </div>
        )}

        {/* Progress */}
        {progress.phase !== "idle" && progress.phase !== "complete" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">{progress.message}</span>
              <span className="text-slate-500">{progress.percent}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#FFD140] rounded-full transition-all duration-300" style={{ width: `${progress.percent}%` }} />
            </div>
          </div>
        )}

        {/* Error */}
        {progress.phase === "error" && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">{progress.message}</div>
        )}

        {/* Complete */}
        {progress.phase === "complete" && (
          <div className="p-3 rounded-xl bg-green-50 text-green-700 text-sm flex items-center gap-2">
            <Check className="h-4 w-4" /> Download complete!
          </div>
        )}

        <button
          onClick={onReceive}
          disabled={!code || code.length < 6 || progress.phase === "downloading" || progress.phase === "decrypting" || progress.phase === "complete"}
          className="w-full py-3 rounded-xl bg-[#FFD140] text-slate-900 font-semibold hover:bg-[#e6bc3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {progress.phase === "downloading" || progress.phase === "decrypting" ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Downloading...</>
          ) : (
            "Connect & Receive"
          )}
        </button>
      </div>

      <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-700">← Back to options</button>
    </div>
  );
}
