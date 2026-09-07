"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight, Sparkles, FileText, Globe, Layers, ArrowRight } from "lucide-react";
import { Brand } from "@/config/site";

const NAV_ITEMS = [
  { label: "AI Generate", href: "/generate", icon: Sparkles },
  { label: "PDF Tools", href: "/pdf", icon: FileText },
  { label: "Convert", href: "/convert", icon: Globe },
  { label: "Pricing", href: "/pricing", icon: null },
  { label: "Help", href: "/help", icon: null },
];

function MegaMenu({ label, children }: { label: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  return (
    <div
      className="relative"
      onMouseEnter={() => { clearTimeout(timer!); setIsOpen(true); }}
      onMouseLeave={() => setTimer(setTimeout(() => setIsOpen(false), 150))}
    >
      <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50">
        {label}
        <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
      </button>
      {isOpen && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl z-50"
          onMouseEnter={() => clearTimeout(timer!)}
          onMouseLeave={() => setTimer(setTimeout(() => setIsOpen(false), 150))}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          </svg>
          <span className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>Docmaker</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <MegaMenu label="Tools">
            <div className="grid grid-cols-5 gap-4 w-[850px]">
              {[
                { title: "AI Tools", color: Brand.navy, items: [
                  { label: "AI Generate", href: "/generate" },
                  { label: "AI Edit", href: "/edit-pdf" },
                  { label: "AI Q&A", href: "/qa" },
                  { label: "Summarize", href: "/summarize" },
                ]},
                { title: "PDF Tools", color: Brand.teal, items: [
                  { label: "Merge PDF", href: "/pdf/merge" },
                  { label: "Split PDF", href: "/pdf/split" },
                  { label: "Compress PDF", href: "/pdf/compress" },
                  { label: "All PDF Tools", href: "/pdf" },
                ]},
                { title: "Conversion", color: Brand.blue, items: [
                  { label: "Convert Files", href: "/convert" },
                  { label: "Audio", href: "/convert/audio" },
                  { label: "Video", href: "/convert/video" },
                  { label: "Image", href: "/convert/image" },
                ]},
                { title: "Document", color: Brand.navy, items: [
                  { label: "Document", href: "/convert/file" },
                  { label: "Mixed", href: "/convert/mixed" },
                ]},
                { title: "More", color: Brand.yellow, items: [
                  { label: "File Transfer", href: "/transfer" },
                ]},
              ].map((cat) => (
                <div key={cat.title}>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{cat.title}</p>
                  {cat.items.map((item) => (
                    <Link key={item.href} href={item.href} className="block py-1.5 text-sm text-slate-600 hover:text-slate-900 rounded-lg px-2 hover:bg-slate-50">
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </MegaMenu>
          <Link href="/pricing" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50">Pricing</Link>
        </nav>

        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 -mr-2">
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu - Simple full screen */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-white z-50 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between py-4 px-4 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.icon && <item.icon className="h-5 w-5 text-slate-400" />}
                  <span className="text-base font-medium text-slate-900">{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300" />
              </Link>
            ))}

            <div className="border-t border-slate-100 my-4" />

            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center py-3.5 rounded-2xl font-semibold text-white"
              style={{ backgroundColor: Brand.navy }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
