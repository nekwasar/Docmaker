import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Brand } from "@/config/site";

const ENDPOINTS = [
  { method: "POST", path: "/v1/generate", description: "Generate a document from text prompt" },
  { method: "POST", path: "/v1/convert", description: "Convert files between formats" },
  { method: "POST", path: "/v1/pdf/merge", description: "Merge multiple PDF files" },
  { method: "POST", path: "/v1/pdf/split", description: "Split PDF into pages" },
  { method: "POST", path: "/v1/pdf/compress", description: "Compress PDF files" },
  { method: "POST", path: "/v1/ocr", description: "Extract text from images/PDFs" },
  { method: "POST", path: "/v1/translate", description: "Translate documents" },
  { method: "GET", path: "/v1/documents", description: "List all documents" },
];

export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero - Giant Typography */}
      <section className="py-32 sm:py-40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold tracking-widest uppercase mb-6" style={{ color: '#3CAE8B' }}>Documentation</p>
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.9] mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            API<br />
            <span style={{ color: '#121660' }}>Reference</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-500 max-w-xl leading-relaxed mb-12">
            Integrate Docmaker into your applications. Generate, convert, and process documents programmatically.
          </p>
          <Link
            href="/enterprise"
            className="inline-flex items-center gap-2 text-base font-semibold text-slate-900 hover:underline"
          >
            Learn about Enterprise
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200" />
      </div>

      {/* Quick Start - Numbered Steps */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-16" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Quick Start
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Get API Key", desc: "Sign up and generate your API key from the dashboard." },
              { step: "02", title: "Make API Call", desc: "Use our RESTful endpoints to process documents." },
              { step: "03", title: "Get Result", desc: "Receive processed documents instantly." },
            ].map((item) => (
              <div key={item.step}>
                <span className="text-6xl sm:text-7xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#121660' }}>{item.step}</span>
                <h3 className="text-xl font-semibold text-slate-900 mt-4 mb-2">{item.title}</h3>
                <p className="text-base text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200" />
      </div>

      {/* Authentication */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Authentication
          </h2>
          <p className="text-xl text-slate-500 mb-8 max-w-xl">
            All API requests require an API key passed in the Authorization header.
          </p>
          <div className="rounded-lg bg-[#0F172A] p-8 font-mono text-sm max-w-2xl">
            <div className="text-slate-500 mb-3"># Include your API key in the header</div>
            <div className="text-white text-base">Authorization: Bearer YOUR_API_KEY</div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200" />
      </div>

      {/* Endpoints - Clean Table */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-16" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Endpoints
          </h2>
          <div className="border-t-2 border-slate-900">
            {ENDPOINTS.map((endpoint, index) => (
              <div key={index} className="flex items-center gap-6 py-6 border-b border-slate-200">
                <span className="text-xs font-bold px-3 py-1 rounded bg-slate-100 text-slate-700 min-w-[50px] text-center">
                  {endpoint.method}
                </span>
                <code className="text-base font-mono text-slate-900 flex-1">{endpoint.path}</code>
                <span className="text-sm text-slate-500 hidden sm:block">{endpoint.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200" />
      </div>

      {/* Code Examples */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-16" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Code Examples
          </h2>
          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Generate Document</h3>
              <div className="rounded-lg bg-[#0F172A] p-8 font-mono text-sm overflow-x-auto">
                <pre className="text-slate-300">{`curl -X POST https://api.docmaker.io/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Create a professional invoice"}'`}</pre>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Convert File</h3>
              <div className="rounded-lg bg-[#0F172A] p-8 font-mono text-sm overflow-x-auto">
                <pre className="text-slate-300">{`const response = await fetch('https://api.docmaker.io/v1/convert', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
  body: formData,
});
const result = await response.json();`}</pre>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Merge PDFs</h3>
              <div className="rounded-lg bg-[#0F172A] p-8 font-mono text-sm overflow-x-auto">
                <pre className="text-slate-300">{`import requests

response = requests.post(
    'https://api.docmaker.io/v1/pdf/merge',
    headers={'Authorization': 'Bearer YOUR_API_KEY'},
    files={'files': [open('doc1.pdf', 'rb'), open('doc2.pdf', 'rb')]}
)
result = response.json()`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200" />
      </div>

      {/* Rate Limits */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-16" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Rate Limits
          </h2>
          <div className="grid grid-cols-3 gap-12">
            {[
              { plan: "Free", limit: "100", unit: "requests/day" },
              { plan: "Pro", limit: "1,000", unit: "requests/day" },
              { plan: "Enterprise", limit: "Unlimited", unit: "custom limits" },
            ].map((item) => (
              <div key={item.plan}>
                <div className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wider">{item.plan}</div>
                <div className="text-5xl sm:text-6xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)', color: '#121660' }}>{item.limit}</div>
                <div className="text-base text-slate-500">{item.unit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200" />
      </div>

      {/* CTA */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Ready to build?
          </h2>
          <p className="text-xl text-slate-500 mb-10 max-w-xl">
            Get your API key and start integrating Docmaker today.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#121660' }}
          >
            Get API Key
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
