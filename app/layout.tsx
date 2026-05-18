import type { Metadata, Viewport } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "MO3 Production | Architects of Emotion",
  description: "Cinematic stories that resonate. Commercial Ads, Reels, Podcasts, Video Clips.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "MO3 Production",
    description: "Architects of emotion - Media Production",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MO3 Production",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" data-public-language="en" className="h-full antialiased">
      <body className="min-h-full bg-[color:var(--background)] text-[color:var(--foreground)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
