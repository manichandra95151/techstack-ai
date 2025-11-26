import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechStack AI - AI-Powered Architecture Design for Developers",
  description: "Stop wasting time on boilerplate. Get a complete tech stack, feature breakdown, and API specification for your project in seconds with AI-powered architecture design.",
  keywords: ["tech stack", "AI architecture", "project planning", "developer tools", "API design", "tech stack generator", "software architecture", "project roadmap"],
  authors: [{ name: "TechStack AI" }],
  creator: "TechStack AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://techstack-ai.vercel.app",
    title: "TechStack AI - AI-Powered Architecture Design",
    description: "Get a complete tech stack, feature breakdown, and API specification for your project in seconds.",
    siteName: "TechStack AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechStack AI - AI-Powered Architecture Design",
    description: "Get a complete tech stack, feature breakdown, and API specification for your project in seconds.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics /> 
      </body>
    </html>
  );
}
