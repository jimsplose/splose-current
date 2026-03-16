import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="ml-64 flex-1">{children}</main>
        </div>
        <SpeedInsights />
      </body>
    </html>
  );
}
