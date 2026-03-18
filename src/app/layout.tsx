import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import TopNav from "@/components/TopNav";
import DevNavigator from "@/components/DevNavigator";

export const metadata: Metadata = {
  title: "Splose - Practice Management",
  description:
    "High-fidelity practice management prototype for allied health professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <TopNav />
        <main>{children}</main>
        <Suspense fallback={null}>
          <DevNavigator />
        </Suspense>
      </body>
    </html>
  );
}
