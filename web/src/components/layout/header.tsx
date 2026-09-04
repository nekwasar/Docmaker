"use client";

import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { Menu, X, FileText, ChevronDown, Sparkles, Globe, Timer, BookOpen, HelpCircle, MessageSquare, Code, Layers, Users } from "lucide-react";
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
        { label: "Merge PDF", href: "/merge-pdf", description: "Combine PDFs" },
        { label: "Split PDF", href: "/split-pdf", description: "Separate pages" },
        { label: "Compress PDF", href: "/compress-pdf", description: "Reduce file size" },
        { label: "Edit PDF", href: "/edit-pdf", description: "Add text & images" },
        { label: "E-Sign", href: "/sign", description: "Sign documents" },
        { label: "Encrypt PDF", href: "/encrypt", description: "Password protect" },
        { label: "Watermark", href: "/watermark", description: "Add watermarks" },
      ],
    },
    {
      title: "Conversion",
      icon: Globe,
      color: Brand.blue,
      items: [
        { label: "Convert Files", href: "/convert", description: "200+ format pairs" },
        { label: "PDF to Word", href: "/convert/pdf-to-docx", description: "PDF → DOCX" },
        { label: "JPG to PDF", href: "/convert/jpg-to-pdf", description: "Images → PDF" },
        { label: "Word to PDF", href: "/convert/docx-to-pdf", description: "DOCX → PDF" },
      ],
    },
    {
      title: "More Tools",
      icon: Timer,
      color: Brand.yellow,
      items: [
        { label: "OCR", href: "/ocr", description: "Extract text from images" },
        { label: "File Transfer", href: "/transfer", description: "Send files between devices" },
      ],
    },
    {
      title: "Enterprise",
      icon: Layers,
      color: Brand.navy,
      items: [
        { label: "API Access", href: "/api-docs", description: "Integrate into your apps" },
        { label: "Batch Processing", href: "/enterprise#batch", description: "Process 100+ files" },
        { label: "Team Collaboration", href: "/enterprise#team", description: "Work together" },
        { label: "Admin Dashboard", href: "/enterprise#admin", description: "Manage users & settings" },
      ],
    },
  ],
};

const RESOURCES_MEGA = {
  categories: [
    {
      title: "Help",
      icon: HelpCircle,
      items: [
        { label: "Help Center", href: "/help", description: "Get help with Docmaker" },
        { label: "FAQ", href: "/help#faq", description: "Frequently asked questions" },
        { label: "How It Works", href: "/how-it-works", description: "Step-by-step walkthrough" },
        { label: "Contact Us", href: "/contact", description: "Reach our team" },
      ],
    },
    {
      title: "Blog",
      icon: BookOpen,
      items: [
        { label: "All Posts", href: "/blog", description: "Tips, guides, and insights" },
        { label: "Tutorials", href: "/blog?tutorials", description: "Step-by-step guides" },
        { label: "Updates", href: "/blog?updates", description: "Product news" },
        { label: "Case Studies", href: "/blog?cases", description: "Success stories" },
      ],
    },
    {
      title: "Legals",
      icon: MessageSquare,
      items: [
        { label: "Privacy Policy", href: "/privacy", description: "How we handle data" },
        { label: "Terms of Service", href: "/terms", description: "Usage terms" },
        { label: "Cookie Policy", href: "/cookies", description: "Cookie usage" },
      ],
    },
    {
      title: "Company",
      icon: MessageSquare,
      items: [
        { label: "About", href: "/about", description: "About Docmaker" },
        { label: "Pricing", href: "/pricing", description: "Free for everyone" },
        { label: "Mobile App", href: "/mobile", description: "iOS & Android" },
      ],
    },
  ],
};

function MegaMenu({ label, data }: { label: string; data: typeof TOOLS_MEGA }) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // 150ms delay before closing
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[850px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
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
                      <Link
                        href={item.href}
                        className="block rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50"
      >
        Resources
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[700px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="grid grid-cols-4 gap-4">
            {RESOURCES_MEGA.categories.map((cat) => (
              <div key={cat.title}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                    <cat.icon className="h-4 w-4 text-slate-600" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{cat.title}</span>
                </div>
                <ul className="space-y-1">
                  {cat.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block rounded-lg px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
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
  const [toolsAccordion, setToolsAccordion] = useState(false);
  const [resourcesAccordion, setResourcesAccordion] = useState(false);

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
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="space-y-4">
            <div>
              <button
                className="flex w-full items-center justify-between text-sm font-semibold text-slate-900"
                onClick={() => setToolsAccordion(!toolsAccordion)}
              >
                Tools
                <ChevronDown className={`h-4 w-4 transition-transform ${toolsAccordion ? "rotate-180" : ""}`} />
              </button>
              {toolsAccordion && (
                <div className="mt-2 space-y-3 pl-2">
                  {TOOLS_MEGA.categories.map((cat) => (
                    <div key={cat.title}>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{cat.title}</p>
                      {cat.items.map((item) => (
                        <Link key={item.href} href={item.href} className="block py-1 text-sm text-slate-600" onClick={() => setMobileOpen(false)}>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                className="flex w-full items-center justify-between text-sm font-semibold text-slate-900"
                onClick={() => setResourcesAccordion(!resourcesAccordion)}
              >
                Resources
                <ChevronDown className={`h-4 w-4 transition-transform ${resourcesAccordion ? "rotate-180" : ""}`} />
              </button>
              {resourcesAccordion && (
                <div className="mt-2 space-y-3 pl-2">
                  {RESOURCES_MEGA.categories.map((cat) => (
                    <div key={cat.title}>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{cat.title}</p>
                      {cat.items.map((item) => (
                        <Link key={item.href} href={item.href} className="block py-1 text-sm text-slate-600" onClick={() => setMobileOpen(false)}>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link href="/pricing" className="block text-sm font-semibold text-slate-900" onClick={() => setMobileOpen(false)}>
              Pricing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
