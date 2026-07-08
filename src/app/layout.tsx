import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppDataProvider } from "@/context/AppDataContext";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { SplashScreen } from "@/components/pwa/SplashScreen";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "WordNest | Your Personal Vocabulary Vault",
  description:
    "A calm, document-like vocabulary vault. Save words, meanings, examples, and review at your pace.",
  manifest: "/manifest.json",
  applicationName: "WordNest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "WordNest",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0075de",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link
          rel="apple-touch-startup-image"
          href="/splash/splash-1170x2532.png"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/splash-1284x2778.png"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/splash-750x1334.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/splash-1080x1920.png"
          media="(device-width: 360px) and (device-height: 640px) and (-webkit-device-pixel-ratio: 3)"
        />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-dvh antialiased">
        <AppDataProvider>
          <SplashScreen />
          {children}
          <ServiceWorkerRegister />
        </AppDataProvider>
      </body>
    </html>
  );
}
