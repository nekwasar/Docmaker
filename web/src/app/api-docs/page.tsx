import Link from "next/link";
import { ArrowRight, Check, Key, Code, FileText, ArrowUpRight } from "lucide-react";
import { Brand } from "@/config/site";

const ENDPOINTS = [
  { method: "POST", path: "/v1/generate", description: "Generate a document from text prompt", color: "bg-green-500" },
  { method: "POST", path: "/v1/convert", description: "Convert files between formats", color: "bg-blue-500" },
  { method: "POST", path: "/v1/pdf/merge", description: "Merge multiple PDF files", color: "bg-purple-500" },
  { method: "POST", path: "/v1/pdf/split", description: "Split PDF into pages", color: "bg-purple-500" },
  { method: "POST", path: "/v1/pdf/compress", description: "Compress PDF files", color: "bg-purple-500" },
  { method: "POST", path: "/v1/ocr", description: "Extract text from images/PDFs", color: "bg-orange-500" },
  { method: "POST", path: "/v1/translate", description: "Translate documents", color: "bg-teal-500" },
  { method: "GET", path: "/v1/documents", description: "List all documents", color: "bg-green-500" },
];

export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Giant Header */}
        <h1 className="text-5xl sm:text-7xl font-bold text-slate-900 tracking-tight mb-8 leading-tight">
          API <span style={{ color: Brand.navy }}>Documentation</span>
        </h1>

        <p className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-2xl leading-relaxed">
          Integrate Docmaker into your applications. Generate, convert, and process documents programmatically.
        </p>

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-12" />

        {/* Quick Start */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Quick Start</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Get API Key", description: "Sign up and generate your API key from the dashboard." },
              { step: "02", title: "Make API Call", description: "Use our RESTful endpoints to process documents." },
              { step: "03", title: "Get Result", description: "Receive processed documents instantly." },
            ].map((item) => (
              <div key={item.step}>
                <span className="text-4xl font-bold" style={{ color: Brand.navy }}>{item.step}</span>
                <h3 className="text-lg font-semibold text-slate-900 mt-2 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-12" />

        {/* Authentication */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Authentication</h2>
          <p className="text-lg text-slate-600 mb-6">
            All API requests require an API key passed in the Authorization header.
          </p>
          <div className="rounded-2xl bg-[#0F172A] p-6 font-mono text-sm">
            <div className="text-slate-500 mb-2"># Include your API key in the header</div>
            <div className="text-white">Authorization: Bearer YOUR_API_KEY</div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-12" />

        {/* Endpoints */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Endpoints</h2>
          <div className="space-y-4">
            {ENDPOINTS.map((endpoint, index) => (
              <div key={index} className="flex items-center gap-4 py-4 border-b border-slate-200 last:border-0">
                <span className={`${endpoint.color} text-white text-xs font-bold px-2 py-1 rounded min-w-[50px] text-center`}>
                  {endpoint.method}
                </span>
                <code className="text-sm font-mono text-slate-900 flex-1">{endpoint.path}</code>
                <span className="text-sm text-slate-500 hidden sm:block">{endpoint.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-12" />

        {/* Code Examples */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Code Examples</h2>
          <div className="space-y-6">
            {[
              {
                title: "Generate Document",
                language: "bash",
                code: `curl -X POST https://api.docmaker.io/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Create a professional invoice"}'`,
              },
              {
                title: "Convert File",
                language: "javascript",
                code: `const response = await fetch('https://api.docmaker.io/v1/convert', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
  body: formData,
});
const result = await response.json();`,
              },
            ].map((example) => (
              <div key={example.title}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-slate-900">{example.title}</span>
                  <span className="text-xs text-slate-500">{example.language}</span>
                </div>
                <div className="rounded-2xl bg-[#0F172A] p-6 font-mono text-sm overflow-x-auto">
                  <pre className="text-slate-300">{example.code}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-12" />

        {/* Rate Limits */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Rate Limits</h2>
          <div className="grid grid-cols-3 gap-8">
            {[
              { plan: "Free", limit: "100", unit: "requests/day" },
              { plan: "Pro", limit: "1,000", unit: "requests/day" },
              { plan: "Enterprise", limit: "Unlimited", unit: "custom limits" },
            ].map((item) => (
              <div key={item.plan}>
                <div className="text-sm font-semibold text-slate-900 mb-1">{item.plan}</div>
                <div className="text-3xl font-bold" style={{ color: Brand.navy }}>{item.limit}</div>
                <div className="text-sm text-slate-500">{item.unit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-12" />

        {/* CTA */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Ready to build?</h2>
          <p className="text-lg text-slate-600 mb-8">
            Get your API key and start integrating Docmaker today.
          </p>
          <Link href="/register" className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105" style={{ backgroundColor: Brand.navy }}>
            Get API Key
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
