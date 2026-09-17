"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { templates as staticTemplates } from "@/data/templates";
import { DocumentPreview } from "@/components/generate/DocumentPreview";
import type { Template } from "@/data/templates";
import { Search, User, FileText, X, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

const categories = ["All", "Business", "Personal", "Academic", "Meeting", "Legal"] as const;

export default function TemplatesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>(staticTemplates);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [previewPage, setPreviewPage] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const handleSwipeStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleSwipeEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !previewTemplate?.thumbnails) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0 && previewPage < previewTemplate.thumbnails.length - 1) setPreviewPage((p) => p + 1);
      else if (diff > 0 && previewPage > 0) setPreviewPage((p) => p - 1);
    }
    touchStartX.current = null;
  };

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

  useEffect(() => {
    const isOpen = !!previewTemplate;
    document.body.dataset.modalOpen = isOpen ? "true" : "false";
    document.body.style.overflow = isOpen ? "hidden" : "";
    window.dispatchEvent(new CustomEvent("preview-modal-change", { detail: { open: isOpen } }));
    return () => {
      document.body.dataset.modalOpen = "false";
      document.body.style.overflow = "";
      window.dispatchEvent(new CustomEvent("preview-modal-change", { detail: { open: false } }));
    };
  }, [previewTemplate]);

  const filtered = templates.filter((t) => {
    const matchCat = cat === "All" || t.category === cat;
    const matchQ = !q || t.title.toLowerCase().includes(q.toLowerCase()) || t.author.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  const handleCreateTemplate = () => {
    window.location.href = "/upload/template";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-6 sm:py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[32px] font-bold tracking-[-0.03em] leading-[1.05] text-[#0F172A]">Templates</h1>
            <p className="text-[13px] sm:text-[14px] leading-5 text-[#64748B] mt-2">Choose a starting structure — real document previews, not placeholder images.</p>
          </div>
          <button
            onClick={handleCreateTemplate}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-[8px] bg-[#0F172A] px-3 py-2 sm:px-4 sm:py-2.5 text-[13px] font-semibold text-white hover:bg-black active:scale-[0.98] shadow-sm"
          >
            <span className="text-[16px] leading-none">+</span>
            <span className="hidden sm:inline">Create Template</span>
            <span className="sm:hidden" aria-hidden>+</span>
          </button>
        </div>

        <div className="mt-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" strokeWidth={1.5} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search templates"
              className="w-full pl-9 pr-4 py-2.5 rounded-[8px] border border-[#E2E8F0] bg-white text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A]"
            />
          </div>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            aria-label="Filter templates"
            aria-expanded={filterOpen}
            className={`flex shrink-0 items-center justify-center gap-1.5 rounded-[8px] border px-3 py-2.5 text-[12px] font-medium transition-colors ${filterOpen || cat !== "All" ? "border-[#0F172A] bg-[#0F172A] text-white" : "border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#FAFAFA] hover:border-[#CBD5E1]"}`}
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} />
            <span className="hidden sm:inline">Filter</span>
            {cat !== "All" && <span className="hidden sm:inline rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">{cat}</span>}
          </button>
        </div>
        {filterOpen && (
          <div className="mt-3 flex flex-wrap gap-2 rounded-[10px] border border-[#E2E8F0] bg-white p-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCat(c);
                  setFilterOpen(false);
                }}
                className={`rounded-[6px] border px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors ${cat === c ? "bg-[#0F172A] border-[#0F172A] text-white" : "bg-[#FAFAFA] border-[#E2E8F0] text-[#475569] hover:bg-white hover:border-[#CBD5E1]"}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 && templates.length !== 0 ? (
          <div className="mt-8 rounded-[10px] border border-dashed border-[#E2E8F0] bg-white p-8 text-center">
            <p className="text-[13px] font-medium text-[#0F172A]">No templates match.</p>
            <p className="text-[12px] text-[#64748B] mt-1">Try a different search or category.</p>
          </div>
        ) : (
          <>
            <button
              onClick={handleCreateTemplate}
              className="group flex w-full items-center justify-center gap-2 rounded-[10px] border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] hover:bg-white hover:border-[#0F172A] px-4 py-4 text-center transition-colors mt-6"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-dashed border-[#CBD5E1] group-hover:border-[#0F172A] transition-colors text-[18px] font-light leading-none text-[#475569] group-hover:text-[#0F172A]">+</span>
              <span className="text-[13px] font-semibold text-[#0F172A]">Add Template</span>
              <span className="text-[11px] text-[#64748B]">Create or Upload — anyone can upload</span>
            </button>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 mt-6 justify-items-center">
            {filtered.length === 0 ? (
              <div className="col-span-2 sm:col-span-3 lg:col-span-4 rounded-[10px] border border-dashed border-[#E2E8F0] bg-white p-8 text-center flex flex-col items-center justify-center min-h-[360px] w-full">
                <p className="text-[13px] font-medium text-[#0F172A]">No templates uploaded yet</p>
                <p className="text-[12px] text-[#64748B] mt-1">Be the first — your template stays forever.</p>
              </div>
            ) : (
              <>
            {filtered.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setPreviewTemplate(tpl)}
                className="group w-full max-w-[220px] text-left overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#FAFAFA] transition-colors"
              >
                <div className="h-[260px] sm:h-[300px] border-b border-[#E2E8F0] bg-[#F8FAFC] p-2">
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
              </>
            )}
          </div>
          </>
        )}
      </div>

      {previewTemplate && (
        <div data-full-modal className="fixed inset-0 z-50 flex flex-col bg-white">
          <div className="flex shrink-0 items-center justify-between border-b border-[#E2E8F0] bg-white px-4 py-3">
            <div className="min-w-0">
              <h2 className="truncate text-[15px] font-semibold text-[#0F172A]">{previewTemplate.title}</h2>
              <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] text-[#475569]">
                <User className="h-3 w-3 shrink-0" strokeWidth={1.5} /> <span className="truncate">{previewTemplate.author}</span>
                <span className="rounded-[6px] border border-[#E2E8F0] bg-[#FAFAFA] px-1.5 py-0.5 text-[10px] font-medium text-[#0F172A]">{previewTemplate.category}</span>
              </p>
            </div>
            <button onClick={() => setPreviewTemplate(null)} className="ml-3 shrink-0 rounded-[6px] border border-[#E2E8F0] bg-white p-2 hover:bg-slate-50" aria-label="Close">
              <X className="h-4 w-4 text-[#475569]" strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-[#F8FAFC] p-4">
            {previewTemplate.fileUrl ? (
              previewTemplate.thumbnails && previewTemplate.thumbnails.length > 0 ? (
                <div className="space-y-3">
                  <div
                    className="relative overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white group"
                    onTouchStart={handleSwipeStart}
                    onTouchEnd={handleSwipeEnd}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewTemplate.thumbnails[previewPage]} alt={`Page ${previewPage + 1}`} className="w-full object-contain select-none" draggable={false} />
                    {previewPage > 0 && (
                      <button
                        onClick={() => setPreviewPage((p) => Math.max(0, p - 1))}
                        aria-label="Previous page"
                        className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur border border-[#E2E8F0] shadow-md hover:bg-white transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5 text-[#0F172A]" strokeWidth={1.75} />
                      </button>
                    )}
                    {previewPage < previewTemplate.thumbnails.length - 1 && (
                      <button
                        onClick={() => setPreviewPage((p) => Math.min(previewTemplate.thumbnails.length - 1, p + 1))}
                        aria-label="Next page"
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur border border-[#E2E8F0] shadow-md hover:bg-white transition-colors"
                      >
                        <ChevronRight className="h-5 w-5 text-[#0F172A]" strokeWidth={1.75} />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-[11px] font-medium text-[#475569]">Page {previewPage + 1} of {previewTemplate.thumbnails.length}</span>
                    <span className="h-3 w-px bg-[#E2E8F0]" aria-hidden />
                    <div className="flex gap-1.5">
                      {previewTemplate.thumbnails.map((_, i) => (
                        <button key={i} onClick={() => setPreviewPage(i)} aria-label={`Go to page ${i + 1}`} className={`h-1.5 w-6 rounded-full transition-colors ${i === previewPage ? "bg-[#0F172A]" : "bg-[#E2E8F0]"}`} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-[10px] border border-[#E2E8F0] bg-white" style={{ height: "60vh" }}>
                  <iframe src={previewTemplate.fileUrl} title={previewTemplate.title} className="h-full w-full border-0" />
                </div>
              )
            ) : (
              <div className="rounded-[10px] border border-[#E2E8F0] bg-white p-4 shadow-sm">
                <DocumentPreview content={previewTemplate.content} category={previewTemplate.category} paginated />
              </div>
            )}
          </div>
          <div className="shrink-0 border-t border-[#E2E8F0] bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <Link href={`/?template=${previewTemplate.id}`} className="flex w-full items-center justify-center rounded-[10px] bg-[#0F172A] py-3 text-[14px] font-semibold text-white hover:bg-black active:scale-[0.99]">
              Use this template
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
