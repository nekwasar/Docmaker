import Link from "next/link";
import { FileText, ArrowRight, Shield, Users, Layers, Settings, Lock, BarChart3, Zap, Check } from "lucide-react";
import { Brand } from "@/config/site";

const FEATURES = [
  {
    icon: FileText,
    title: "API Access",
    description: "Integrate Docmaker into your applications with our RESTful API. Generate, convert, and process documents programmatically.",
    color: Brand.navy,
  },
  {
    icon: Layers,
    title: "Batch Processing",
    description: "Process hundreds of files at once. Convert, compress, merge — all in bulk with a single API call.",
    color: Brand.teal,
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together on documents in real-time. Share, comment, and collaborate with your team.",
    color: Brand.blue,
  },
  {
    icon: Settings,
    title: "Admin Dashboard",
    description: "Manage users, monitor usage, configure settings — all from a centralized admin panel.",
    color: Brand.yellow,
  },
  {
    icon: Lock,
    title: "SSO Integration",
    description: "Single sign-on with SAML, OIDC, or your identity provider. Secure access for your team.",
    color: Brand.navy,
  },
  {
    icon: BarChart3,
    title: "Audit Logs",
    description: "Track all actions for compliance. Know who did what and when.",
    color: Brand.teal,
  },
];

const USE_CASES = [
  { title: "Legal Firms", description: "Process contracts, NDAs, and legal documents in bulk with full audit trails." },
  { title: "Healthcare", description: "Convert patient records, extract text from medical documents securely." },
  { title: "Education", description: "Batch process student submissions, generate certificates, manage documents." },
  { title: "Finance", description: "Process invoices, reports, and financial documents with compliance tracking." },
];

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] to-[#1E293B]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold bg-white/10 text-white rounded-full mb-6">Enterprise</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-6">
            Docmaker for <span className="text-[#FFD140]">Business</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400 mb-8">
            API access, batch processing, team collaboration, and enterprise-grade security. 
            Everything your organization needs to scale document operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/api" className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-all hover:scale-105">
              <FileText className="h-5 w-5" />
              View API Docs
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold border border-white/30 text-white hover:bg-white/10 transition-all">
              Contact Sales
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">Enterprise Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-2xl bg-white p-6 border border-slate-200 hover:shadow-lg transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl mb-4" style={{ backgroundColor: feature.color + '15' }}>
                  <feature.icon className="h-6 w-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">Built for Every Industry</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {USE_CASES.map((useCase) => (
              <div key={useCase.title} className="rounded-2xl bg-[#F4F6FB] p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{useCase.title}</h3>
                <p className="text-sm text-slate-500">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Preview */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-[#0F172A] p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Powerful API</h2>
                <p className="text-slate-400 mb-6">
                  Integrate Docmaker into your applications with our simple RESTful API. 
                  Generate, convert, and process documents programmatically.
                </p>
                <ul className="space-y-3 mb-8">
                  {["RESTful endpoints", "Webhook support", "Rate limiting", "API key management"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                      <Check className="h-4 w-4 text-[#3CAE8B]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/api" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-all">
                  View API Documentation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="bg-[#1E293B] rounded-2xl p-6 font-mono text-sm">
                <div className="text-slate-500 mb-2"># Example API call</div>
                <div className="text-[#3CAE8B]">curl</div>
                <div className="text-white">  -X POST https://api.docmaker.io/v1/convert</div>
                <div className="text-white">  -H "Authorization: Bearer YOUR_API_KEY"</div>
                <div className="text-white">  -F "file=@document.pdf"</div>
                <div className="text-white">  -F "target_format=docx"</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Ready to scale?</h2>
          <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto">
            Join organizations that trust Docmaker for their document operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/api" className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white" style={{ backgroundColor: Brand.navy }}>
              Get API Key
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold border border-slate-200 text-slate-900 hover:bg-slate-50 transition-all">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
