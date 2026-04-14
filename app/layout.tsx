import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";

const inter = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CivicPulse Global",
  description: "Empowering Citizens, Improving Infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className={`${inter.variable} antialiased`}>
        {/* <Navbar /> */}
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
