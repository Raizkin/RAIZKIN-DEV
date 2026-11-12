import { dictionaries } from "@/i18n/messages"
import { profile } from "@/data/raizkin"
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { asset } from "@/lib/utils";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const isVercel = process.env.NEXT_PUBLIC_DEPLOY_TARGET === "vercel";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${profile.name} | ${profile.title}`,
  description: dictionaries.en.about.paragraphs.join(" "),
  keywords: ["Next.js", "React", "GSAP", "UI/UX", "Frontend Developer", "Web Developer", "Kyiv"],
  authors: [{ name: `${profile.name}`, url: SITE_URL }],
  creator: `${profile.name}`,
  icons: { icon: { url: asset("/favicon.svg"), type: "image/svg+xml" } },
  openGraph: {
    title: `${profile.name} | Frontend & UI/UX Engineer`,
    description: dictionaries.uk.about.paragraphs[0],
    url: SITE_URL,
    siteName: `${profile.name} Portfolio`,
    images: [{ url: "/og-image.svg", alt: `${profile.name} Portfolio Screenshot` }],
    locale: "uk_UA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} | Frontend & UI/UX Engineer`,
    description: dictionaries.uk.about.paragraphs[0],
    images: ["/og-image.svg"],
  },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the head script may set data-theme before React hydrates.
    <html lang="uk" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        {isVercel && <Analytics />}
      </body>
    </html>
  );
}
