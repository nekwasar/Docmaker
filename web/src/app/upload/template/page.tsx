"use client";

import { useState } from "react";

export default function UploadTemplatePage() {
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setDone(null);
    const title = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim() || file.name;
    const form = new FormData();
    form.set("title", title);
    form.set("author", "Docmaker");
    form.set("category", "Business");
    form.set("description", "");
    form.set("isPublic", "true");
    form.set("file", file);
    const res = await fetch("/api/upload/template", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) return alert(data.error || "Upload failed");
    setDone(`Uploaded — ${data.template.title}`);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) uploadFile(f);
  };

  return (
    <div className="min-h-[calc(100dvh-64px)] bg-white flex items-center justify-center px-4 py-10">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`w-full max-w-[560px] rounded-[10px] border border-dashed p-12 text-center transition-colors ${dragOver ? "border-[#0F172A] bg-slate-50" : "border-[#E2E8F0] bg-[#FAFAFA]"}`}
      >
        <input
          id="file"
          type="file"
          accept=".pdf,.docx,.txt,.csv,.xlsx,.png,.jpg,.jpeg,.webp,.md"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }}
        />
        <label htmlFor="file" className="cursor-pointer block space-y-2">
          <p className="text-[14px] font-semibold text-[#0F172A]">{uploading ? "Uploading…" : done ? done : "Drop file here or click to browse"}</p>
          <p className="text-[11px] text-[#475569]">PDF, DOCX, TXT, images — 50 MB max • Title auto-filled from filename</p>
        </label>
      </div>
    </div>
  );
}
