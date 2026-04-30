import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "MO3 Production | Architects of Emotion",
  description: "Cinematic stories that resonate. Commercial Ads, Reels, Podcasts, Video Clips.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "MO3 Production",
    description: "Architects of emotion — Media Production",
    type: "website",
  },
  other: {
    'leaflet-css': 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased"
    >
      <body className="min-h-full bg-[color:var(--background)] text-[color:var(--foreground)] transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
