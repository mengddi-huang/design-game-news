import rawNews from "@/data/news.json";

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
    tagline: "Industry pulse from the front lines of interactive entertainment.",
  },
  {
    slug: "visual",
    label: "视觉设计",
    labelEn: "Visual",
    tagline: "Graphic, type, identity & editorial dispatches.",
  },
  {
    slug: "interaction",
    label: "交互设计",
    labelEn: "Interaction",
    tagline: "UX, UI, motion and the craft of screens.",
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
