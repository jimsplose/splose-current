import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import TopNav from "@/components/TopNav";
import DevNavigator from "@/components/DevNavigator";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Splose - Practice Management",
  description: "High-fidelity practice management prototype for allied health professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <TopNav />
        <main>{children}</main>
        <Suspense fallback={null}>
          <DevNavigator />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
