import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero - Giant Typography */}
      <section className="py-32 sm:py-40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold tracking-widest uppercase mb-6" style={{ color: '#3CAE8B' }}>Enterprise</p>
          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.9] mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Built for<br />
            <span style={{ color: '#121660' }}>scale.</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-500 max-w-xl leading-relaxed mb-12">
            API access, batch processing, team collaboration, and enterprise-grade security. Everything your organization needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#121660' }}
            >
              Get Enterprise
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200" />
      </div>

      {/* Features - No Icons, Clean List */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-16" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            What's included
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-12">
            {[
              { title: "API Access", desc: "RESTful endpoints with comprehensive documentation. Integrate Docmaker into any application." },
              { title: "Batch Processing", desc: "Process hundreds of files in a single request. Convert, compress, merge — all in bulk." },
              { title: "Team Collaboration", desc: "Real-time editing with your entire team. Share, comment, and work together." },
              { title: "Admin Dashboard", desc: "Manage users, monitor usage, configure settings from a centralized panel." },
              { title: "SSO Integration", desc: "SAML, OIDC, or your identity provider. Secure access for your team." },
              { title: "Audit Logs", desc: "Track every action for compliance. Know who did what and when." },
              { title: "Webhook Support", desc: "Get notified of events in real-time. Build custom integrations." },
              { title: "Priority Support", desc: "Dedicated support with SLA guarantees. Response within hours." },
            ].map((feature) => (
              <div key={feature.title}>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-base text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200" />
      </div>

      {/* Pricing - Bold, Minimal */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Enterprise Plan
          </h2>
          <p className="text-xl text-slate-500 mb-16">
            One plan. Everything included. No limits.
          </p>

          <div className="border-t-2 border-slate-900 pt-8">
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-7xl sm:text-8xl font-bold" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>$49</span>
              <span className="text-2xl text-slate-500">/month</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-4 mb-12">
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
                <div key={item} className="flex items-center gap-3 text-lg text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#3CAE8B' }} />
                  {item}
                </div>
              ))}
            </div>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-10 py-5 text-lg font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#121660' }}
            >
              Get Enterprise
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200" />
      </div>

      {/* Custom */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Need something<br />custom?
          </h2>
          <p className="text-xl text-slate-500 mb-10 max-w-xl leading-relaxed">
            For larger teams, custom integrations, or specific compliance requirements, talk to our sales team.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all"
          >
            Talk to Sales
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200" />
      </div>

      {/* Use Cases - Clean Text */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-16" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Who uses Enterprise?
          </h2>
          <div className="space-y-12">
            {[
              { title: "Legal firms", desc: "Process contracts, NDAs, and legal documents in bulk with full audit trails." },
              { title: "Healthcare providers", desc: "Convert patient records, extract text from medical documents securely." },
              { title: "Education institutions", desc: "Batch process student submissions, generate certificates, manage documents." },
              { title: "Financial services", desc: "Process invoices, reports, and financial documents with compliance tracking." },
            ].map((useCase) => (
              <div key={useCase.title} className="border-l-4 pl-8" style={{ borderColor: '#121660' }}>
                <h3 className="text-2xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{useCase.title}</h3>
                <p className="text-lg text-slate-500">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-slate-200" />
      </div>

      {/* Final CTA */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Ready to scale?
          </h2>
          <p className="text-xl text-slate-500 mb-10 max-w-xl">
            Start your enterprise plan today or talk to sales for a custom solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#121660' }}
            >
              Start Enterprise
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-slate-900 border-2 border-slate-200 hover:border-slate-400 transition-all"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
