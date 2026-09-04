import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Docmaker Pricing — Free for Everyone | Enterprise $49/mo",
  description: "All Docmaker tools are free. No limits, no watermarks. Enterprise plan for API access and teams at $49/month.",
  keywords: ["docmaker pricing", "free pdf tools", "document tool pricing", "enterprise plan"],
  openGraph: { title: "Docmaker Pricing — Free for Everyone", description: "All tools free. Enterprise at $49/month.", images: [{ url: "https://docmaker.io/api/og?title=Pricing&subtitle=Free+for+everyone&icon=docmaker", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Docmaker Pricing — Free for Everyone" },
  alternates: { canonical: "https://docmaker.io/pricing" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
