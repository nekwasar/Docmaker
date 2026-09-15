"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, X, Sparkles, FileText, Globe, ArrowUpDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Brand } from "@/config/site";

const PAGE_COLORS: Record<string, { bg: string; text: string }> = {
  "/": { bg: Brand.navy, text: "#FFFFFF" },
  "/generate": { bg: Brand.navy, text: "#FFFFFF" },
  "/convert": { bg: Brand.teal, text: "#FFFFFF" },
  "/pdf": { bg: Brand.yellow, text: "#0F172A" },
  "/transfer": { bg: Brand.navy, text: "#FFFFFF" },
  "/pricing": { bg: Brand.navy, text: "#FFFFFF" },
  "/help": { bg: Brand.navy, text: "#FFFFFF" },
  "/welcome": { bg: Brand.navy, text: "#FFFFFF" },
};

function getPageColor(pathname: string) {
  if (pathname === "/") return PAGE_COLORS["/"];
  if (pathname.startsWith("/welcome")) return PAGE_COLORS["/welcome"];
  if (pathname.startsWith("/generate")) return PAGE_COLORS["/generate"];
  if (pathname.startsWith("/convert")) return PAGE_COLORS["/convert"];
  if (pathname.startsWith("/pdf")) return PAGE_COLORS["/pdf"];
  if (pathname.startsWith("/transfer")) return PAGE_COLORS["/transfer"];
  if (pathname.startsWith("/pricing")) return PAGE_COLORS["/pricing"];
  if (pathname.startsWith("/help")) return PAGE_COLORS["/help"];
  return PAGE_COLORS["/"];
}

export function BottomNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const colors = getPageColor(pathname);
  const isHome = pathname === "/";

  useEffect(() => {
    const showAndScheduleHide = () => {
      setIsVisible(true);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      if (!menuOpen) {
        hideTimeout.current = setTimeout(() => setIsVisible(false), 1400);
      }
    };

    // hide shortly after mount if idle
    hideTimeout.current = setTimeout(() => setIsVisible(false), 2500);

    const onScroll = () => showAndScheduleHide();
    const onMouseMove = () => showAndScheduleHide();
    const onTouchStart = () => showAndScheduleHide();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchstart", onTouchStart);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) setIsVisible(true);
  }, [menuOpen]);

  return (
    <>
      {/* Bottom Nav Bar — Fixed, auto-hide when idle */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 px-2 py-2 rounded-full transition-all duration-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
        }`}
        style={{
          backgroundColor: colors.bg,
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
          border: `1px solid ${colors.bg}`,
        }}
      >
        {/* Home */}
        <Link
          href="/"
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${
            isHome ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          <Home className="h-5 w-5" style={{ color: colors.text }} />
          {isHome && <span className="text-sm font-medium" style={{ color: colors.text }}>Home</span>}
        </Link>

        {/* Menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${
            menuOpen ? "bg-white/20" : "hover:bg-white/10"
          }`}
        >
          {menuOpen ? (
            <X className="h-5 w-5" style={{ color: colors.text }} />
          ) : (
            <Menu className="h-5 w-5" style={{ color: colors.text }} />
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
                  className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                    pathname === item.href ? "bg-[#f4f4f5]" : "hover:bg-[#f4f4f5]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <span className="text-slate-500">{item.icon}</span>}
                    <span className="text-sm font-medium text-slate-900">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
