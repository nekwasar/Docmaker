import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Brand } from "@/config/site";

const HELP_TOPICS = [
  {
    title: "Getting Started",
    items: [
      { label: "How do I create an account?", answer: "Click 'Get Started' on the homepage or navigate to /register. You can sign up with email or Google." },
      { label: "Is Docmaker free?", answer: "Yes! All basic tools are completely free. No account required for most features." },
      { label: "Do I need to install anything?", answer: "No. Docmaker works entirely in your browser. No downloads or installations needed." },
    ],
  },
  {
    title: "AI Tools",
    items: [
      { label: "How does AI generation work?", answer: "Type a description of what you want, and our AI creates a professional document in seconds. You can choose document structure and add images." },
      { label: "What AI models do you use?", answer: "We support multiple AI providers including OpenAI, Anthropic, and open-source models via OpenRouter." },
      { label: "Can I edit AI-generated documents?", answer: "Yes! You can edit directly or use AI commands to make changes with natural language." },
    ],
  },
  {
    title: "PDF Tools",
    items: [
      { label: "Are PDF tools really free?", answer: "Yes. All PDF tools (merge, split, compress, edit, encrypt, watermark) are completely free with no limits." },
      { label: "Is there a file size limit?", answer: "Free users can process files up to 50MB. Pro users have no limits." },
      { label: "How do I merge multiple PDFs?", answer: "Navigate to /merge-pdf, upload your files, arrange the order, and click Merge." },
    ],
  },
  {
    title: "Conversion",
    items: [
      { label: "How many formats are supported?", answer: "We support 200+ conversion pairs across documents, spreadsheets, presentations, images, and more." },
      { label: "Is conversion quality preserved?", answer: "Yes. We guarantee 100% quality preservation for all conversions." },
      { label: "How fast is conversion?", answer: "Most conversions complete in under 5 seconds. Larger files may take longer." },
    ],
  },
  {
    title: "Account & Billing",
    items: [
      { label: "How do I upgrade to Pro?", answer: "Navigate to /pricing or click 'Upgrade' in your dashboard. Choose monthly or yearly billing." },
      { label: "Can I cancel my subscription?", answer: "Yes. You can cancel anytime from your account settings. Your access continues until the end of the billing period." },
      { label: "Do you offer refunds?", answer: "We offer refunds within 14 days of purchase. Contact support@docmaker.io for assistance." },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
          Help Center
        </h1>
        <p className="text-xl text-slate-500 mb-12 max-w-xl">
          Find answers to common questions about Docmaker.
        </p>

        <div className="h-px bg-slate-200 mb-12" />

        {HELP_TOPICS.map((topic, topicIndex) => (
          <div key={topic.title} className="mb-16">
            <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
              {topic.title}
            </h2>
            <div className="space-y-6">
              {topic.items.map((item, itemIndex) => (
                <div key={itemIndex} className="border-b border-slate-200 pb-6 last:border-0">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.label}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
            {topicIndex < HELP_TOPICS.length - 1 && (
              <div className="h-px bg-slate-200 mt-12" />
            )}
          </div>
        ))}

        <div className="h-px bg-slate-200 mb-12" />

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
            Still need help?
          </h2>
          <p className="text-lg text-slate-500 mb-8">
            Contact our support team and we'll get back to you within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: Brand.navy }}
          >
            Contact Support
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
