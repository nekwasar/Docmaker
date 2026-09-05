"use client";

import Link from "next/link";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { FileText, FileImage, Film, Music, FileSpreadsheet, ArrowRight } from "lucide-react";

const CONVERSION_CATEGORIES = [
  {
    title: "Document to PDF",
    description: "Convert Word, Excel, PowerPoint, and more to PDF",
    icon: <FileText className="h-6 w-6" />,
    color: "#0171DF",
    tools: [
      { name: "Word to PDF", from: "DOCX", to: "PDF", href: "/convert/docx-to-pdf" },
      { name: "Excel to PDF", from: "XLSX", to: "PDF", href: "/convert/docx-to-pdf" },
      { name: "PowerPoint to PDF", from: "PPTX", to: "PDF", href: "/convert/docx-to-pdf" },
      { name: "HTML to PDF", from: "HTML", to: "PDF", href: "/convert/docx-to-pdf" },
      { name: "EPUB to PDF", from: "EPUB", to: "PDF", href: "/convert/docx-to-pdf" },
    ],
  },
  {
    title: "PDF to Other Formats",
    description: "Convert PDF to Word, images, text, and more",
    icon: <FileText className="h-6 w-6" />,
    color: "#3CAE8B",
    tools: [
      { name: "PDF to Word", from: "PDF", to: "DOCX", href: "/convert/pdf-to-docx" },
      { name: "PDF to Images", from: "PDF", to: "JPG/PNG", href: "/convert/pdf-to-jpg" },
      { name: "PDF to Text", from: "PDF", to: "TXT", href: "/convert/pdf-to-docx" },
      { name: "PDF to HTML", from: "PDF", to: "HTML", href: "/convert/pdf-to-docx" },
    ],
  },
  {
    title: "Image Conversion",
    description: "Convert between JPG, PNG, WEBP, GIF, and more",
    icon: <FileImage className="h-6 w-6" />,
    color: "#121660",
    tools: [
      { name: "Image Converter", from: "IMG", to: "IMG", href: "/convert/image" },
      { name: "Images to PDF", from: "IMG", to: "PDF", href: "/convert/jpg-to-pdf" },
    ],
  },
  {
    title: "Audio Conversion",
    description: "Convert between MP3, WAV, AAC, FLAC, and more",
    icon: <Music className="h-6 w-6" />,
    color: "#FFD140",
    tools: [
      { name: "Audio Converter", from: "AUDIO", to: "AUDIO", href: "/convert/audio" },
    ],
  },
  {
    title: "Video Conversion",
    description: "Convert between MP4, AVI, MOV, MKV, and more",
    icon: <Film className="h-6 w-6" />,
    color: "#0171DF",
    tools: [
      { name: "Video Converter", from: "VIDEO", to: "VIDEO", href: "/convert/video" },
      { name: "Video to Audio", from: "VIDEO", to: "MP3", href: "/convert/video" },
      { name: "Video to GIF", from: "VIDEO", to: "GIF", href: "/convert/video" },
    ],
  },
  {
    title: "Spreadsheet Conversion",
    description: "Convert between CSV, XLSX, and JSON",
    icon: <FileSpreadsheet className="h-6 w-6" />,
    color: "#3CAE8B",
    tools: [
      { name: "Excel Converter", from: "CSV", to: "XLSX", href: "/convert/excel" },
    ],
  },
];

export default function ConvertPage() {
  return (
    <ToolPageLayout title="Convert Files" color="blue">
      <div className="space-y-8">
        <p className="text-lg text-slate-600">
          Convert between 38+ file formats. Documents, images, audio, video, and spreadsheets.
        </p>

        <div className="grid gap-4">
          {CONVERSION_CATEGORIES.map((category) => (
            <div key={category.title} className="rounded-2xl bg-white border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}10`, color: category.color }}
                >
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{category.title}</h3>
                  <p className="text-sm text-slate-500">{category.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{tool.name}</p>
                      <p className="text-xs text-slate-500">
                        {tool.from} → {tool.to}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolPageLayout>
  );
}
