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

export const metadata: Metadata = {
  title: "Hyperfantasy - Creative Studio Design & Development",
  description: "A creative studio specializing in brand design, web development, and digital strategy. We help brands stand out in the digital landscape.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hyperfantasy",
  },
  icons: {
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

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
