"use client";

import { useState } from "react";

const CATEGORIES = ["Business", "Personal", "Academic", "Meeting", "Legal"] as const;

export default function UploadTemplatePage() {
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Business");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title required");
    if (!file && !description) return alert("Attach a file or add description");
    setUploading(true);
    setDone(null);
    const form = new FormData();
    form.set("title", title);
    form.set("author", author || "Docmaker");
    form.set("category", category);
    form.set("description", description);
    form.set("isPublic", "true");
    if (file) form.set("file", file);
    else form.set("prompt", description);
    const res = await fetch("/api/upload/template", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) return alert(data.error || "Upload failed");
    setDone(data.template?.id ? `Uploaded — ${data.template.title}` : "Uploaded");
    setTitle(""); setAuthor(""); setDescription(""); setFile(null);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <form onSubmit={handleUpload} className="w-full max-w-[560px] bg-white border border-[#E2E8F0] rounded-[10px] p-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-[16px] font-semibold tracking-[-0.01em] text-[#0F172A]">Upload template</h1>
          <p className="text-[12px] leading-4 text-[#475569]">Public uploader — anyone can upload. Files appear on the homepage after upload.</p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`rounded-[10px] border border-dashed p-6 text-center transition-colors ${dragOver ? "border-[#0F172A] bg-slate-50" : "border-[#E2E8F0] bg-[#FAFAFA]"}`}
        >
          <input
            id="file"
            type="file"
            accept=".pdf,.docx,.txt,.csv,.xlsx,.png,.jpg,.jpeg,.webp,.md"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="file" className="cursor-pointer block">
            <p className="text-[13px] font-medium text-[#0F172A]">{file ? file.name : "Drop PDF/DOCX here or click to browse"}</p>
            <p className="text-[11px] text-[#475569] mt-1">PDF, DOCX, TXT, images — 50 MB max</p>
          </label>
          {file && <p className="text-[11px] text-emerald-600 mt-2">{(file.size/1024/1024).toFixed(2)} MB</p>}
        </div>

        <label className="block space-y-1">
          <span className="text-[11px] font-medium tracking-wide text-[#475569] uppercase">Title *</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Modern Business Invoice" className="w-full rounded-[6px] border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]" />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1">
            <span className="text-[11px] font-medium tracking-wide text-[#475569] uppercase">Author</span>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g. Sophia Chen" className="w-full rounded-[6px] border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#0F172A] placeholder:text-[#94A3B8]" />
          </label>
          <label className="block space-y-1">
            <span className="text-[11px] font-medium tracking-wide text-[#475569] uppercase">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-[6px] border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#0F172A]">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-[11px] font-medium tracking-wide text-[#475569] uppercase">Description</span>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" className="w-full rounded-[6px] border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#0F172A] placeholder:text-[#94A3B8]" />
        </label>

        <button disabled={uploading} className="w-full rounded-[6px] bg-[#0F172A] py-2.5 text-[13px] font-semibold text-white hover:bg-black disabled:opacity-40">
          {uploading ? "Uploading…" : "Upload"}
        </button>
        {done && <p className="text-[13px] text-emerald-600 text-center">{done}</p>}
      </form>
    </div>
  );
}
