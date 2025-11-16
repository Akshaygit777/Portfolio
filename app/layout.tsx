import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const nHassDisplayPro = localFont({
  src: [
    {
      path: "../public/fonts/NHaasGroteskDSPro.woff2",
      weight: '400', //niormal
    },
    {
      path: "../public/fonts/NHaasGroteskDSPro-medium.woff2",
      weight: '500', //medium
    },
    {
      path: "../public/fonts/NHaasGroteskDSPro-black.woff2",
      weight: '900', //black
    }
  ],
  variable: "--font-NHDP",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Akshay's Portfolio",
  description: "Web Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
  <script
    src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
    async
    defer
  />
</head>

      <body
        className={`${geistSans.variable} ${spaceGrotesk.variable} ${nHassDisplayPro.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <SpeedInsights />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
