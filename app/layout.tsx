import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/features/navigation/NavBar";
import { BubbleBackground } from "@/components/ui/shadcn-io/bubble-background/index";
import {GreetingScreen} from "@/components/features/home/GreetingScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "pixcells",
  description: "Photography portfolio showcasing creative moments captured through the lens.",
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
        <GreetingScreen />
        <BubbleBackground
          interactive
          colors={{
            first: '20,30,60',      // Deep navy blue
            second: '30,50,100',    // Rich blue
            third: '40,70,130',     // Medium blue
            fourth: '25,45,80',     // Dark blue
            fifth: '35,60,110',     // Ocean blue
            sixth: '50,80,140'      // Brighter blue
          }}
          className="fixed inset-0 bg-gradient-to-br from-[#0a1628] to-[#050a14] -z-10"
        />
        
        <div className="relative z-10 w-full max-w-full overflow-x-hidden p-4">
          <NavBar />
          {children}
        </div>
      </body>
    </html>
  );
}
