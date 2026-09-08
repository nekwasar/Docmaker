import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account — Docmaker",
  description: "Create a free Docmaker account to transfer files securely.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://docmaker.io/signup" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
