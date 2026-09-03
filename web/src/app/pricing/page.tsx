import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Brand } from "@/config/site";

const FREE_FEATURES = [
  "AI document generation",
  "PDF merge, split, compress, edit",
  "E-signatures",
  "OCR text extraction",
  "200+ file conversions",
  "File transfer between devices",
  "No watermarks",
  "No file limits",
  "No account required",
];

const ENTERPRISE_FEATURES = [
  "Everything in Free",
  "API access with dedicated endpoints",
  "Batch processing for 100+ files",
  "Team collaboration (up to 25 users)",
  "Admin dashboard",
  "SSO integration",
  "Audit logs",
  "Webhook support",
  "Priority support with SLA",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Giant Header */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
          Free for <span style={{ color: '#121660' }}>everyone</span>
        </h1>

        <p className="text-xl sm:text-2xl text-slate-500 mb-16 max-w-2xl leading-relaxed">
          All Docmaker tools are free. No limits, no watermarks, no account required. 
          Enterprise only if you need API access and team features.
        </p>

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-16" />

        {/* Free Tier */}
        <div className="mb-20">
          <div className="flex items-baseline gap-4 mb-8">
            <h2 className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
              Free
            </h2>
            <span className="text-2xl text-slate-500">forever</span>
          </div>
          <p className="text-lg text-slate-600 mb-8 max-w-xl">
            Everything you need, completely free. No credit card, no account required.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
            {FREE_FEATURES.map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-slate-700">
                <Check className="h-5 w-5 flex-shrink-0" style={{ color: '#3CAE8B' }} />
                {feature}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#121660' }}
            >
              Start for Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-16" />

        {/* Enterprise Tier */}
        <div className="mb-16">
          <div className="flex items-baseline gap-4 mb-8">
            <h2 className="text-4xl sm:text-5xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
              Enterprise
            </h2>
            <span className="text-2xl text-slate-500">$49/month</span>
          </div>
          <p className="text-lg text-slate-600 mb-8 max-w-xl">
            For teams that need API access, batch processing, and advanced features.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
            {ENTERPRISE_FEATURES.map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-slate-700">
                <Check className="h-5 w-5 flex-shrink-0" style={{ color: '#3CAE8B' }} />
                {feature}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/enterprise"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#121660' }}
            >
              Get Enterprise
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-16" />

        {/* FAQ */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Questions?
          </h2>
          <div className="space-y-6">
            {[
              { q: "Is Docmaker really free?", a: "Yes. All tools are completely free with no limits, no watermarks, and no account required." },
              { q: "What's included in Enterprise?", a: "API access, batch processing, team collaboration, admin dashboard, SSO, and priority support." },
              { q: "Can I upgrade later?", a: "Yes. Start free and upgrade to Enterprise whenever you need advanced features." },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
