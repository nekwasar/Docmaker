import Link from "next/link";
import { ArrowRight, Code, FileText, Layers, Sparkles, Lock, Key } from "lucide-react";
import { Brand } from "@/config/site";

const ENDPOINTS = [
  {
    method: "POST",
    path: "/v1/generate",
    description: "Generate a document from text prompt",
    color: "bg-green-500",
  },
  {
    method: "POST",
    path: "/v1/convert",
    description: "Convert files between formats",
    color: "bg-blue-500",
  },
  {
    method: "POST",
    path: "/v1/pdf/merge",
    description: "Merge multiple PDF files",
    color: "bg-purple-500",
  },
  {
    method: "POST",
    path: "/v1/pdf/split",
    description: "Split PDF into pages",
    color: "bg-purple-500",
  },
  {
    method: "POST",
    path: "/v1/pdf/compress",
    description: "Compress PDF files",
    color: "bg-purple-500",
  },
  {
    method: "POST",
    path: "/v1/ocr",
    description: "Extract text from images/PDFs",
    color: "bg-orange-500",
  },
  {
    method: "POST",
    path: "/v1/translate",
    description: "Translate documents",
    color: "bg-teal-500",
  },
  {
    method: "GET",
    path: "/v1/documents",
    description: "List all documents",
    color: "bg-green-500",
  },
];

const CODE_EXAMPLES = [
  {
    title: "Generate Document",
    language: "bash",
    code: `curl -X POST https://api.docmaker.io/v1/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Create a professional invoice for web design services",
    "structure": "invoice"
  }'`,
  },
  {
    title: "Convert File",
    language: "javascript",
    code: `const response = await fetch('https://api.docmaker.io/v1/convert', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
  },
  body: formData, // FormData with file and target_format
});

const result = await response.json();
// { download_url: "...", format: "docx" }`,
  },
  {
    title: "Merge PDFs",
    language: "python",
    code: `import requests

response = requests.post(
    'https://api.docmaker.io/v1/pdf/merge',
    headers={'Authorization': 'Bearer YOUR_API_KEY'},
    files={'files': [open('doc1.pdf', 'rb'), open('doc2.pdf', 'rb')]}
)

result = response.json()
# { "download_url": "..." }`,
  },
];

export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#121660] to-[#1a1f6e]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold bg-white/10 text-white rounded-full mb-4">API</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Docmaker API Documentation
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300 mb-6">
            Integrate Docmaker into your applications. Generate, convert, and process documents programmatically.
          </p>
          <Link href="/enterprise" className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:underline">
            Learn about Enterprise plans
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white p-6 border border-slate-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl mb-3" style={{ backgroundColor: Brand.navy + '15' }}>
                <Key className="h-5 w-5" style={{ color: Brand.navy }} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">1. Get API Key</h3>
              <p className="text-sm text-slate-500">Sign up for an account and generate your API key from the dashboard.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 border border-slate-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl mb-3" style={{ backgroundColor: Brand.teal + '15' }}>
                <Code className="h-5 w-5" style={{ color: Brand.teal }} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">2. Make API Call</h3>
              <p className="text-sm text-slate-500">Use our RESTful endpoints to generate, convert, or process documents.</p>
            </div>
            <div className="rounded-2xl bg-white p-6 border border-slate-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl mb-3" style={{ backgroundColor: Brand.blue + '15' }}>
                <FileText className="h-5 w-5" style={{ color: Brand.blue }} />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">3. Get Result</h3>
              <p className="text-sm text-slate-500">Receive the processed document or conversion result instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Authentication</h2>
          <p className="text-slate-600 mb-6">
            All API requests require an API key passed in the Authorization header.
          </p>
          <div className="rounded-2xl bg-[#0F172A] p-6 font-mono text-sm">
            <div className="text-slate-500 mb-2"># Include your API key in the header</div>
            <div className="text-white">Authorization: Bearer YOUR_API_KEY</div>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">API Endpoints</h2>
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
            {ENDPOINTS.map((endpoint, index) => (
              <div key={index} className={`flex items-center gap-4 p-4 ${index !== ENDPOINTS.length - 1 ? 'border-b border-slate-100' : ''}`}>
                <span className={`${endpoint.color} text-white text-xs font-bold px-2 py-1 rounded`}>
                  {endpoint.method}
                </span>
                <code className="text-sm font-mono text-slate-900 flex-1">{endpoint.path}</code>
                <span className="text-sm text-slate-500 hidden sm:block">{endpoint.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Code Examples</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {CODE_EXAMPLES.map((example) => (
              <div key={example.title} className="rounded-2xl bg-[#0F172A] overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <span className="text-sm font-semibold text-white">{example.title}</span>
                  <span className="text-xs text-slate-500 ml-2">{example.language}</span>
                </div>
                <pre className="p-4 text-xs text-slate-300 overflow-x-auto">
                  <code>{example.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Rate Limits</h2>
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-3 gap-px bg-slate-200">
              <div className="bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">Free</div>
                <div className="text-2xl font-bold mt-1" style={{ color: Brand.navy }}>100</div>
                <div className="text-xs text-slate-500">requests/day</div>
              </div>
              <div className="bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">Pro</div>
                <div className="text-2xl font-bold mt-1" style={{ color: Brand.teal }}>1,000</div>
                <div className="text-xs text-slate-500">requests/day</div>
              </div>
              <div className="bg-white p-4">
                <div className="text-sm font-semibold text-slate-900">Enterprise</div>
                <div className="text-2xl font-bold mt-1" style={{ color: Brand.blue }}>Unlimited</div>
                <div className="text-xs text-slate-500">custom limits</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to build?</h2>
          <p className="text-slate-500 mb-6">Get your API key and start integrating Docmaker today.</p>
          <Link href="/register" className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white" style={{ backgroundColor: Brand.navy }}>
            Get API Key
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
