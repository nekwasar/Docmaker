import { Brand } from "@/config/site";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
          Cookie Policy
        </h1>
        <p className="text-lg text-slate-500 mb-12">Last updated: September 2026</p>

        <div className="h-px bg-slate-200 mb-12" />

        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>What Are Cookies</h2>
          <p className="text-slate-600 leading-relaxed mb-8">
            Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
          </p>

          <div className="h-px bg-slate-200 my-12" />

          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>How We Use Cookies</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-8">
            <li><strong>Essential cookies:</strong> Required for the website to function properly</li>
            <li><strong>Performance cookies:</strong> Help us understand how visitors interact with our website</li>
            <li><strong>Functional cookies:</strong> Remember your preferences and settings</li>
            <li><strong>Marketing cookies:</strong> Used to deliver relevant advertisements</li>
          </ul>

          <div className="h-px bg-slate-200 my-12" />

          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>Managing Cookies</h2>
          <p className="text-slate-600 leading-relaxed mb-8">
            You can control and manage cookies in various ways. Please note that removing or blocking cookies may impact your experience on our website and some features may not work as intended.
          </p>

          <div className="h-px bg-slate-200 my-12" />

          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>Contact Us</h2>
          <p className="text-slate-600 leading-relaxed">
            If you have any questions about our use of cookies, please contact us at privacy@docmaker.io.
          </p>
        </div>
      </div>
    </div>
  );
}
