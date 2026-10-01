import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { PostHogProvider } from "@/components/posthog-provider";
import { PWARegister } from "@/components/pwa-register";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://hyperfantasy.co'
const SITE_NAME = 'Hyperfantasy'
const DEFAULT_DESC = 'A creative collective of senior designers, developers, and brand strategists — assembled per project, without the agency overhead. Based in Indonesia, working globally.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Hyperfantasy — Creative Studio for Design & Development',
    template: '%s — Hyperfantasy',
  },
  description: DEFAULT_DESC,
  keywords: [
    'creative studio', 'brand identity', 'UI/UX design', 'web development',
    'design system', 'Indonesia', 'freelance design', 'startup design',
    'studio desain', 'desain brand', 'pengembangan web',
  ],
  authors: [{ name: 'Hyperfantasy', url: SITE_URL }],
  creator: 'Hyperfantasy',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'id_ID',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Hyperfantasy — Creative Studio for Design & Development',
    description: DEFAULT_DESC,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Hyperfantasy Creative Studio' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@hyperfantasy_',
    creator: '@hyperfantasy_',
    title: 'Hyperfantasy — Creative Studio for Design & Development',
    description: DEFAULT_DESC,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hyperfantasy",
  },
  icons: {
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  other: { "mobile-web-app-capable": "yes" },
};

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Hyperfantasy',
  url: SITE_URL,
  logo: `${SITE_URL}/logo-pictogram.svg`,
  description: DEFAULT_DESC,
  foundingDate: '2015',
  areaServed: ['ID', 'US', 'AU', 'NZ', 'AE', 'SA'],
  sameAs: [
    'https://www.instagram.com/hyperfantasy.creative/',
    'https://dribbble.com/hyperfantasy',
    'https://www.behance.net/hyperfantasy',
    'https://x.com/hyperfantasy_',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello.hyperfantasy@gmail.com',
    contactType: 'customer service',
  },
}

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Hyperfantasy',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/articles?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.dribbble.com" />
        <link rel="preconnect" href="https://mir-s3-cdn-cf.behance.net" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-white focus:text-slate-900 focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:bg-black dark:focus:text-white dark:focus:ring-white"
        >
          Skip to main content
        </a>
        <PostHogProvider>
          <ThemeProvider>
            {/* Sits above the sticky footer in z-order; opaque bg covers it while scrolling */}
            <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'var(--background)' }}>
              <Navbar />
              <main id="main-content">
                {children}
              </main>
            </div>
            <Footer />
          </ThemeProvider>
        </PostHogProvider>
        <PWARegister />
        <Analytics />
        <SpeedInsights />
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  );
}
