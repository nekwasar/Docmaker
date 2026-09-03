import { Brand } from "@/config/site";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
          Terms of Service
        </h1>
        <p className="text-lg text-slate-500 mb-12">Last updated: September 2026</p>

        <div className="h-px bg-slate-200 mb-12" />

        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>Acceptance of Terms</h2>
          <p className="text-slate-600 leading-relaxed mb-8">
            By accessing or using Docmaker, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
          </p>

          <div className="h-px bg-slate-200 my-12" />

          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>Description of Service</h2>
          <p className="text-slate-600 leading-relaxed mb-8">
            Docmaker provides an all-in-one document processing platform that includes AI document generation, file conversion, PDF tools, OCR, and e-signatures. Our service is available via our website and mobile applications.
          </p>

          <div className="h-px bg-slate-200 my-12" />

          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>User Responsibilities</h2>
          <ul className="list-disc list-inside text-slate-600 space-y-2 mb-8">
            <li>You are responsible for maintaining the confidentiality of your account</li>
            <li>You are responsible for all activities that occur under your account</li>
            <li>You agree not to use the service for any unlawful purpose</li>
            <li>You agree not to attempt to gain unauthorized access to any part of the service</li>
          </ul>

          <div className="h-px bg-slate-200 my-12" />

          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>Intellectual Property</h2>
          <p className="text-slate-600 leading-relaxed mb-8">
            The service and its original content, features, and functionality are owned by Docmaker and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>

          <div className="h-px bg-slate-200 my-12" />

          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>Limitation of Liability</h2>
          <p className="text-slate-600 leading-relaxed mb-8">
            In no event shall Docmaker, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>

          <div className="h-px bg-slate-200 my-12" />

          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>Contact</h2>
          <p className="text-slate-600 leading-relaxed">
            If you have any questions about these Terms, please contact us at legal@docmaker.io.
          </p>
        </div>
      </div>
    </div>
  );
}
