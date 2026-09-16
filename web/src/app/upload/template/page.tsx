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
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center px-4 py-10">
      <form onSubmit={handleUpload} className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <h1 className="text-lg font-bold text-slate-900">Upload template</h1>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`rounded-xl border-2 border-dashed p-6 text-center transition-colors ${dragOver ? "border-[#121660] bg-[#121660]/5" : "border-slate-200 bg-slate-50"}`}
        >
          <input
            id="file"
            type="file"
            accept=".pdf,.docx,.txt,.csv,.xlsx,.png,.jpg,.jpeg,.webp,.md"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="file" className="cursor-pointer block">
            <p className="text-sm font-medium text-slate-700">{file ? file.name : "Drop PDF/DOCX here or click to browse"}</p>
            <p className="text-xs text-slate-400 mt-1">PDF, DOCX, TXT, images — 50 MB max</p>
          </label>
          {file && <p className="text-xs text-green-600 mt-2">{(file.size/1024/1024).toFixed(2)} MB</p>}
        </div>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-slate-600">Title *</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Modern Business Invoice" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#121660]/20 focus:border-[#121660]" />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block space-y-1">
            <span className="text-xs font-medium text-slate-600">Author</span>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g. Sophia Chen" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-slate-600">Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-slate-600">Description</span>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        </label>

        <button disabled={uploading} className="w-full rounded-xl bg-[#121660] text-white py-2.5 text-sm font-semibold disabled:opacity-50">
          {uploading ? "Uploading…" : "Upload"}
        </button>
        {done && <p className="text-sm text-green-600 text-center">{done}</p>}
      </form>
    </div>
  );
}
