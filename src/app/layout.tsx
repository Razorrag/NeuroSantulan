import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
  colorScheme: 'light',
};

export const metadata: Metadata = {
  title: "Neurosantulan - Modern Physiotherapy Clinic",
  description: "Recovery support that feels modern, clear, and human. Book physiotherapy appointments, track your progress, and get personalized treatment plans.",
  keywords: ["physiotherapy", "clinic", "recovery", "treatment", "healthcare", "appointment booking"],
  authors: [{ name: "Neurosantulan" }],
  openGraph: {
    title: "Neurosantulan - Modern Physiotherapy Clinic",
    description: "Recovery support that feels modern, clear, and human.",
    type: "website",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
