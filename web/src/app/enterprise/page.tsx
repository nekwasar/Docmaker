import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Brand } from "@/config/site";

const FEATURES = [
  "API access with dedicated endpoints",
  "Batch processing for 100+ files",
  "Team collaboration with real-time editing",
  "Admin dashboard with user management",
  "SSO integration (SAML, OIDC)",
  "Audit logs for compliance",
  "Webhook support for event notifications",
  "Priority support with SLA",
];

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Giant Header */}
        <h1 className="text-5xl sm:text-7xl font-bold text-slate-900 tracking-tight mb-8 leading-tight">
          Built for <span style={{ color: Brand.navy }}>scale</span>
        </h1>

        <p className="text-xl sm:text-2xl text-slate-600 mb-16 max-w-2xl leading-relaxed">
          Docmaker Enterprise gives your organization everything it needs to process documents at scale. API access, batch processing, team collaboration, and enterprise-grade security.
        </p>

        {/* Feature List - No Cards */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">What you get</h2>
          <ul className="space-y-4">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-lg text-slate-700">
                <Check className="h-6 w-6 mt-0.5 flex-shrink-0" style={{ color: Brand.teal }} />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Enterprise Plan</h2>
          <p className="text-lg text-slate-600 mb-8">
            One plan. Everything included. No limits.
          </p>

          <div className="border border-slate-200 rounded-2xl p-8 bg-white">
            <div className="mb-6">
              <span className="text-5xl font-bold text-slate-900">$49</span>
              <span className="text-xl text-slate-500">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-slate-700">
                <Check className="h-5 w-5" style={{ color: Brand.teal }} />
                Unlimited API requests
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <Check className="h-5 w-5" style={{ color: Brand.teal }} />
                Unlimited batch processing
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <Check className="h-5 w-5" style={{ color: Brand.teal }} />
                Team collaboration (up to 25 users)
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <Check className="h-5 w-5" style={{ color: Brand.teal }} />
                Admin dashboard
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <Check className="h-5 w-5" style={{ color: Brand.teal }} />
                SSO integration
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <Check className="h-5 w-5" style={{ color: Brand.teal }} />
                Audit logs
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <Check className="h-5 w-5" style={{ color: Brand.teal }} />
                Webhook support
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <Check className="h-5 w-5" style={{ color: Brand.teal }} />
                Priority support with SLA
              </li>
            </ul>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105 w-full sm:w-auto"
              style={{ backgroundColor: Brand.navy }}
            >
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Custom Enterprise */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Need something custom?</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl">
            For larger teams, custom integrations, or specific compliance requirements, talk to our sales team. We'll build a plan that works for you.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all"
          >
            Talk to Sales
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Who uses Enterprise?</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Legal firms</h3>
              <p className="text-lg text-slate-600">Process contracts, NDAs, and legal documents in bulk with full audit trails.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Healthcare providers</h3>
              <p className="text-lg text-slate-600">Convert patient records, extract text from medical documents securely.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Education institutions</h3>
              <p className="text-lg text-slate-600">Batch process student submissions, generate certificates, manage documents.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Financial services</h3>
              <p className="text-lg text-slate-600">Process invoices, reports, and financial documents with compliance tracking.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Ready to scale?</h2>
          <p className="text-lg text-slate-600 mb-8">
            Start your enterprise plan today or talk to sales for a custom solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white transition-all hover:scale-105"
              style={{ backgroundColor: Brand.navy }}
            >
              Start Enterprise
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold border-2 border-slate-200 text-slate-900 hover:border-slate-400 transition-all"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
