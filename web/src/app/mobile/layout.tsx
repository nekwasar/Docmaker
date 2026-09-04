import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Docmaker Mobile App — iOS & Android | Free Document Tools",
  description: "Download the Docmaker mobile app for iOS and Android. Create, convert, sign, and manage documents on the go.",
  keywords: ["docmaker mobile app", "document app ios", "document app android", "free document app"],
  openGraph: { title: "Docmaker Mobile App — iOS & Android", description: "Free document tools on mobile.", images: [{ url: "https://docmaker.io/api/og?title=Mobile+App&subtitle=iOS+%26+Android&icon=mobile", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Docmaker Mobile App" },
  alternates: { canonical: "https://docmaker.io/mobile" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
