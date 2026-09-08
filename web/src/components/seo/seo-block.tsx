import Link from "next/link";

interface FaqItem { q: string; a: string }

interface SeoBlockProps {
  title: string;
  intro: string;
  steps: { title: string; desc: string }[];
  benefits: string[];
  faqs: FaqItem[];
  related?: { label: string; href: string }[];
}

export function SeoBlock({ title, intro, steps, benefits, faqs, related }: SeoBlockProps) {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.desc,
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">{title}</h2>
        <p className="text-slate-600 leading-relaxed">{intro}</p>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">How it works — 3 easy steps</h2>
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#121660] text-white flex items-center justify-center text-sm font-bold">{i + 1}</span>
              <div>
                <p className="font-semibold text-slate-900">{s.title}</p>
                <p className="text-sm text-slate-600 mt-1">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Why use Docmaker?</h2>
        <ul className="space-y-2">
          {benefits.map((b) => (
            <li key={b} className="flex gap-3 text-sm text-slate-600">
              <span className="text-green-500 mt-0.5">✓</span>{b}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="border border-slate-200 rounded-xl p-4 bg-white">
              <p className="font-semibold text-slate-900 text-sm">{f.q}</p>
              <p className="text-sm text-slate-600 mt-2">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {related && related.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Related tools</h3>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Link key={r.href} href={r.href} className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm text-slate-700 hover:border-slate-300">
                {r.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
