import Parser from "rss-parser";

export type Category = "games" | "visual" | "interaction";

export interface Feed {
  source: string;
  url: string;
  category: Category;
}

export const FEEDS: Feed[] = [
  // Games
  { source: "GamesIndustry.biz", url: "https://www.gamesindustry.biz/feed", category: "games" },
  { source: "Game Developer", url: "https://www.gamedeveloper.com/rss.xml", category: "games" },
  { source: "80 Level", url: "https://80.lv/feed/", category: "games" },
  { source: "Polygon", url: "https://www.polygon.com/rss/index.xml", category: "games" },
  { source: "Rock Paper Shotgun", url: "https://www.rockpapershotgun.com/feed", category: "games" },

  // Visual Design
  { source: "Designboom", url: "https://www.designboom.com/feed/", category: "visual" },
  { source: "Eye on Design", url: "https://eyeondesign.aiga.org/feed/", category: "visual" },
  { source: "Typewolf", url: "https://www.typewolf.com/feed", category: "visual" },
  { source: "Typewolf Blog", url: "https://www.typewolf.com/blog/feed", category: "visual" },
  { source: "The Brand Identity", url: "https://the-brandidentity.com/feed", category: "visual" },
  { source: "Creative Review", url: "https://www.creativereview.co.uk/feed/", category: "visual" },

  // Interaction Design
  { source: "Smashing Magazine", url: "https://www.smashingmagazine.com/feed/", category: "interaction" },
  { source: "UX Collective", url: "https://uxdesign.cc/feed", category: "interaction" },
  { source: "Nielsen Norman Group", url: "https://www.nngroup.com/feed/rss/", category: "interaction" },
  { source: "Awwwards Blog", url: "https://www.awwwards.com/blog/feed/", category: "interaction" },
  { source: "A List Apart", url: "https://alistapart.com/main/feed/", category: "interaction" },
];

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

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    Accept:
      "application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.5",
  },
  requestOptions: {
    rejectUnauthorized: false,
  },
});

export function stripHtml(s: string): string {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, "…")
    .trim();
}

export function truncate(s: string, n = 180): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + "…";
}

function slug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function pickCover(entry: Parser.Item & Record<string, unknown>): string | undefined {
  const media =
    (entry as { ["media:content"]?: { $?: { url?: string } } })["media:content"]?.$?.url ||
    (entry as { ["media:thumbnail"]?: { $?: { url?: string } } })["media:thumbnail"]?.$?.url;
  if (media) return media;
  const enc = (entry as { enclosure?: { url?: string } }).enclosure;
  if (enc?.url) return enc.url;
  const content = (entry.content as string | undefined) || "";
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/);
  return match?.[1];
}

export async function fetchFeed(feed: Feed, perFeed = 8): Promise<NewsItem[]> {
  try {
    const parsed = await parser.parseURL(feed.url);
    return (parsed.items ?? []).slice(0, perFeed).map((it, i): NewsItem => {
      const title = (it.title || "Untitled").trim();
      const link = it.link || feed.url;
      const published = (it.isoDate || it.pubDate || new Date().toISOString()).slice(0, 10);
      const excerpt = truncate(
        stripHtml(it.contentSnippet || it.content || it.summary || "")
      );
      return {
        id: `${feed.category[0]}-${slug(feed.source)}-${slug(title)}-${i}`,
        category: feed.category,
        title,
        source: feed.source,
        sourceUrl: link,
        publishedAt: published,
        excerpt,
        cover: pickCover(it as Parser.Item & Record<string, unknown>),
        tags: (it.categories as string[] | undefined)?.slice(0, 3),
      };
    });
  } catch (err) {
    console.warn(
      `[feeds] ${feed.source} failed: ${(err as Error).message}`
    );
    return [];
  }
}

export async function fetchAll(perFeed = 8): Promise<NewsItem[]> {
  const results = await Promise.all(FEEDS.map((f) => fetchFeed(f, perFeed)));
  return results.flat();
}

export function withinHours(item: NewsItem, hours: number): boolean {
  const t = new Date(item.publishedAt).getTime();
  if (!Number.isFinite(t)) return false;
  return Date.now() - t <= hours * 3600 * 1000;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  games: "游戏",
  visual: "视觉设计",
  interaction: "交互设计",
};
