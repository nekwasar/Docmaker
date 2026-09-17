"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { templates as staticTemplates } from "@/data/templates";
import { DocumentPreview } from "@/components/generate/DocumentPreview";
import type { Template } from "@/data/templates";
import { Search, User, FileText, X } from "lucide-react";

const categories = ["All", "Business", "Personal", "Academic", "Meeting", "Legal"] as const;

export default function TemplatesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [templates, setTemplates] = useState<Template[]>(staticTemplates);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [previewPage, setPreviewPage] = useState(0);

  useEffect(() => {
    fetch("/api/templates/list?limit=100")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.templates)) {
          const mapped: Template[] = d.templates.map((t: any) => ({
            id: t.id,
            title: t.title,
            author: t.author || t.user?.name || "Docmaker",
            category: (t.category as Template["category"]) || "Business",
            thumbnails: Array.isArray(t.thumbnails) && t.thumbnails.length ? t.thumbnails : [],
            content: t.content || t.prompt || t.description || "",
            fileUrl: t.fileUrl || null,
          }));
          setTemplates(mapped);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => { setPreviewPage(0); }, [previewTemplate]);

  const filtered = templates.filter((t) => {
    const matchCat = cat === "All" || t.category === cat;
    const matchQ = !q || t.title.toLowerCase().includes(q.toLowerCase()) || t.author.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h1 className="text-[28px] sm:text-[32px] font-bold tracking-[-0.03em] leading-[1.05] text-[#0F172A]">Templates</h1>
        <p className="text-[13px] sm:text-[14px] leading-5 text-[#64748B] mt-2">Choose a starting structure — real document previews, not placeholder images.</p>

        <div className="mt-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" strokeWidth={1.5} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search templates"
            className="w-full pl-9 pr-4 py-2.5 rounded-[8px] border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]"
          />
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 snap-start rounded-[6px] border px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors ${cat === c ? "bg-[#0F172A] border-[#0F172A] text-white" : "bg-white border-[#E2E8F0] text-[#475569] hover:bg-[#FAFAFA]"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-[10px] border border-dashed border-[#E2E8F0] bg-white p-8 text-center">
            <p className="text-[13px] font-medium text-[#0F172A]">No templates match.</p>
            <p className="text-[12px] text-[#64748B] mt-1">
              {templates.length === 0 ? (
                <>No templates uploaded yet — <a href="/upload/template" className="text-[#0F172A] font-medium underline hover:text-[#2563EB]">upload a template</a>.</>
              ) : (
                <>Try a different search or category.</>
              )}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-6">
            {filtered.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setPreviewTemplate(tpl)}
                className="group text-left overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#FAFAFA] transition-colors"
              >
                <div className="h-[320px] sm:h-[360px] border-b border-[#E2E8F0] bg-[#F8FAFC] p-2">
                  {tpl.fileUrl ? (
                    tpl.thumbnails && tpl.thumbnails.length > 0 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={tpl.thumbnails[0]} alt={tpl.title} className="h-full w-full object-contain rounded-[6px] border border-[#E2E8F0] bg-white" />
                    ) : (
                      <div className="flex h-full items-center justify-center rounded-[6px] border border-[#E2E8F0] bg-white p-2 text-center">
                        <div>
                          <FileText className="mx-auto h-5 w-5 text-[#475569]" strokeWidth={1.5} />
                          <p className="mt-1 text-[10px] font-medium text-[#475569]">PDF • {tpl.title.slice(0, 18)}</p>
                          <p className="text-[10px] text-[#94A3B8]">Tap to preview</p>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="h-full overflow-hidden rounded-[6px] border border-[#E2E8F0] bg-white">
                      <DocumentPreview content={tpl.content} category={tpl.category} scale={0.38} />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-[13px] font-semibold leading-none text-[#0F172A] group-hover:text-[#0F172A]">{tpl.title}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#475569]">
                    <User className="h-3 w-3" strokeWidth={1.5} /> {tpl.author}
                    <span className="ml-1 rounded-[4px] border border-[#E2E8F0] bg-[#FAFAFA] px-1 py-0 text-[10px] font-medium">{tpl.category}</span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button aria-label="Close preview" onClick={() => setPreviewTemplate(null)} className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-[2px]" />
          <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-4 py-3">
              <div>
                <h2 className="text-[14px] font-semibold text-[#0F172A]">{previewTemplate.title}</h2>
                <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-[#475569]">
                  <User className="h-3 w-3" strokeWidth={1.5} /> {previewTemplate.author}
                  <span className="rounded-[6px] border border-[#E2E8F0] bg-[#FAFAFA] px-1.5 py-0.5 text-[10px] font-medium text-[#0F172A]">{previewTemplate.category}</span>
                </p>
              </div>
              <button onClick={() => setPreviewTemplate(null)} className="rounded-[6px] border border-[#E2E8F0] bg-white p-1.5 hover:bg-slate-50" aria-label="Close">
                <X className="h-4 w-4 text-[#475569]" strokeWidth={1.5} />
              </button>
            </div>
            <div className="space-y-3 overflow-y-auto p-4">
              {previewTemplate.fileUrl ? (
                previewTemplate.thumbnails && previewTemplate.thumbnails.length > 0 ? (
                  <div className="space-y-3">
                    <div className="overflow-hidden rounded-[8px] border border-[#E2E8F0] bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewTemplate.thumbnails[previewPage]} alt={`Page ${previewPage + 1}`} className="w-full object-contain" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-[#475569]">Page {previewPage + 1} of {previewTemplate.thumbnails.length}</span>
                      <div className="flex gap-1">
                        <button disabled={previewPage === 0} onClick={() => setPreviewPage((p) => Math.max(0, p - 1))} className="rounded-[6px] border border-[#E2E8F0] bg-white px-2 py-1 text-[11px] disabled:opacity-40">Prev</button>
                        <button disabled={previewPage === previewTemplate.thumbnails.length - 1} onClick={() => setPreviewPage((p) => Math.min(previewTemplate.thumbnails.length - 1, p + 1))} className="rounded-[6px] border border-[#E2E8F0] bg-white px-2 py-1 text-[11px] disabled:opacity-40">Next</button>
                      </div>
                    </div>
                    <div className="flex justify-center gap-1.5">
                      {previewTemplate.thumbnails.map((_, i) => (
                        <button key={i} onClick={() => setPreviewPage(i)} aria-label={`Go to page ${i + 1}`} className={`h-1.5 w-6 rounded-full ${i === previewPage ? "bg-[#0F172A]" : "bg-[#E2E8F0]"}`} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-[8px] border border-[#E2E8F0] bg-white" style={{ height: 420 }}>
                    <iframe src={previewTemplate.fileUrl} title={previewTemplate.title} className="h-full w-full border-0" />
                  </div>
                )
              ) : (
                <div className="rounded-[8px] border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <DocumentPreview content={previewTemplate.content} category={previewTemplate.category} paginated />
                </div>
              )}
            </div>
            <div className="border-t border-[#E2E8F0] p-3">
              <Link href={`/?template=${previewTemplate.id}`} className="flex w-full items-center justify-center rounded-[6px] bg-[#0F172A] py-2.5 text-[13px] font-semibold text-white hover:bg-black">
                Use this template
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
