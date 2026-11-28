import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();
const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NextRole — Asisten Cerdas Pencarian Kerja & Pelacak Lamaran",
    template: "%s | NextRole",
  },
  description:
    "Kelola lamaran kerja dengan papan Kanban 5 tahap, Smart AI Job Clipper, arsip deskripsi lowongan permanen, skor kecocokan CV otomatis, dan pengingat follow-up H+7.",
  keywords: [
    "NextRole",
    "pelacak lamaran kerja",
    "job tracker Indonesia",
    "job application tracker",
    "smart job clipper",
    "skor kecocokan CV",
    "follow-up lamaran kerja H+7",
    "kanban lamaran kerja",
  ],
  applicationName: "NextRole",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "NextRole",
    title: "NextRole — Asisten Cerdas Pencarian Kerja & Pelacak Lamaran",
    description:
      "Satu ruang tenang untuk kelola lamaran kerja, arsip JD permanen, skor kecocokan CV otomatis, dan pengingat follow-up H+7.",
    images: [
      {
        url: "/images/brand/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "NextRole — Intelligent Job Hunt Assistant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextRole — Asisten Cerdas Pencarian Kerja",
    description:
      "Kelola lamaran kerja dengan Smart AI Clipper, Kanban 5 tahap, skor kecocokan CV, dan draf follow-up H+7.",
    images: ["/images/brand/android-chrome-512x512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: gscVerification ? { google: gscVerification } : undefined,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NextRole",
  },
  icons: {
    icon: [
      { url: "/images/brand/favicon.ico", sizes: "any" },
      { url: "/images/brand/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/brand/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/images/brand/favicon.ico",
    apple: [{ url: "/images/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0284C7",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} antialiased`}>
      <body className="min-h-dvh flex flex-col font-sans">{children}</body>
    </html>
  );
}
