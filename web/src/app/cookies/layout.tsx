import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Docmaker Cookie Policy — How We Use Cookies",
  description: "Learn about the cookies Docmaker uses and how to manage your preferences.",
  keywords: ["docmaker cookies", "cookie policy", "cookie settings"],
  openGraph: { title: "Docmaker Cookie Policy", description: "How we use cookies.", images: [{ url: "https://docmaker.io/api/og?title=Cookie+Policy&subtitle=How+we+use+cookies&icon=docmaker", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Docmaker Cookie Policy" },
  alternates: { canonical: "https://docmaker.io/cookies" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
