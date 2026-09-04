import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free PDF Encryption — Password Protect Documents | Docmaker",
  description: "Password-protect your PDF documents for free. Secure encryption with no limits.",
  keywords: ["encrypt pdf free", "password protect pdf", "pdf security", "lock pdf"],
  openGraph: { title: "Free PDF Encryption — Docmaker", description: "Password-protect PDF documents for free.", images: [{ url: "https://docmaker.io/api/og?title=Encrypt+PDF&subtitle=Password+protect+documents&icon=encrypt", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Free PDF Encryption — Docmaker" },
  alternates: { canonical: "https://docmaker.io/encrypt" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
