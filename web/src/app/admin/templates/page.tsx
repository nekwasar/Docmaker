"use client";

import { useEffect, useState } from "react";

type Template = {
  id: string;
  title: string;
  author?: string;
  category: string;
  description: string;
  prompt: string;
  content?: string;
  thumbnails?: string[] | null;
  fileUrl?: string | null;
  fileName?: string | null;
  downloads: number;
  createdAt: string;
};

const CATEGORIES = ["Business", "Personal", "Academic", "Meeting", "Legal"];

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Business");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/templates");
    const data = await res.json();
    setTemplates(data.templates || []);
    setLoading(false);
  };

  useEffect(() => { fetchList(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title required");
    if (!file && !description) return alert("Attach a file (PDF/DOCX) or add description");
    setUploading(true);
    const form = new FormData();
    form.set("title", title);
    form.set("author", author || "Docmaker");
    form.set("category", category);
    form.set("description", description);
    form.set("isPublic", "true");
    if (file) form.set("file", file);
    else form.set("prompt", description);
    const res = await fetch("/api/admin/templates", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) return alert(data.error || "Upload failed");
    setTitle(""); setAuthor(""); setDescription(""); setFile(null);
    fetchList();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this template? This removes the file and thumbnails.")) return;
    const res = await fetch(`/api/admin/templates/${id}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json().catch(()=>({})); return alert(d.error || "Delete failed"); }
    setTemplates(t => t.filter(x => x.id !== id));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Templates</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload your templates here. They will appear on the homepage and <code>/templates</code>. Existing hard-coded templates were removed — only what you upload here will be shown.
        </p>
      </div>

      <form onSubmit={handleUpload} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-slate-900">Upload new template</h2>

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
          <label htmlFor="file" className="cursor-pointer">
            <p className="text-sm font-medium text-slate-700">{file ? file.name : "Drop PDF/DOCX here or click to browse"}</p>
            <p className="text-xs text-slate-400 mt-1">PDF, DOCX, TXT, images — 50 MB max. We store the original and generate thumbnails.</p>
          </label>
          {file && <p className="text-xs text-green-600 mt-2">{(file.size/1024/1024).toFixed(2)} MB • {file.type || "file"}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">Title *</span>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Modern Business Invoice" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#121660]/20 focus:border-[#121660]" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">Author</span>
            <input value={author} onChange={e=>setAuthor(e.target.value)} placeholder="e.g. Sophia Chen" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#121660]/20 focus:border-[#121660]" />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">Category</span>
            <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white">
              {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-slate-600">Description (optional)</span>
            <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Short description shown in gallery" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#121660]/20 focus:border-[#121660]" />
          </label>
        </div>
        <p className="text-xs text-slate-400">If no file, description will be used as template content. With a file, we extract text for “Use this template” and keep the original PDF for download.</p>
        <button disabled={uploading} className="rounded-xl bg-[#121660] text-white px-5 py-2.5 text-sm font-semibold disabled:opacity-50">
          {uploading ? "Uploading…" : "Upload template"}
        </button>
      </form>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">All templates ({templates.length})</h2>
          <button onClick={fetchList} className="text-xs text-slate-500 hover:text-slate-700">Refresh</button>
        </div>
        {loading ? (
          <p className="p-6 text-sm text-slate-500">Loading…</p>
        ) : templates.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No templates yet — upload one above. The homepage “Templates” row will stay empty until you do.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {templates.map(t=> (
              <div key={t.id} className="px-5 py-4 flex gap-4 items-start">
                <div className="w-20 h-14 rounded-lg bg-[#EEF1F5] overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {t.thumbnails?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.thumbnails[0]} alt="" className="w-full h-full object-cover" />
                  ) : t.fileUrl?.endsWith(".pdf") ? (
                    <span className="text-[10px] text-slate-500">PDF</span>
                  ) : (
                    <span className="text-[10px] text-slate-400">No thumb</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{t.title}</p>
                  <p className="text-xs text-slate-500">{t.author || "—"} • {t.category} • {t.fileName || "no file"} {t.fileUrl && <a href={t.fileUrl} target="_blank" className="text-[#121660] underline ml-1">Open file</a>}</p>
                  <p className="text-xs text-slate-400 truncate mt-1">{t.description}</p>
                </div>
                <button onClick={()=>handleDelete(t.id)} className="text-xs font-medium text-red-600 hover:text-red-700 px-3 py-1 rounded-full border border-red-200 hover:bg-red-50">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
