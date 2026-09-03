import Link from "next/link";
import { FileText, ArrowRight, Zap, Shield, Globe, Sparkles, Merge, Scissors, FileUp, Pen, Scan, FileDown, RotateCcw, Lock, Layers, RefreshCw } from "lucide-react";
import { Brand } from "@/config/site";

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
  { icon: Zap, title: "Lightning Fast", description: "Process documents in seconds, not minutes" },
  { icon: Shield, title: "Privacy First", description: "Process files in your browser - nothing leaves your device" },
  { icon: Globe, title: "200+ Formats", description: "Convert between any file format imaginable" },
  { icon: Sparkles, title: "AI-Powered", description: "Smart tools that understand your documents" },
];

export default function HomePage() {
  return (
    <div className="bg-[#F4F6FB]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#121660] to-[#1a1f6e]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight mb-6">
              Documents, done <span className="text-[#FFD140]">smoothly.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-300 mb-8">
              Generate, convert, edit, translate, and sign documents — all in one place. 
              No subscription required. No watermarks. No switching tabs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/generate"
                className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-all hover:scale-105"
              >
                <Sparkles className="h-5 w-5" />
                Start Creating
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold border border-white/30 text-white hover:bg-white/10 transition-all"
              >
                Explore Features
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">AI-Powered Tools</h2>
            <p className="text-lg text-slate-500">Intelligent document processing at your fingertips</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AI_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative rounded-2xl bg-white p-6 border border-slate-200 hover:border-slate-300 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-4" style={{ backgroundColor: tool.color + '15' }}>
                  <tool.icon className="h-6 w-6" style={{ color: tool.color }} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{tool.title}</h3>
                <p className="text-sm text-slate-500">{tool.description}</p>
                <ArrowRight className="absolute right-6 top-6 h-5 w-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PDF Tools Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">PDF Tools</h2>
            <p className="text-lg text-slate-500">Everything you need for PDF documents — completely free</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PDF_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative rounded-2xl bg-[#F4F6FB] p-6 hover:bg-white border border-transparent hover:border-slate-200 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-4" style={{ backgroundColor: tool.color + '15' }}>
                  <tool.icon className="h-6 w-6" style={{ color: tool.color }} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{tool.title}</h3>
                <p className="text-sm text-slate-500">{tool.description}</p>
                <ArrowRight className="absolute right-6 top-6 h-5 w-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/merge-pdf" className="inline-flex items-center gap-2 text-sm font-semibold text-[#3CAE8B] hover:text-[#2d9a7a] transition-colors">
              View All PDF Tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Conversions Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">File Conversion</h2>
            <p className="text-lg text-slate-500">Convert between 200+ format pairs — completely free</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CONVERSIONS.map((conv) => (
              <Link
                key={conv.href}
                href={conv.href}
                className="group flex flex-col items-center justify-center rounded-2xl bg-white p-6 border border-slate-200 hover:border-[#0171DF] transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg font-bold text-slate-900">{conv.from}</span>
                  <ArrowRight className="h-5 w-5 text-[#0171DF]" />
                  <span className="text-lg font-bold text-slate-900">{conv.to}</span>
                </div>
                <span className="text-sm text-slate-500 group-hover:text-[#0171DF] transition-colors">
                  Convert {conv.from} to {conv.to}
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/convert" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0171DF] hover:text-[#015bb5] transition-colors">
              View All Conversions
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Why Docmaker?</h2>
            <p className="text-lg text-slate-500">Built for speed, privacy, and simplicity</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#121660] mb-4">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#121660] to-[#1a1f6e] p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust Docmaker for their document needs. 
              No account required — start using tools immediately.
            </p>
            <Link
              href="/generate"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-all hover:scale-105"
            >
              <Sparkles className="h-5 w-5" />
              Start Creating for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
