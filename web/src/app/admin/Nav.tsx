"use client";

import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/settings", label: "AI Settings" },
  { href: "/admin/usage", label: "Usage" },
  { href: "/admin/visitors", label: "Visitors" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/audit", label: "Audit" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="relative flex items-center gap-1 overflow-x-auto text-[12px] font-medium scrollbar-none">
      {LINKS.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <a
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-[6px] px-2.5 py-1.5 whitespace-nowrap transition-colors ${
              active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {l.label}
          </a>
        );
      })}
      <a href="/" className="rounded-[6px] px-2.5 py-1.5 text-[#B2A295] hover:bg-white/10 whitespace-nowrap">
        ← Site
      </a>
      <div aria-hidden className="pointer-events-none sticky right-0 ml-auto h-6 w-8 shrink-0 bg-gradient-to-l from-[#3D4D4E] to-transparent sm:hidden" />
    </nav>
  );
}
