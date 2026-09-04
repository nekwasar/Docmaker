import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: {
    default: "Docmaker — Free PDF Tools, AI Document Generator, File Converter",
    template: "%s | Docmaker",
  },
  description: "Generate, convert, edit, sign, and compress documents for free. AI-powered document tools with no limits, no watermarks, no account required. 200+ format conversions.",
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
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Docmaker — Free PDF Tools & AI Document Generator",
    description: "Generate, convert, edit, sign documents for free. No limits, no watermarks. AI-powered.",
    url: "https://docmaker.io",
    siteName: "Docmaker",
    images: [
      {
        url: "https://docmaker.io/api/og?title=Docmaker&subtitle=Free+PDF+Tools+%26+AI+Document+Generator",
        width: 1200,
        height: 630,
        alt: "Docmaker - Free PDF Tools & AI Document Generator",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Docmaker — Free PDF Tools & AI Document Generator",
    description: "Generate, convert, edit, sign documents for free. No limits, no watermarks.",
    images: ["https://docmaker.io/api/og?title=Docmaker&subtitle=Free+PDF+Tools+%26+AI+Document+Generator"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable}`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
