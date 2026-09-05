"use client";

import Link from "next/link";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { ArrowRight } from "lucide-react";

const PDF_TOOLS = [
  {
    name: "Merge PDF",
    description: "Combine multiple PDF files into one",
    href: "/pdf/merge",
    color: "#121660",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: "Split PDF",
    description: "Extract pages from a PDF file",
    href: "/pdf/split",
    color: "#0171DF",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    name: "Compress PDF",
    description: "Reduce PDF file size",
    href: "/pdf/compress",
    color: "#3CAE8B",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
  },
  {
    name: "Watermark PDF",
    description: "Add text watermark to PDF",
    href: "/pdf/watermark",
    color: "#121660",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    name: "Rotate PDF",
    description: "Rotate PDF pages",
    href: "/pdf/rotate",
    color: "#0171DF",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    name: "Protect PDF",
    description: "Password protect PDF files",
    href: "/pdf/protect",
    color: "#3CAE8B",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];

export default function PdfToolsPage() {
  return (
    <ToolPageLayout title="PDF Tools" color="navy">
      <div className="space-y-6">
        <p className="text-lg text-slate-600">
          Free PDF tools. No limits, no watermarks. All processing happens on our servers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PDF_TOOLS.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: `${tool.color}10`, color: tool.color }}
              >
                {tool.icon}
              </div>
              <h3 className="font-semibold text-slate-900 group-hover:text-[#121660] transition-colors">
                {tool.name}
              </h3>
              <p className="text-sm text-slate-500 mt-1">{tool.description}</p>
              <div className="flex items-center gap-1 mt-3 text-sm font-medium" style={{ color: tool.color }}>
                Try now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ToolPageLayout>
  );
}
