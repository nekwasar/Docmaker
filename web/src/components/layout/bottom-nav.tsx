"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, X, Sparkles, FileText, Globe, ArrowUpDown, Plus, LayoutGrid } from "lucide-react";
import { useState } from "react";

export function BottomNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

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

        {/* Primary CTA — + New Doc */}
        <Link
          href="/generate"
          className="ml-0.5 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#0F172A] shadow-sm transition hover:bg-white/90 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          <span>New Doc</span>
        </Link>

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
    </>
  );
}
