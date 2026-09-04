import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact Docmaker — Get in Touch",
  description: "Have a question or need help? Contact the Docmaker team.",
  keywords: ["contact docmaker", "docmaker support", "get help"],
  openGraph: { title: "Contact Docmaker", description: "Get in touch with the Docmaker team.", images: [{ url: "https://docmaker.io/api/og?title=Contact+Us&subtitle=Get+in+touch&icon=docmaker", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Contact Docmaker" },
  alternates: { canonical: "https://docmaker.io/contact" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
