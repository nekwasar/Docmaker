import { Brand } from "@/config/site";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
          About Docmaker
        </h1>

        <p className="text-xl text-slate-500 mb-16 max-w-2xl leading-relaxed">
          We believe document processing should be simple, fast, and accessible to everyone.
        </p>

        <div className="h-px bg-slate-200 mb-16" />

        <div className="space-y-16">
          <div>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>Our Mission</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Make document tasks effortless, free, and high-quality for everyone, everywhere. No subscriptions, no watermarks, no switching between five different websites.
            </p>
          </div>

          <div className="h-px bg-slate-200" />

          <div>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>What We Believe</h2>
            <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
              <p><strong style={{ color: '#0F172A' }}>Documents should be free.</strong> Basic tools like PDF merge, split, and convert shouldn't cost money.</p>
              <p><strong style={{ color: '#0F172A' }}>Privacy matters.</strong> Your files are processed in your browser — nothing leaves your device.</p>
              <p><strong style={{ color: '#0F172A' }}>One platform is enough.</strong> Stop switching between 5 different websites for document tasks.</p>
              <p><strong style={{ color: '#0F172A' }}>AI should help, not replace.</strong> Our AI tools enhance your work, not automate it away.</p>
            </div>
          </div>

          <div className="h-px bg-slate-200" />

          <div>
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>The Numbers</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {[
                { number: "200+", label: "Format conversions" },
                { number: "12", label: "AI-powered tools" },
                { number: "100%", label: "Free for basic use" },
                { number: "0", label: "Watermarks, ever" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-4xl sm:text-5xl font-bold mb-2" style={{ fontFamily: 'var(--font-playfair)', color: '#121660' }}>{stat.number}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
