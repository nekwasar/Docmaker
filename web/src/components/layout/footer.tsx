import Link from "next/link";
import { FileText } from "lucide-react";
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
              <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: Brand.navy }}>
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Docmaker</span>
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
