"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, X, Sparkles, FileText, Globe, ArrowUpDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Brand } from "@/config/site";

export function BottomNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";

  return (
    <>
      {/* Bottom Nav Bar */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 px-2 py-2 rounded-full border border-[#e5e5e5] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)]"
        style={{ backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      >
        {/* Home */}
        <Link
          href="/"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${
            isHome ? "bg-[#f4f4f5]" : "hover:bg-[#f4f4f5]"
          }`}
        >
          <Home className="h-5 w-5" style={{ color: "#18181b" }} />
          {isHome && <span className="text-sm font-medium text-[#18181b]">Home</span>}
        </Link>

        {/* Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${
            menuOpen ? "bg-[#f4f4f5]" : "hover:bg-[#f4f4f5]"
          }`}
        >
          {menuOpen ? (
            <X className="h-5 w-5" style={{ color: "#18181b" }} />
          ) : (
            <Menu className="h-5 w-5" style={{ color: "#18181b" }} />
          )}
        </button>
      </div>

      {/* Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-[9998] bg-black/30" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              {[
                { label: "AI Generate", href: "/generate", icon: <Sparkles className="h-4 w-4" /> },
                { label: "PDF Tools", href: "/pdf", icon: <FileText className="h-4 w-4" /> },
                { label: "Convert", href: "/convert", icon: <Globe className="h-4 w-4" /> },
                { label: "Transfer", href: "/transfer", icon: <ArrowUpDown className="h-4 w-4" /> },
                { label: "Pricing", href: "/pricing", icon: null },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                    pathname === item.href ? "bg-[#f4f4f5]" : "hover:bg-[#f4f4f5]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <span className="text-slate-500">{item.icon}</span>}
                    <span className="text-sm font-medium text-slate-900">{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
