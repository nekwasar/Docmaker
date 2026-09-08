"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import { Brand } from "@/config/site";

const TOOLS_ITEMS = [
  { label: "AI Generate", href: "/generate" },
  { label: "AI Edit", href: "/edit-pdf" },
  { label: "AI Q&A", href: "/qa" },
  { label: "Summarize", href: "/summarize" },
  { label: "Merge PDF", href: "/pdf/merge" },
  { label: "Split PDF", href: "/pdf/split" },
  { label: "Compress PDF", href: "/pdf/compress" },
  { label: "All PDF Tools", href: "/pdf" },
  { label: "Convert Files", href: "/convert" },
  { label: "Audio Convert", href: "/convert/audio" },
  { label: "Video Convert", href: "/convert/video" },
  { label: "Image Convert", href: "/convert/image" },
];

function DesktopMegaMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const enter = useCallback(() => { clearTimeout(timer.current!); setOpen(true); }, []);
  const leave = useCallback(() => { timer.current = setTimeout(() => setOpen(false), 120); }, []);

  useEffect(() => () => { clearTimeout(timer.current!); }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50">
        Tools <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[420px] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl z-50" onMouseEnter={enter} onMouseLeave={leave}>
          <div className="grid grid-cols-3 gap-1">
            {TOOLS_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 whitespace-nowrap">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#121660" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 5h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/>
            <path d="M12 5V3.5A1.5 1.5 0 0 1 13.5 2h3A1.5 1.5 0 0 1 18 3.5v3a1.5 1.5 0 0 1-1.5 1.5H15"/>
            <line x1="10" y1="10" x2="14" y2="10"/>
            <line x1="10" y1="13" x2="13" y2="13"/>
            <line x1="10" y1="16" x2="14" y2="16"/>
          </svg>
          <span className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>Docmaker</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <DesktopMegaMenu />
          <Link href="/pricing" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50">Pricing</Link>
        </nav>

        <button onClick={() => { setMenuOpen(!menuOpen); setMobileSubmenu(null); }} className="lg:hidden p-2 -mr-2">
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-white z-50 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Tools with submenu */}
            <div className="border-b border-slate-100 pb-4 mb-2">
              <button
                onClick={() => setMobileSubmenu(mobileSubmenu === "tools" ? null : "tools")}
                className="w-full flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50"
              >
                <span className="text-base font-semibold text-slate-900">Tools</span>
              </button>
              {mobileSubmenu === "tools" && (
                <div className="mt-2 ml-4 space-y-1">
                  <Link href="/generate" onClick={() => setMenuOpen(false)} className="block py-2.5 px-4 text-sm text-slate-700 rounded-lg hover:bg-slate-50">AI Generate</Link>
                  <Link href="/pdf" onClick={() => setMenuOpen(false)} className="block py-2.5 px-4 text-sm text-slate-700 rounded-lg hover:bg-slate-50">PDF Tools</Link>
                  <Link href="/convert" onClick={() => setMenuOpen(false)} className="block py-2.5 px-4 text-sm text-slate-700 rounded-lg hover:bg-slate-50">Convert Files</Link>
                </div>
              )}
            </div>

            {/* Resources with submenu */}
            <div className="border-b border-slate-100 pb-4 mb-2">
              <button
                onClick={() => setMobileSubmenu(mobileSubmenu === "resources" ? null : "resources")}
                className="w-full flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50"
              >
                <span className="text-base font-semibold text-slate-900">Resources</span>
              </button>
              {mobileSubmenu === "resources" && (
                <div className="mt-2 ml-4 space-y-1">
                  <Link href="/help" onClick={() => setMenuOpen(false)} className="block py-2.5 px-4 text-sm text-slate-700 rounded-lg hover:bg-slate-50">Help Center</Link>
                  <Link href="/blog" onClick={() => setMenuOpen(false)} className="block py-2.5 px-4 text-sm text-slate-700 rounded-lg hover:bg-slate-50">Blog</Link>
                  <Link href="/about" onClick={() => setMenuOpen(false)} className="block py-2.5 px-4 text-sm text-slate-700 rounded-lg hover:bg-slate-50">About</Link>
                  <Link href="/contact" onClick={() => setMenuOpen(false)} className="block py-2.5 px-4 text-sm text-slate-700 rounded-lg hover:bg-slate-50">Contact</Link>
                  <Link href="/enterprise" onClick={() => setMenuOpen(false)} className="block py-2.5 px-4 text-sm text-slate-700 rounded-lg hover:bg-slate-50">Enterprise</Link>
                </div>
              )}
            </div>

            <Link href="/pricing" onClick={() => setMenuOpen(false)} className="block py-4 px-4 text-base font-semibold text-slate-900 rounded-xl hover:bg-slate-50">Pricing</Link>

            <div className="pt-6">
              <Link href="/signup" onClick={() => setMenuOpen(false)} className="block w-full text-center py-3.5 rounded-2xl font-semibold text-white" style={{ backgroundColor: Brand.navy }}>
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
