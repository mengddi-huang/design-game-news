import type { Metadata } from "next";
import "./globals.css";
import { Grain } from "@/components/Grain";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Dispatch — 游戏 × 设计行业资讯",
  description:
    "聚合游戏、视觉设计、交互设计三个行业的前沿资讯,来源包括 GamesIndustry、80 Level、Smashing Magazine、It's Nice That、Nielsen Norman Group 等。",
  openGraph: {
    title: "Dispatch — Games × Design Dispatch",
    description:
      "Curated news for game industry, visual design, and interaction design.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink text-paper antialiased">
        <SmoothScroll />
        <Cursor />
        <Grain />
        <Nav />
        {children}
      </body>
    </html>
  );
}
