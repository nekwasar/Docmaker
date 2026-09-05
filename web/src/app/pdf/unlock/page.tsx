"use client";

import { useState } from "react";
import { PdfToolLayout } from "@/components/pdf/pdf-tool-layout";
import { Brand } from "@/config/site";

export default function UnlockPdfPage() {
  const [password, setPassword] = useState("");

  const handleProcess = async (files: File[]) => {
    if (!password) throw new Error("Please enter the password");

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("password", password);

    const res = await fetch("/api/pdf/unlock", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Unlock failed");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${files[0].name.replace(/\.pdf$/i, "")}-unlocked.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <PdfToolLayout
      title="Unlock PDF"
      description="Remove password protection from your PDF"
      color={Brand.navy}
      maxFiles={1}
      accept=".pdf"
      onProcess={handleProcess}
    >
      {() => (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter the PDF password"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#121660]/20 focus:border-[#121660]"
            />
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 text-amber-700">
            <svg className="h-5 w-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="text-sm">
              <p className="font-medium">You need the password</p>
              <p className="mt-1 text-amber-600">
                You must know the password to unlock this PDF. We cannot bypass or crack password
                protection. The password is only used to open the file and is never stored.
              </p>
            </div>
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
}
