import type { Metadata } from "next";
import { Unica_One, Space_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const unicaOne = Unica_One({
  variable: "--font-unica",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | AlgoViz",
    default: "AlgoViz — Algorithm Visualizer",
  },
  description:
    "Interactive algorithm visualizer — explore sorting, searching, and more with real-time animations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${unicaOne.variable} ${spaceMono.variable} font-space antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
