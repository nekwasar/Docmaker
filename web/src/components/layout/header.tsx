"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, FileText, ChevronDown, Sparkles, Globe, Zap, BookOpen, HelpCircle, MessageSquare } from "lucide-react";
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
      icon: Zap,
      color: Brand.yellow,
      items: [
        { label: "OCR", href: "/ocr", description: "Extract text from images" },
        { label: "File Transfer", href: "/transfer", description: "Send files between devices" },
      ],
    },
  ],
};

const RESOURCES_MEGA = {
  categories: [
    {
      title: "Learn",
      icon: BookOpen,
      items: [
        { label: "Blog", href: "/blog", description: "Tips, guides, and insights" },
        { label: "Features", href: "/features", description: "All features explained" },
        { label: "How It Works", href: "/how-it-works", description: "Step-by-step walkthrough" },
      ],
    },
    {
      title: "Support",
      icon: HelpCircle,
      items: [
        { label: "Help Center", href: "/help", description: "Get help with Docmaker" },
        { label: "Contact Us", href: "/contact", description: "Reach our team" },
        { label: "FAQ", href: "/faq", description: "Frequently asked questions" },
      ],
    },
    {
      title: "Company",
      icon: MessageSquare,
      items: [
        { label: "About", href: "/about", description: "About Docmaker" },
        { label: "Privacy Policy", href: "/privacy", description: "How we handle data" },
        { label: "Terms of Service", href: "/terms", description: "Usage terms" },
      ],
    },
  ],
};

function MegaMenu({ label, data, isOpen, onToggle, onClose }: {
  label: string;
  data: typeof TOOLS_MEGA;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[700px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl z-50">
          <div className="grid grid-cols-4 gap-6">
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
                        onClick={onClose}
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
            <Link href="/features" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors" onClick={onClose}>
              View all tools →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function ResourcesMenu({ isOpen, onToggle, onClose }: {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50"
      >
        Resources
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[500px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl z-50">
          <div className="grid grid-cols-3 gap-6">
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
                        onClick={onClose}
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
  const [toolsOpen, setToolsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: Brand.navy }}>
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">Docmaker</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <MegaMenu
            label="Tools"
            data={TOOLS_MEGA}
            isOpen={toolsOpen}
            onToggle={() => { setToolsOpen(!toolsOpen); setResourcesOpen(false); }}
            onClose={() => setToolsOpen(false)}
          />
          <ResourcesMenu
            isOpen={resourcesOpen}
            onToggle={() => { setResourcesOpen(!resourcesOpen); setToolsOpen(false); }}
            onClose={() => setResourcesOpen(false)}
          />
          <Link href="/pricing" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50">
            Pricing
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ backgroundColor: Brand.navy }}
          >
            Get Started
          </link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="space-y-4">
            {/* Tools Section */}
            <div>
              <button
                className="flex w-full items-center justify-between text-sm font-semibold text-slate-900"
                onClick={() => setToolsOpen(!toolsOpen)}
              >
                Tools
                <ChevronDown className={`h-4 w-4 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
              </button>
              {toolsOpen && (
                <div className="mt-2 space-y-3 pl-2">
                  {TOOLS_MEGA.categories.map((cat) => (
                    <div key={cat.title}>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{cat.title}</p>
                      {cat.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block py-1 text-sm text-slate-600 hover:text-slate-900"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Resources Section */}
            <div>
              <button
                className="flex w-full items-center justify-between text-sm font-semibold text-slate-900"
                onClick={() => setResourcesOpen(!resourcesOpen)}
              >
                Resources
                <ChevronDown className={`h-4 w-4 transition-transform ${resourcesOpen ? "rotate-180" : ""}`} />
              </button>
              {resourcesOpen && (
                <div className="mt-2 space-y-3 pl-2">
                  {RESOURCES_MEGA.categories.map((cat) => (
                    <div key={cat.title}>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{cat.title}</p>
                      {cat.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block py-1 text-sm text-slate-600 hover:text-slate-900"
                          onClick={() => setMobileOpen(false)}
                        >
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

            <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
              <Link href="/login" className="text-center text-sm font-medium text-slate-600" onClick={() => setMobileOpen(false)}>
                Sign In
              </Link>
              <Link href="/register" className="text-center rounded-full px-5 py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: Brand.navy }} onClick={() => setMobileOpen(false)}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
