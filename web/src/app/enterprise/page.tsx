import Link from "next/link";
import { ArrowRight, Check, FileText, Layers, Users, Settings, Lock, BarChart3, Code, Globe, Shield } from "lucide-react";
import { Brand } from "@/config/site";

const FEATURES = [
  { icon: Code, title: "API Access", description: "RESTful endpoints with comprehensive documentation" },
  { icon: Layers, title: "Batch Processing", description: "Process hundreds of files in a single request" },
  { icon: Users, title: "Team Collaboration", description: "Real-time editing with your entire team" },
  { icon: Settings, title: "Admin Dashboard", description: "Manage users, monitor usage, configure settings" },
  { icon: Lock, title: "SSO Integration", description: "SAML, OIDC, or your identity provider" },
  { icon: BarChart3, title: "Audit Logs", description: "Track every action for compliance" },
  { icon: Globe, title: "Webhook Support", description: "Get notified of events in real-time" },
  { icon: Shield, title: "Priority Support", description: "Dedicated support with SLA guarantees" },
];

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        {/* Giant Header */}
        <h1 className="text-5xl sm:text-7xl font-bold text-slate-900 tracking-tight mb-8 leading-tight">
          Built for <span style={{ color: Brand.navy }}>scale</span>
        </h1>

        <p className="text-xl sm:text-2xl text-slate-600 mb-12 max-w-2xl leading-relaxed">
          Docmaker Enterprise gives your organization everything it needs to process documents at scale.
        </p>

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-12" />

        {/* Feature List with Icons */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">What you get</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl flex-shrink-0" style={{ backgroundColor: Brand.navy + '10' }}>
                  <feature.icon className="h-5 w-5" style={{ color: Brand.navy }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-12" />

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
            <div className="h-px bg-slate-100 mb-6" />
            <ul className="space-y-3 mb-8">
              {[
                "Unlimited API requests",
                "Unlimited batch processing",
                "Team collaboration (up to 25 users)",
                "Admin dashboard",
                "SSO integration",
                "Audit logs",
                "Webhook support",
                "Priority support with SLA",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-slate-700">
                  <Check className="h-5 w-5 flex-shrink-0" style={{ color: Brand.teal }} />
                  {item}
                </li>
              ))}
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

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-12" />

        {/* Custom Enterprise */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Need something custom?</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl">
            For larger teams, custom integrations, or specific compliance requirements, talk to our sales team.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-all"
          >
            Talk to Sales
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-12" />

        {/* Use Cases */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Who uses Enterprise?</h2>
          <div className="space-y-8">
            {[
              { title: "Legal firms", description: "Process contracts, NDAs, and legal documents in bulk with full audit trails." },
              { title: "Healthcare providers", description: "Convert patient records, extract text from medical documents securely." },
              { title: "Education institutions", description: "Batch process student submissions, generate certificates, manage documents." },
              { title: "Financial services", description: "Process invoices, reports, and financial documents with compliance tracking." },
            ].map((useCase) => (
              <div key={useCase.title} className="border-l-4 pl-6" style={{ borderColor: Brand.navy }}>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{useCase.title}</h3>
                <p className="text-lg text-slate-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200 mb-12" />

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
