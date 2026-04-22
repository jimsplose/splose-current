import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeProvider, Toaster } from "@/components/ds";
import "./globals.css";
import SploseTopNav from "@/components/SploseTopNav";
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
      <body>
        <AntdRegistry>
          <ThemeProvider>
            <SploseTopNav />
            <main>{children}</main>
            <Suspense fallback={null}>
              <DevNavigator />
            </Suspense>
            <Analytics />
            <Toaster />
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
