import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SessionProvider } from "@/components/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL("https://docmaker.io"),
  title: {
    default: "Docmaker — AI Document Generator & Free PDF Tools",
    template: "%s | Docmaker",
  },
  description: "Generate, convert, edit, and sign documents for free. No limits, no watermarks. AI-powered.",
  keywords: [
    "free pdf tools", "ai document generator", "free file converter",
    "merge pdf free", "compress pdf free", "ocr free", "e-sign free",
    "document generator", "pdf editor free", "split pdf free",
    "free pdf to word", "free jpg to pdf", "ai writing tool"
  ],
  authors: [{ name: "Docmaker" }],
  creator: "Docmaker",
  publisher: "Docmaker",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Docmaker — AI Document Generator & Free PDF Tools",
    description: "Generate, convert, edit, and sign documents for free. No limits, no watermarks. AI-powered.",
    url: "https://docmaker.io",
    siteName: "Docmaker",
    type: "website",
    images: [
      {
        url: "https://docmaker.io/api/og?title=Docmaker&subtitle=Try+it+free!",
        width: 1200,
        height: 630,
        alt: "Docmaker - AI document generator and free PDF tools",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Docmaker — AI Document Generator & Free PDF Tools",
    description: "Generate, convert, edit, and sign documents for free. No limits, no watermarks. AI-powered.",
    images: ["https://docmaker.io/api/og?title=Docmaker&subtitle=Try+it+free!"],
    site: "@docmaker",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://docmaker.io",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#121660",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Docmaker",
    url: "https://docmaker.io",
    logo: "https://docmaker.io/favicon.svg",
    sameAs: ["https://twitter.com/docmaker", "https://github.com/nekwasar/Docmaker"],
  };
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Docmaker",
    url: "https://docmaker.io",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://docmaker.io/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="search" type="application/opensearchdescription+xml" title="Docmaker" href="/opensearch.xml" />
      </head>
      <body className={`${inter.className} ${playfair.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />
        <SessionProvider>
          <div className="hidden lg:block">
            <Header />
          </div>
          <main className="min-h-screen pb-24">{children}</main>
          <BottomNav />
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
