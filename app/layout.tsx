import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AthloCode | Premium Fitness Coaching & AI-Powered Meal Plans",
  description: "Transform your body with personalized coaching, AI-customized meal plans, and real-time trainer support. Join 500+ members today.",
  keywords: ["fitness coaching", "meal plans", "personal trainer", "weight loss", "muscle building"],
  openGraph: {
    title: "AthloCode | Premium Fitness Coaching",
    description: "Transform your body with personalized coaching and AI meal plans",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-brand-black text-white">
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
