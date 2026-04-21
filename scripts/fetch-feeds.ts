/**
 * Fetches RSS feeds from curated sources and merges into data/news.json.
 *
 * Usage:
 *   npm run fetch-news             # merge new items (dedupe by URL)
 *   npm run fetch-news -- --fresh  # replace file with only latest fetch
 *
 * Notes:
 *   - We only keep title, link, date, source and a short excerpt.
 *   - This script does NOT scrape full article bodies.
 *   - Deploy tip: call this from a Vercel Cron or GitHub Action on a schedule.
 */

import fs from "node:fs/promises";
import path from "node:path";
import Parser from "rss-parser";

type Category = "games" | "visual" | "interaction";

interface Feed {
  source: string;
  url: string;
  category: Category;
}

const FEEDS: Feed[] = [
  // --- Games ---
  { source: "GamesIndustry.biz", url: "https://www.gamesindustry.biz/feed", category: "games" },
  { source: "Game Developer", url: "https://www.gamedeveloper.com/rss.xml", category: "games" },
  { source: "80 Level", url: "https://80.lv/feed/", category: "games" },
  { source: "Polygon", url: "https://www.polygon.com/rss/index.xml", category: "games" },
  { source: "Rock Paper Shotgun", url: "https://www.rockpapershotgun.com/feed", category: "games" },

  // --- Visual Design ---
  { source: "It's Nice That", url: "https://www.itsnicethat.com/feed", category: "visual" },
  { source: "Designboom", url: "https://www.designboom.com/feed/", category: "visual" },
  { source: "Eye on Design (AIGA)", url: "https://eyeondesign.aiga.org/feed/", category: "visual" },
  { source: "Typewolf", url: "https://www.typewolf.com/site-of-the-day/feed", category: "visual" },
  { source: "Fonts In Use", url: "https://fontsinuse.com/feed", category: "visual" },

  // --- Interaction Design ---
  { source: "Smashing Magazine", url: "https://www.smashingmagazine.com/feed/", category: "interaction" },
  { source: "UX Collective", url: "https://uxdesign.cc/feed", category: "interaction" },
  { source: "Nielsen Norman Group", url: "https://www.nngroup.com/feed/rss/", category: "interaction" },
  { source: "Awwwards Blog", url: "https://www.awwwards.com/blog/feed/", category: "interaction" },
  { source: "A List Apart", url: "https://alistapart.com/main/feed/", category: "interaction" },
];

interface NewsItem {
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
  headers: { "User-Agent": "Dispatch-NewsBot/0.1 (+https://example.com)" },
});

const DATA_PATH = path.resolve(process.cwd(), "data/news.json");

function slug(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function truncate(s: string, n = 220): string {
  if (s.length <= n) return s;
  return s.slice(0, n - 1).trimEnd() + "…";
}

function pickCover(entry: Parser.Item & { enclosure?: { url?: string } }): string | undefined {
  // @ts-expect-error - media:content lives under a custom namespace
  const media = entry["media:content"]?.$?.url || entry["media:thumbnail"]?.$?.url;
  if (media) return media;
  if (entry.enclosure?.url) return entry.enclosure.url;
  const match = entry.content?.match(/<img[^>]+src=["']([^"']+)["']/);
  return match?.[1];
}

async function fetchOne(feed: Feed): Promise<NewsItem[]> {
  try {
    const parsed = await parser.parseURL(feed.url);
    return (parsed.items ?? []).slice(0, 8).map((it, i): NewsItem => {
      const title = (it.title || "Untitled").trim();
      const link = it.link || feed.url;
      return {
        id: `${feed.category[0]}-${slug(feed.source)}-${slug(title)}-${i}`,
        category: feed.category,
        title,
        source: feed.source,
        sourceUrl: link,
        publishedAt: (it.isoDate || it.pubDate || new Date().toISOString()).slice(0, 10),
        excerpt: truncate(stripHtml(it.contentSnippet || it.content || it.summary || "")),
        cover: pickCover(it as Parser.Item & { enclosure?: { url?: string } }),
        tags: (it.categories as string[] | undefined)?.slice(0, 3),
      };
    });
  } catch (err) {
    console.warn(`[fetch-feeds] ${feed.source} failed:`, (err as Error).message);
    return [];
  }
}

async function main() {
  const fresh = process.argv.includes("--fresh");
  console.log(`[fetch-feeds] pulling ${FEEDS.length} feeds...`);
  const results = await Promise.all(FEEDS.map(fetchOne));
  const incoming = results.flat();
  console.log(`[fetch-feeds] got ${incoming.length} incoming items`);

  let existing: NewsItem[] = [];
  if (!fresh) {
    try {
      const raw = await fs.readFile(DATA_PATH, "utf8");
      existing = JSON.parse(raw);
    } catch {
      existing = [];
    }
  }

  const seen = new Set(existing.map((n) => n.sourceUrl));
  const merged = [...existing];
  let added = 0;
  for (const item of incoming) {
    if (seen.has(item.sourceUrl)) continue;
    seen.add(item.sourceUrl);
    merged.push(item);
    added++;
  }

  merged.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  await fs.writeFile(DATA_PATH, JSON.stringify(merged, null, 2) + "\n", "utf8");
  console.log(
    `[fetch-feeds] done — added ${added}, total ${merged.length} (${DATA_PATH})`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
