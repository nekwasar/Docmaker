import Link from "next/link";
import { Brand } from "@/config/site";

const FOOTER_LINKS = {
  Product: [
    { label: "AI Generate", href: "/generate" },
    { label: "Convert Files", href: "/convert" },
    { label: "PDF Tools", href: "/merge-pdf" },
    { label: "E-Sign", href: "/sign" },
    { label: "OCR", href: "/ocr" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
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
            <p className="text-sm text-slate-500">
              Documents, done smoothly. All-in-one document platform for everyone.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-slate-900 mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-center text-sm text-slate-400">
            © {new Date().getFullYear()} Docmaker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
