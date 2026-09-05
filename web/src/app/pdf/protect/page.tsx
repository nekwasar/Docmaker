"use client";

import { useState } from "react";
import { PdfToolLayout } from "@/components/pdf/pdf-tool-layout";
import { Brand } from "@/config/site";

export default function ProtectPdfPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(true);
  const [allowModifying, setAllowModifying] = useState(true);

  const handleProcess = async (files: File[], options: Record<string, any>) => {
    if (!password) throw new Error("Please enter a password");
    if (password !== confirmPassword) throw new Error("Passwords do not match");
    if (password.length < 4) throw new Error("Password must be at least 4 characters");

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("password", password);
    formData.append("allowPrinting", String(allowPrinting));
    formData.append("allowCopying", String(allowCopying));
    formData.append("allowModifying", String(allowModifying));

    const res = await fetch("/api/pdf/encrypt", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Protect failed");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${files[0].name.replace(/\.pdf$/i, "")}-protected.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <PdfToolLayout
      title="Protect PDF"
      description="Add password protection to your PDF"
      color={Brand.navy}
      maxFiles={1}
      accept=".pdf"
      onProcess={handleProcess}
    >
      {({ files }) => (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#121660]/20 focus:border-[#121660]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#121660]/20 focus:border-[#121660]"
            />
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Permissions</label>
            <div className="space-y-3">
              {[
                { id: "printing", label: "Allow printing", checked: allowPrinting, onChange: setAllowPrinting },
                { id: "copying", label: "Allow copying text and images", checked: allowCopying, onChange: setAllowCopying },
                { id: "modifying", label: "Allow modifying the document", checked: allowModifying, onChange: setAllowModifying },
              ].map((perm) => (
                <label key={perm.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={perm.checked}
                    onChange={(e) => perm.onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#121660] focus:ring-[#121660]"
                  />
                  <span className="text-sm text-slate-600">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
}
