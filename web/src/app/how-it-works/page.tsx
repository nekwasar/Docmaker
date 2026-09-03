import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Brand } from "@/config/site";

const STEPS = [
  {
    number: "01",
    title: "Choose a tool",
    description: "Select from our suite of AI-powered document tools. Generate, convert, edit, sign — whatever you need.",
  },
  {
    number: "02",
    title: "Upload or describe",
    description: "Upload your files or describe what you want to create. Our AI understands natural language.",
  },
  {
    number: "03",
    title: "Get instant results",
    description: "Process documents in seconds. Download, share, or continue editing — all in one place.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
          How it works
        </h1>
        <p className="text-xl text-slate-500 mb-16 max-w-xl">
          Three simple steps to process any document. No account required.
        </p>

        <div className="h-px bg-slate-200 mb-16" />

        {/* Steps */}
        <div className="space-y-24">
          {STEPS.map((step, index) => (
            <div key={step.number} className="flex flex-col sm:flex-row gap-8 sm:gap-16 items-start">
              <div className="flex-shrink-0">
                <span className="text-7xl sm:text-8xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#121660' }}>
                  {step.number}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
                  {step.title}
                </h2>
                <p className="text-lg text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {index < STEPS.length - 1 && (
                <div className="h-px bg-slate-200 w-full absolute left-0 hidden sm:block" style={{ top: '50%' }} />
              )}
            </div>
          ))}
        </div>

        <div className="h-px bg-slate-200 my-16" />

        {/* Tools Section */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Available tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">AI-Powered</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: Brand.navy }} /> Generate documents from text</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: Brand.navy }} /> Edit with natural language</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: Brand.navy }} /> Ask questions about your docs</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: Brand.navy }} /> Summarize long documents</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: Brand.navy }} /> Restyle any document</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">PDF Tools</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: Brand.teal }} /> Merge, split, compress</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: Brand.teal }} /> Edit text and images</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: Brand.teal }} /> Sign documents digitally</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: Brand.teal }} /> Encrypt with passwords</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: Brand.teal }} /> Add watermarks</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Conversion</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: Brand.blue }} /> 200+ format pairs</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: Brand.blue }} /> PDF ↔ Word, Excel, PowerPoint</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: Brand.blue }} /> Images to PDF and back</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: Brand.blue }} /> HTML, Markdown support</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">More Tools</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: Brand.yellow }} /> OCR text extraction</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: Brand.yellow }} /> File transfer between devices</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: Brand.yellow }} /> Document sharing</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: Brand.yellow }} /> Version history</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-200 mb-16" />

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Ready to get started?
          </h2>
          <p className="text-lg text-slate-500 mb-8">
            Try Docmaker now — no account required.
          </p>
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: Brand.navy }}
          >
            Start Creating
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
