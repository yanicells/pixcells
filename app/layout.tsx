import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/features/navigation/NavBar";
import { BackgroundWrapper } from "@/components/shared/BackgroundWrapper";
import { BackgroundToggle } from "@/components/shared/BackgroundToggle";
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
        <BackgroundWrapper />
        
        <div className="relative z-10 w-full max-w-full overflow-x-hidden p-4">
          <NavBar />
          {children}
        </div>

        <BackgroundToggle />
      </body>
    </html>
  );
}
