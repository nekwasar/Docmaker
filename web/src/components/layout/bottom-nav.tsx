"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, X, Sparkles, FileText, Globe, ArrowUpDown, Plus, LayoutGrid, Search } from "lucide-react";
import { useState, useEffect } from "react";

export function BottomNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (!searchOpen) return;
    setSearchLoading(true);
    fetch("/api/templates/list?limit=50")
      .then((r) => r.json())
      .then((d) => setSearchResults(Array.isArray(d.templates) ? d.templates : []))
      .catch(() => setSearchResults([]))
      .finally(() => setSearchLoading(false));
  }, [searchOpen]);

  const filtered = query.trim()
    ? searchResults.filter((t: any) => `${t.title} ${t.description ?? ""} ${t.category}`.toLowerCase().includes(query.toLowerCase()))
    : searchResults;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const isHome = pathname === "/";

  return (
    <>
      {/* Bottom Sticky Navigation — Permanently Visible, Translucent, Safe-Area Aware */}
      <div
        className="fixed left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-[#0F172A]/85 px-1.5 py-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.25),0_2px_8px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all"
        style={{
          bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))",
          paddingBottom: "calc(0.375rem + env(safe-area-inset-bottom, 0px))",
        }}
        role="navigation"
        aria-label="Primary"
      >
        {/* Home */}
        <Link
          href="/"
          className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium transition-colors ${
            isHome ? "bg-white text-[#0F172A] shadow-sm" : "text-white/90 hover:bg-white/10 hover:text-white"
          }`}
          aria-current={isHome ? "page" : undefined}
        >
          <Home className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          <span className={`${isHome ? "inline" : "hidden sm:inline"} text-[13px]`}>Home</span>
        </Link>

        {/* Templates — directly accessible */}
        <Link
          href="/templates"
          className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium transition-colors ${
            isActive("/templates") ? "bg-white text-[#0F172A] shadow-sm" : "text-white/90 hover:bg-white/10 hover:text-white"
          }`}
        >
          <LayoutGrid className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          <span className="hidden sm:inline">Templates</span>
        </Link>

        {/* Search — replaces + New Doc */}
        <button
          onClick={() => setSearchOpen(true)}
          className="ml-0.5 inline-flex items-center justify-center rounded-full bg-white p-2.5 text-[#0F172A] shadow-sm transition hover:bg-white/90 active:scale-[0.98]"
          aria-label="Search templates"
        >
          <Search className="h-4 w-4" strokeWidth={2} />
        </button>

        {/* Divider */}
        <span className="mx-1 h-6 w-px bg-white/15" aria-hidden />

        {/* Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex items-center justify-center rounded-full p-2.5 transition-colors ${menuOpen ? "bg-white text-[#0F172A]" : "bg-white/10 text-white hover:bg-white/15"}`}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="h-4 w-4" strokeWidth={2} /> : <Menu className="h-4 w-4" strokeWidth={2} />}
        </button>
      </div>

      {/* Menu Overlay — streamlined */}
      {menuOpen && (
        <div className="fixed inset-0 z-[9998] bg-[#0F172A]/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute left-1/2 w-[92vw] max-w-sm -translate-x-1/2 rounded-[16px] border border-[#E2E8F0] bg-white p-2 shadow-2xl"
            style={{ bottom: "calc(5rem + env(safe-area-inset-bottom, 0px))" }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Menu"
          >
            <div className="grid gap-1 p-1">
              {[
                { label: "AI Generate", href: "/generate", icon: <Sparkles className="h-4 w-4" strokeWidth={1.75} />, desc: "Create docs with AI" },
                { label: "PDF Tools", href: "/pdf", icon: <FileText className="h-4 w-4" strokeWidth={1.75} />, desc: "Merge, split, compress" },
                { label: "Convert", href: "/convert", icon: <Globe className="h-4 w-4" strokeWidth={1.75} />, desc: "Files & formats" },
                { label: "Transfer", href: "/transfer", icon: <ArrowUpDown className="h-4 w-4" strokeWidth={1.75} />, desc: "Send files" },
                { label: "Pricing", href: "/pricing", icon: null, desc: "Plans & billing" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between rounded-[10px] px-3 py-2.5 transition-colors ${isActive(item.href) ? "bg-[#F8FAFC] border border-[#E2E8F0]" : "hover:bg-[#F8FAFC] border border-transparent"}`}
                >
                  <span className="flex items-center gap-3">
                    {item.icon && <span className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-[#E2E8F0] bg-white text-[#475569]">{item.icon}</span>}
                    <span>
                      <span className="block text-[13px] font-medium leading-4 text-[#0F172A]">{item.label}</span>
                      <span className="block text-[11px] leading-3 text-[#64748B]">{item.desc}</span>
                    </span>
                  </span>
                  <span className="text-[#94A3B8]">›</span>
                </Link>
              ))}
            </div>
            <div className="mt-1 border-t border-[#E2E8F0] p-2">
              <Link
                href="/upload/template"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-[10px] bg-[#0F172A] px-3 py-2.5 text-[13px] font-semibold text-white hover:bg-black"
              >
                <Plus className="h-4 w-4" /> Upload template
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Template Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[9998] bg-[#0F172A]/40 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <div
            className="absolute left-1/2 top-[10vh] w-[92vw] max-w-lg -translate-x-1/2 rounded-[16px] border border-[#E2E8F0] bg-white shadow-2xl flex flex-col max-h-[70vh]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Search templates"
          >
            <div className="flex items-center gap-2 border-b border-[#E2E8F0] p-3">
              <Search className="h-4 w-4 text-[#64748B] shrink-0" strokeWidth={1.75} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates…"
                className="flex-1 bg-transparent text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
              />
              <button onClick={() => setSearchOpen(false)} className="rounded-[8px] p-1.5 hover:bg-[#F8FAFC] text-[#475569]">
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
            <div className="overflow-y-auto p-2">
              {searchLoading ? (
                <p className="p-6 text-center text-[13px] text-[#64748B]">Loading…</p>
              ) : filtered.length === 0 ? (
                <p className="p-6 text-center text-[13px] text-[#64748B]">{query ? "No matches" : "Type to search"}</p>
              ) : (
                <div className="grid gap-1">
                  {filtered.slice(0, 20).map((t: any) => (
                    <Link
                      key={t.id}
                      href={`/?template=${t.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 rounded-[10px] border border-transparent px-3 py-2.5 hover:border-[#E2E8F0] hover:bg-[#F8FAFC]"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-[#E2E8F0] bg-white text-[#475569]">
                        <FileText className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium leading-4 text-[#0F172A]">{t.title}</span>
                        <span className="block truncate text-[11px] leading-3 text-[#64748B]">{t.category} • {t.description?.slice(0, 60) ?? ""}</span>
                      </span>
                      <span className="text-[#94A3B8]">›</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-[#E2E8F0] p-2 text-center">
              <Link href="/templates" onClick={() => setSearchOpen(false)} className="text-[12px] font-medium text-[#0F172A] hover:underline">
                Browse all templates →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
