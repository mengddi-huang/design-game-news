import rawNews from "@/data/news.json";
import { splitGames } from "@/lib/competitors";

export type Category = "games" | "visual" | "interaction";

export interface NewsItem {
  id: string;
  category: Category;
  title: string;
  titleEn?: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  excerpt: string;
  cover?: string;
  tags?: string[];
}

export const CATEGORIES: {
  slug: Category;
  label: string;
  labelEn: string;
  tagline: string;
}[] = [
  {
    slug: "games",
    label: "游戏",
    labelEn: "Games",
    tagline: "三角洲行动的竞品动态 —— 撤离射击与战术 FPS 赛道。",
  },
  {
    slug: "visual",
    label: "视觉设计",
    labelEn: "Visual",
    tagline: "平面、字体、品牌与编辑设计的一线动态。",
  },
  {
    slug: "interaction",
    label: "交互设计",
    labelEn: "Interaction",
    tagline: "用户体验、界面、动效,以及屏幕上的那些讲究。",
  },
];

export function getAllNews(): NewsItem[] {
  const items = (rawNews as NewsItem[]).slice();
  items.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return items;
}

export function getNewsByCategory(category: Category): NewsItem[] {
  return getAllNews().filter((n) => n.category === category);
}

/**
 * Splits games news into Delta Force competitors vs everything else.
 * Competitors keep full chronological order; others limited to the freshest N
 * so the site emphasises the rival track and treats everything else as context.
 */
export function getGamesSplit(otherLimit = 3) {
  const games = getNewsByCategory("games");
  const { competitors, others } = splitGames(games);
  return { competitors, others: others.slice(0, otherLimit) };
}

export function getCategoryMeta(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
