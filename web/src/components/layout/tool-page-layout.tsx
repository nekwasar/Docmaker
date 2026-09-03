import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/config/site";

type ToolColor = 'navy' | 'teal' | 'blue' | 'yellow';

interface ToolPageLayoutProps {
  title: string;
  color: ToolColor;
  children: React.ReactNode;
}

const colorMap: Record<ToolColor, string> = {
  navy: Brand.navy,
  teal: Brand.teal,
  blue: Brand.blue,
  yellow: Brand.yellow,
};

export function ToolPageLayout({ title, color, children }: ToolPageLayoutProps) {
  const bgColor = colorMap[color];
  const isLight = color === 'yellow';

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {/* Colored Header */}
      <div className="relative" style={{ backgroundColor: bgColor }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
              style={{ backgroundColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' }}
            >
              <ArrowLeft className="h-5 w-5" style={{ color: isLight ? '#0F172A' : '#FFFFFF' }} />
            </Link>
            <h1 className="text-2xl font-bold" style={{ color: isLight ? '#0F172A' : '#FFFFFF' }}>
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
