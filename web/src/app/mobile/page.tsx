import Link from "next/link";
import { ArrowRight, Check, Smartphone } from "lucide-react";
import { Brand } from "@/config/site";

const FEATURES = [
  "AI document generation on the go",
  "Scan documents with your camera",
  "Extract text from images (OCR)",
  "Sign documents digitally",
  "Transfer files between devices",
  "View any file format",
  "Edit documents directly on mobile",
  "All PDF tools included",
];

export default function MobilePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Giant Header */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
          Docmaker <span style={{ color: '#121660' }}>Mobile</span>
        </h1>

        <p className="text-xl sm:text-2xl text-slate-500 mb-16 max-w-2xl leading-relaxed">
          All the power of Docmaker, in your pocket. Create, convert, sign, and manage documents from anywhere.
        </p>

        <div className="h-px bg-slate-200 mb-16" />

        {/* App Download */}
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Download the app
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#" className="inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-white transition-all hover:opacity-90" style={{ backgroundColor: '#0F172A' }}>
              <Smartphone className="h-5 w-5" />
              App Store
            </a>
            <a href="#" className="inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-white transition-all hover:opacity-90" style={{ backgroundColor: '#0F172A' }}>
              <Smartphone className="h-5 w-5" />
              Google Play
            </a>
          </div>
        </div>

        <div className="h-px bg-slate-200 mb-16" />

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Mobile features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
            {FEATURES.map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-lg text-slate-700">
                <Check className="h-5 w-5 flex-shrink-0" style={{ color: '#3CAE8B' }} />
                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-slate-200 mb-16" />

        {/* CTA */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Try it now
          </h2>
          <p className="text-lg text-slate-500 mb-8">
            Download Docmaker and start processing documents on your phone.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#121660' }}
          >
            Back to Web
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
