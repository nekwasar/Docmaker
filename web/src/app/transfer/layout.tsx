import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free File Transfer — Send Files Between Devices | Docmaker",
  description: "Transfer files between your phone and computer instantly. Free, no account required.",
  keywords: ["file transfer free", "send files between devices", "phone to computer transfer"],
  openGraph: { title: "Free File Transfer — Docmaker", description: "Send files between devices for free.", images: [{ url: "https://docmaker.io/api/og?title=File+Transfer&subtitle=Send+files+between+devices&icon=transfer", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "Free File Transfer — Docmaker" },
  alternates: { canonical: "https://docmaker.io/transfer" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
