import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowRight, Timer, Shield, Globe, Sparkles, Merge, Scissors, FileUp, Pen, Lock, Layers, RefreshCw, Camera, Type, PenTool, ArrowUpDown } from "lucide-react";
import { Brand } from "@/config/site";

export const metadata: Metadata = {
  title: "Docmaker — Free PDF Tools, AI Document Generator, File Converter",
  description: "Generate, convert, edit, sign, and compress documents for free. AI-powered document tools with no limits, no watermarks, no account required. 200+ format conversions.",
  keywords: ["free pdf tools", "ai document generator", "free file converter", "merge pdf free", "compress pdf free", "ocr free", "e-sign free", "document generator", "pdf editor free"],
  openGraph: {
    title: "Docmaker — Free PDF Tools & AI Document Generator",
    description: "Generate, convert, edit, sign documents for free. No limits, no watermarks. AI-powered.",
    url: "https://docmaker.io",
    images: [{ url: "https://docmaker.io/api/og?title=Docmaker&subtitle=Free+PDF+Tools+%26+AI+Document+Generator", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Docmaker — Free PDF Tools & AI Document Generator",
    description: "Generate, convert, edit, sign documents for free. No limits, no watermarks.",
  },
  alternates: { canonical: "https://docmaker.io" },
};

const AI_TOOLS = [
  { icon: Sparkles, title: "AI Generate", description: "Create professional documents from text prompts", href: "/generate", color: Brand.navy },
  { icon: Pen, title: "AI Edit", description: "Edit documents with natural language", href: "/edit-pdf", color: Brand.navy },
  { icon: FileText, title: "AI Q&A", description: "Ask questions about your documents", href: "/qa", color: Brand.navy },
  { icon: RefreshCw, title: "Summarize", description: "Create short summaries of long docs", href: "/summarize", color: Brand.navy },
  { icon: Layers, title: "Change Style", description: "Restyle any document with AI", href: "/change-style", color: Brand.navy },
];

const PDF_TOOLS = [
  { icon: Merge, title: "Merge PDF", description: "Combine multiple PDFs into one", href: "/merge-pdf", color: Brand.teal },
  { icon: Scissors, title: "Split PDF", description: "Separate pages into individual files", href: "/split-pdf", color: Brand.teal },
  { icon: FileUp, title: "Compress PDF", description: "Reduce file size without quality loss", href: "/compress-pdf", color: Brand.teal },
  { icon: Pen, title: "Edit PDF", description: "Add text, images, shapes, annotations", href: "/edit-pdf", color: Brand.teal },
  { icon: Lock, title: "Encrypt PDF", description: "Password-protect your documents", href: "/encrypt", color: Brand.teal },
  { icon: Layers, title: "Watermark", description: "Add watermarks to PDF pages", href: "/watermark", color: Brand.teal },
];

const CONVERSIONS = [
  { from: "PDF", to: "Word", href: "/convert/pdf-to-docx" },
  { from: "JPG", to: "PDF", href: "/convert/jpg-to-pdf" },
  { from: "Word", to: "PDF", href: "/convert/docx-to-pdf" },
  { from: "PDF", to: "JPG", href: "/convert/pdf-to-jpg" },
];

const FEATURES = [
  { icon: Timer, title: "Lightning Fast", description: "Process documents in seconds, not minutes" },
  { icon: Shield, title: "Privacy First", description: "Process files in your browser - nothing leaves your device" },
  { icon: Globe, title: "200+ Formats", description: "Convert between any file format imaginable" },
  { icon: Sparkles, title: "AI-Powered", description: "Smart tools that understand your documents" },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Docmaker",
    url: "https://docmaker.io",
    description: "Free PDF tools, AI document generator, and file converter. No limits, no watermarks.",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web, iOS, Android",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <div className="bg-[#F4F6FB]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-[#121660] to-[#1a1f6e]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-[0.95]">
                Documents, done<br />
                <span className="text-[#FFD140]">smoothly.</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed max-w-lg">
                Free. Forever. No watermarks. No limits. 
                Generate, convert, edit, sign — everything you need, all in one place.
              </p>
              <Link
                href="/generate"
                className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-all hover:scale-105 mb-10"
              >
                <Sparkles className="h-5 w-5" />
                Start Creating
              </Link>

              {/* Platform Badges */}
              <div className="flex flex-wrap gap-4">
                <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <Globe className="h-5 w-5 text-white" />
                  <div>
                    <div className="text-xs font-semibold text-white">Web App</div>
                    <div className="text-[10px] text-slate-400">docmaker.io</div>
                  </div>
                </Link>
                <Link href="/mobile" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.5,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.89L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div>
                    <div className="text-xs font-semibold text-white">Mobile</div>
                    <div className="text-[10px] text-slate-400">iOS & Android</div>
                  </div>
                </Link>
                <Link href="/enterprise" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                  <Layers className="h-5 w-5 text-white" />
                  <div>
                    <div className="text-xs font-semibold text-white">Enterprise</div>
                    <div className="text-[10px] text-slate-400">API & Teams</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Right: Giant Document (Interactive Demo Placeholder) */}
            <div className="hidden lg:block relative">
              <div className="relative">
                {/* Document Shadow */}
                <div className="absolute inset-0 rounded-3xl bg-black/20 translate-x-4 translate-y-4" />
                {/* Document */}
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl" style={{ transform: 'rotate(-2deg)' }}>
                  {/* Document Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#121660] flex items-center justify-center">
                        <span className="text-white text-xs font-bold">D</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">Docmaker</span>
                    </div>
                    <span className="text-xs text-slate-400">Document</span>
                  </div>
                  {/* Simulated Content */}
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-5/6" />
                    <div className="h-3 bg-slate-100 rounded w-4/5" />
                    <div className="h-8" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-5/6" />
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                    <div className="h-6" />
                    <div className="h-3 bg-slate-200 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-4/5" />
                  </div>
                  {/* Document Footer */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-400">Page 1 of 3</span>
                    <span className="text-xs text-slate-400">docmaker.io</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid - AI + Quick Actions */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/generate" className="md:col-span-2 rounded-3xl p-8 text-white transition-all hover:scale-[1.02] hover:shadow-xl" style={{ backgroundColor: Brand.navy }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="px-3 py-1 text-xs font-bold bg-white/20 rounded-full">AI</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Generate Document</h2>
              <p className="text-white/75 text-lg">Create professional documents from text prompts</p>
            </Link>
            <div className="flex flex-col gap-4">
              <Link href="/camera/scanner" className="flex-1 rounded-3xl p-6 text-white transition-all hover:scale-[1.02] hover:shadow-xl" style={{ backgroundColor: Brand.yellow }}>
                <Camera className="h-8 w-8 text-[#0F172A] mb-3" />
                <h3 className="text-lg font-bold text-[#0F172A]">Scan</h3>
                <p className="text-sm text-[#0F172A]/75">Scan documents</p>
              </Link>
              <Link href="/ocr" className="flex-1 rounded-3xl p-6 text-white transition-all hover:scale-[1.02] hover:shadow-xl" style={{ backgroundColor: Brand.teal }}>
                <Type className="h-8 w-8 text-white mb-3" />
                <h3 className="text-lg font-bold text-white">OCR</h3>
                <p className="text-sm text-white/75">Extract text</p>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Link href="/sign" className="rounded-3xl p-6 text-white transition-all hover:scale-[1.02] hover:shadow-xl" style={{ backgroundColor: Brand.blue }}>
              <PenTool className="h-8 w-8 text-white mb-3" />
              <h3 className="text-lg font-bold text-white">Sign Document</h3>
              <p className="text-sm text-white/75">Sign documents digitally</p>
            </Link>
            <Link href="/transfer" className="rounded-3xl p-6 text-white transition-all hover:scale-[1.02] hover:shadow-xl" style={{ backgroundColor: Brand.teal }}>
              <ArrowUpDown className="h-8 w-8 text-white mb-3" />
              <h3 className="text-lg font-bold text-white">File Transfer</h3>
              <p className="text-sm text-white/75">Send files between devices</p>
            </Link>
            <Link href="/convert" className="rounded-3xl p-6 text-white transition-all hover:scale-[1.02] hover:shadow-xl" style={{ backgroundColor: Brand.navy }}>
              <RefreshCw className="h-8 w-8 text-white mb-3" />
              <h3 className="text-lg font-bold text-white">Convert Files</h3>
              <p className="text-sm text-white/75">200+ format pairs</p>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">AI Tools</h2>
            <Link href="/generate" className="text-sm font-semibold text-[#121660] hover:underline">
              See All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {AI_TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group rounded-2xl bg-[#F4F6FB] p-5 hover:bg-white border border-transparent hover:border-slate-200 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl mb-3" style={{ backgroundColor: tool.color + '15' }}>
                  <tool.icon className="h-5 w-5" style={{ color: tool.color }} />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">{tool.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PDF Tools Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">PDF Tools</h2>
            <Link href="/merge-pdf" className="text-sm font-semibold hover:underline" style={{ color: Brand.teal }}>See All →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {PDF_TOOLS.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group rounded-2xl bg-white p-5 border border-slate-200 hover:border-slate-300 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl mb-3" style={{ backgroundColor: tool.color + '15' }}>
                  <tool.icon className="h-5 w-5" style={{ color: tool.color }} />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">{tool.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Conversions Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">File Conversion</h2>
            <Link href="/convert" className="text-sm font-semibold hover:underline" style={{ color: Brand.blue }}>See All →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CONVERSIONS.map((conv) => (
              <Link key={conv.href} href={conv.href} className="group rounded-2xl bg-[#F4F6FB] p-6 text-center hover:bg-white border border-transparent hover:border-slate-200 transition-all hover:shadow-lg">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-xl font-bold text-slate-900">{conv.from}</span>
                  <ArrowRight className="h-5 w-5" style={{ color: Brand.blue }} />
                  <span className="text-xl font-bold text-slate-900">{conv.to}</span>
                </div>
                <p className="text-sm text-slate-500">Convert {conv.from} to {conv.to}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-slate-200 mb-16" />
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
            Built for <span style={{ color: Brand.navy }}>scale</span>
          </h2>
          <p className="text-xl text-slate-500 mb-10 max-w-xl leading-relaxed">
            API access, batch processing, team collaboration, and enterprise-grade security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/enterprise" className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white transition-all hover:opacity-90" style={{ backgroundColor: Brand.navy }}>
              Enterprise Plan — $49/mo
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold border-2 border-slate-200 text-slate-900 hover:border-slate-400 transition-all">
              Talk to Sales
            </Link>
          </div>
          <div className="h-px bg-slate-200 mt-16" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">Why Docmaker?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-2xl bg-white p-6 border border-slate-200 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl mb-4" style={{ backgroundColor: Brand.navy }}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#121660] to-[#1a1f6e] p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">Join thousands of users who trust Docmaker for their document needs. No account required.</p>
            <Link href="/generate" className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-all hover:scale-105">
              <Sparkles className="h-5 w-5" /> Start Creating for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
