import { Brand } from "@/config/site";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
          Privacy Policy
        </h1>
        <p className="text-lg text-slate-500 mb-12">Last updated: September 2026</p>

        <div className="h-px bg-slate-200 mb-12" />

        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>Introduction</h2>
          <p className="text-slate-600 leading-relaxed mb-8">
            Docmaker ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our document processing platform.
          </p>

          <div className="h-px bg-slate-200 my-12" />

          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>Information We Collect</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-8">
            <li>Account information (email, name)</li>
            <li>Documents you upload or create</li>
            <li>Usage data and analytics</li>
            <li>Payment information (processed securely by third parties)</li>
          </ul>

          <div className="h-px bg-slate-200 my-12" />

          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>How We Use Your Information</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We use the information we collect to provide, maintain, and improve our services, to process transactions, and to send you related information.
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-8">
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To provide customer support</li>
            <li>To gather analysis so that we can improve our service</li>
            <li>To detect, prevent, and address technical issues</li>
          </ul>

          <div className="h-px bg-slate-200 my-12" />

          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>Data Security</h2>
          <p className="text-slate-600 leading-relaxed mb-8">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
          </p>

          <div className="h-px bg-slate-200 my-12" />

          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>Contact Us</h2>
          <p className="text-slate-600 leading-relaxed">
            If you have questions about this Privacy Policy, please contact us at privacy@docmaker.io.
          </p>
        </div>
      </div>
    </div>
  );
}
