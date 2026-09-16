"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { templates as staticTemplates } from "@/data/templates";
import { DocumentPreview } from "@/components/generate/DocumentPreview";
import type { Template } from "@/data/templates";

const categories = ["All", "Business", "Legal", "Education", "HR"] as const;

export default function TemplatesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [templates, setTemplates] = useState<Template[]>(staticTemplates);

  useEffect(() => {
    fetch("/api/templates/list?limit=100")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.templates) && d.templates.length > 0) {
          const mapped: Template[] = d.templates.map((t: any) => ({
            id: t.id,
            title: t.title,
            author: t.author || t.user?.name || "Docmaker",
            category: (t.category as Template["category"]) || "Business",
            thumbnails: Array.isArray(t.thumbnails) && t.thumbnails.length ? t.thumbnails : [],
            content: t.content || t.prompt || t.description || "",
          }));
          setTemplates(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = templates.filter((t) => {
    const matchCat = cat === "All" || t.category === cat;
    const matchQ = !q || t.title.toLowerCase().includes(q.toLowerCase()) || t.author.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900">Templates</h1>
        <p className="text-sm text-slate-500 mt-2">Choose a starting structure — real document previews, not placeholder images.</p>

        <div className="mt-6 flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search templates"
            className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#121660]/20"
          />
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${cat === c ? "bg-[#121660] text-white" : "bg-white border border-slate-200 text-slate-600"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-600">No templates match.</p>
            <p className="text-xs text-slate-400 mt-1">
              {templates.length === 0 ? (
                <>No templates uploaded yet — <a href="/upload/template" className="text-[#121660] underline">upload a template</a>.</>
              ) : (
                <>Try a different search or category.</>
              )}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {filtered.map((tpl) => (
              <Link key={tpl.id} href={`/?template=${tpl.id}`} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all group">
                <div className="h-[180px] bg-[#EEF1F5] p-3 overflow-hidden">
                  <div className="bg-white rounded-sm shadow-sm overflow-hidden h-full border border-slate-100">
                    <DocumentPreview content={tpl.content} category={tpl.category} scale={0.28} />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-[#121660]">{tpl.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{tpl.author} • {tpl.category}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
