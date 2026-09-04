import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free E-Signature — Sign Documents Digitally | Docmaker",
  description: "Sign documents digitally for free. No account required, no limits.",
  keywords: ["e-sign free", "digital signature", "sign pdf free", "electronic signature"],
  openGraph: { title: "Free E-Signature — Docmaker", description: "Sign documents digitally for free.", images: [{ url: "https://docmaker.io/api/og?title=E-Signature&subtitle=Sign+documents+free&icon=sign", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Free E-Signature — Docmaker" },
  alternates: { canonical: "https://docmaker.io/sign" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
