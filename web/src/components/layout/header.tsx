"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { Menu, X, ChevronDown, Sparkles, FileText, Globe, Timer, Layers } from "lucide-react";
import { Brand } from "@/config/site";

const TOOLS_MEGA = {
  categories: [
    {
      title: "AI Tools",
      icon: Sparkles,
      color: Brand.navy,
      items: [
        { label: "AI Generate", href: "/generate", description: "Create documents from text" },
        { label: "AI Edit", href: "/edit-pdf", description: "Edit with natural language" },
        { label: "AI Q&A", href: "/qa", description: "Ask about your docs" },
        { label: "Summarize", href: "/summarize", description: "Summarize documents" },
        { label: "Change Style", href: "/change-style", description: "Restyle documents" },
      ],
    },
    {
      title: "PDF Tools",
      icon: FileText,
      color: Brand.teal,
      items: [
        { label: "Merge PDF", href: "/pdf/merge", description: "Combine PDFs" },
        { label: "Split PDF", href: "/pdf/split", description: "Separate pages" },
        { label: "Compress PDF", href: "/pdf/compress", description: "Reduce file size" },
        { label: "Protect PDF", href: "/pdf/protect", description: "Password protect" },
        { label: "All PDF Tools", href: "/pdf", description: "10 tools available" },
      ],
    },
    {
      title: "Conversion",
      icon: Globe,
      color: Brand.blue,
      items: [
        { label: "Convert Files", href: "/convert", description: "38+ format pairs" },
        { label: "Audio", href: "/convert/audio", description: "MP3, WAV, AAC, FLAC" },
        { label: "Video", href: "/convert/video", description: "MP4, AVI, MOV, MKV" },
        { label: "Image", href: "/convert/image", description: "JPG, PNG, WEBP, GIF" },
        { label: "Document", href: "/convert/file", description: "DOCX, CSV, TXT, HTML" },
      ],
    },
    {
      title: "More Tools",
      icon: Timer,
      color: Brand.yellow,
      items: [
        { label: "File Transfer", href: "/transfer", description: "Mobile only" },
      ],
    },
  ],
};

const RESOURCES_MEGA = {
  categories: [
    {
      title: "Help",
      items: [
        { label: "Help Center", href: "/help" },
        { label: "FAQ", href: "/help#faq" },
        { label: "How It Works", href: "/how-it-works" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Blog",
      items: [
        { label: "All Posts", href: "/blog" },
        { label: "Tutorials", href: "/blog?tutorials" },
        { label: "Updates", href: "/blog?updates" },
      ],
    },
    {
      title: "Legals",
      items: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
      ],
    },
    {
      title: "Company",
      items: [
        { label: "About", href: "/about" },
        { label: "Pricing", href: "/pricing" },
        { label: "Mobile App", href: "/mobile" },
      ],
    },
  ],
};

function MegaMenu({ label, data }: { label: string; data: typeof TOOLS_MEGA }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  }, []);

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50">
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[850px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl z-50" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="grid grid-cols-5 gap-4">
            {data.categories.map((cat) => (
              <div key={cat.title}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: cat.color + "15" }}>
                    <cat.icon className="h-4 w-4" style={{ color: cat.color }} />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{cat.title}</span>
                </div>
                <ul className="space-y-1">
                  {cat.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="block rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Link href="/features" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
              View all tools →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function ResourcesMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  }, []);

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50">
        Resources
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[700px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl z-50" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="grid grid-cols-4 gap-4">
            {RESOURCES_MEGA.categories.map((cat) => (
              <div key={cat.title}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                    <Layers className="h-4 w-4 text-slate-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{cat.title}</span>
                </div>
                <ul className="space-y-1">
                  {cat.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="block rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<"main" | "tools" | "resources">("main");

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [mobileOpen]);

  const closeMenu = () => {
    setMobileOpen(false);
    setActiveSection("main");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#121660" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 5h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/>
              <path d="M12 5V3.5A1.5 1.5 0 0 1 13.5 2h3A1.5 1.5 0 0 1 18 3.5v3a1.5 1.5 0 0 1-1.5 1.5H15"/>
              <line x1="10" y1="10" x2="14" y2="10"/>
              <line x1="10" y1="13" x2="13" y2="13"/>
              <line x1="10" y1="16" x2="14" y2="16"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900" style={{ fontFamily: 'var(--font-playfair)' }}>Docmaker</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <MegaMenu label="Tools" data={TOOLS_MEGA} />
          <ResourcesMenu />
          <Link href="/pricing" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50">
            Pricing
          </Link>
        </nav>

        <button
          className="lg:hidden p-2 -mr-2"
          onClick={() => { setMobileOpen(!mobileOpen); setActiveSection("main"); }}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Full-Screen Menu */}
      <div
        className={`fixed inset-0 top-16 bg-white z-[60] lg:hidden overflow-y-auto transition-opacity duration-200 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {activeSection === "main" && (
            <div className="px-6 py-8 space-y-2">
              {/* Main Nav Items */}
              <button
                onClick={() => setActiveSection("tools")}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${Brand.navy}10` }}>
                    <Sparkles className="h-5 w-5" style={{ color: Brand.navy }} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">Tools</p>
                    <p className="text-xs text-slate-500">AI, PDF, Convert, and more</p>
                  </div>
                </div>
                <ChevronDown className="h-5 w-5 text-slate-400 -rotate-90" />
              </button>

              <button
                onClick={() => setActiveSection("resources")}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${Brand.blue}10` }}>
                    <Layers className="h-5 w-5" style={{ color: Brand.blue }} />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">Resources</p>
                    <p className="text-xs text-slate-500">Help, blog, and company info</p>
                  </div>
                </div>
                <ChevronDown className="h-5 w-5 text-slate-400 -rotate-90" />
              </button>

              <Link
                href="/pricing"
                onClick={closeMenu}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${Brand.teal}10` }}>
                    <span className="text-lg font-bold" style={{ color: Brand.teal }}>$</span>
                  </div>
                  <p className="font-semibold text-slate-900">Pricing</p>
                </div>
                <ChevronDown className="h-5 w-5 text-slate-400 -rotate-90" />
              </Link>

              {/* CTA */}
              <div className="pt-6">
                <Link
                  href="/signup"
                  onClick={closeMenu}
                  className="block w-full text-center py-3.5 rounded-2xl font-semibold text-white transition-all"
                  style={{ backgroundColor: Brand.navy }}
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          )}

          {activeSection === "tools" && (
            <div className="px-6 py-8">
              <button
                onClick={() => setActiveSection("main")}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6"
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Tools</h2>
              <div className="space-y-4">
                {TOOLS_MEGA.categories.map((cat) => (
                  <div key={cat.title}>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{cat.title}</p>
                    <div className="space-y-1">
                      {cat.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenu}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-medium text-slate-900">{item.label}</p>
                            <p className="text-xs text-slate-500">{item.description}</p>
                          </div>
                          <ChevronDown className="h-4 w-4 text-slate-400 -rotate-90" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "resources" && (
            <div className="px-6 py-8">
              <button
                onClick={() => setActiveSection("main")}
                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-6"
              >
                ← Back
              </button>
              <h2 className="text-xl font-bold text-slate-900 mb-6">Resources</h2>
              <div className="space-y-4">
                {RESOURCES_MEGA.categories.map((cat) => (
                  <div key={cat.title}>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{cat.title}</p>
                    <div className="space-y-1">
                      {cat.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenu}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          <p className="text-sm font-medium text-slate-900">{item.label}</p>
                          <ChevronDown className="h-4 w-4 text-slate-400 -rotate-90" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
    </header>
  );
}
