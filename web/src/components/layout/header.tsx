"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, FileText, ChevronDown } from "lucide-react";
import { Brand } from "@/config/site";

const NAV_ITEMS = [
  {
    label: "Tools",
    href: "#",
    children: [
      { label: "AI Generate", href: "/generate" },
      { label: "Convert Files", href: "/convert" },
      { label: "Merge PDF", href: "/merge-pdf" },
      { label: "Split PDF", href: "/split-pdf" },
      { label: "Compress PDF", href: "/compress-pdf" },
      { label: "Edit PDF", href: "/edit-pdf" },
      { label: "E-Sign", href: "/sign" },
      { label: "OCR", href: "/ocr" },
    ],
  },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: Brand.navy }}>
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">Docmaker</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {item.children ? (
                <button className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  {item.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
              ) : (
                <Link href={item.href} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  {item.label}
                </Link>
              )}

              {item.children && activeDropdown === item.label && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:scale-105"
            style={{ backgroundColor: Brand.navy }}
          >
            Get Started
          </Link>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="py-2">
              {item.children ? (
                <>
                  <button
                    className="flex w-full items-center justify-between text-sm font-medium text-slate-600"
                    onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {activeDropdown === item.label && (
                    <div className="mt-2 ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block py-1 text-sm text-slate-500 hover:text-slate-900"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className="block text-sm font-medium text-slate-600 hover:text-slate-900"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/login" className="text-center text-sm font-medium text-slate-600">Sign In</Link>
            <Link href="/register" className="text-center rounded-full px-5 py-2.5 text-sm font-semibold text-white" style={{ backgroundColor: Brand.navy }}>
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
