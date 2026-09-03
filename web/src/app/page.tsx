import Link from "next/link";
import { FileText, ArrowRight, Timer, Shield, Globe, Sparkles, Merge, Scissors, FileUp, Pen, Lock, Layers, RefreshCw, Camera, Type, PenTool, ArrowUpDown } from "lucide-react";
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
  { icon: Timer, title: "Lightning Fast", description: "Process documents in seconds, not minutes" },
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

      {/* Bento Grid - AI + Quick Actions */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hero AI Card - spans 2 columns */}
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

            {/* Quick Action Cards */}
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

          {/* Second row - 3 equal cards */}
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
            <Link href="/features" className="text-sm font-semibold text-[#121660] hover:underline">
              See All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {AI_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-2xl bg-[#F4F6FB] p-5 hover:bg-white border border-transparent hover:border-slate-200 transition-all hover:shadow-lg hover:-translate-y-1"
              >
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
            <Link href="/merge-pdf" className="text-sm font-semibold hover:underline" style={{ color: Brand.teal }}>
              See All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {PDF_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-2xl bg-white p-5 border border-slate-200 hover:border-slate-300 transition-all hover:shadow-lg hover:-translate-y-1"
              >
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
            <Link href="/convert" className="text-sm font-semibold hover:underline" style={{ color: Brand.blue }}>
              See All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CONVERSIONS.map((conv) => (
              <Link
                key={conv.href}
                href={conv.href}
                className="group rounded-2xl bg-[#F4F6FB] p-6 text-center hover:bg-white border border-transparent hover:border-slate-200 transition-all hover:shadow-lg"
              >
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
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Built for <span style={{ color: Brand.navy }}>scale</span>
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
            API access, batch processing, team collaboration, and enterprise-grade security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/enterprise" className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105" style={{ backgroundColor: Brand.navy }}>
              Enterprise Plan — $49/mo
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold border-2 border-slate-200 text-slate-900 hover:border-slate-400 transition-all">
              Talk to Sales
            </Link>
          </div>
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
