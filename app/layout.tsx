import type { Metadata } from "next";
import "./globals.css";
import { Grain } from "@/components/Grain";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { Nav } from "@/components/Nav";
import { Watermark } from "@/components/Watermark";

export const metadata: Metadata = {
  title: "简报 · 游戏 × 设计行业资讯",
  description:
    "聚合游戏、视觉设计、交互设计三个板块的前沿资讯。游戏侧聚焦三角洲行动的竞品赛道,来源包括 GamesIndustry、80 Level、Smashing Magazine、Designboom、Nielsen Norman Group 等。",
  openGraph: {
    title: "简报 Dispatch · 游戏 × 设计行业资讯",
    description:
      "每天一句冷笑话,附上当日游戏与设计行业的最新动态。",
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
        <Watermark />
        <Grain />
        <Nav />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
