import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Brand } from "@/config/site";

const POSTS = [
  { slug: "getting-started-with-docmaker", title: "Getting Started with Docmaker", excerpt: "Learn how to use Docmaker to process documents in seconds.", date: "Sep 1, 2026", category: "Tutorial" },
  { slug: "top-pdf-tools-2026", title: "Top PDF Tools in 2026", excerpt: "A comparison of the best PDF tools available this year.", date: "Aug 28, 2026", category: "Guide" },
  { slug: "ai-document-generation", title: "AI Document Generation Explained", excerpt: "How artificial intelligence is transforming document creation.", date: "Aug 20, 2026", category: "AI" },
  { slug: "batch-processing-enterprise", title: "Batch Processing for Enterprise", excerpt: "Process hundreds of documents at once with our API.", date: "Aug 15, 2026", category: "Enterprise" },
  { slug: "pdf-security-best-practices", title: "PDF Security Best Practices", excerpt: "How to protect your PDF documents with encryption.", date: "Aug 10, 2026", category: "Security" },
  { slug: "file-conversion-guide", title: "Complete File Conversion Guide", excerpt: "Convert between 200+ formats with ease.", date: "Aug 5, 2026", category: "Guide" },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8" style={{ fontFamily: 'var(--font-playfair)', color: '#0F172A' }}>
          Blog
        </h1>

        <p className="text-xl text-slate-500 mb-16 max-w-2xl leading-relaxed">
          Tips, guides, and insights about document processing.
        </p>

        <div className="h-px bg-slate-200 mb-12" />

        <div className="space-y-8">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: Brand.navy + '10', color: Brand.navy }}>
                      {post.category}
                    </span>
                    <span className="text-sm text-slate-400">{post.date}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-2 group-hover:underline">
                    {post.title}
                  </h2>
                  <p className="text-slate-600">{post.excerpt}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 mt-2 flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
