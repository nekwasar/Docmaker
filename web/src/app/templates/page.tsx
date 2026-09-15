"use client";

import Link from "next/link";
import { useState } from "react";
import { templates } from "@/data/templates";
import { DocumentPreview } from "@/components/generate/DocumentPreview";

const categories = ["All", "Business", "Legal", "Education", "HR"] as const;

export default function TemplatesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

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
      </div>
    </div>
  );
}
