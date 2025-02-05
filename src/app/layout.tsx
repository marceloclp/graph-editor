import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const font = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Graph Visualizer",
  description: "Visualize your graph data",
};

export default function Index({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={font.variable}>
      <body className="overscroll-none overflow-hidden">{children}</body>
    </html>
  );
}
