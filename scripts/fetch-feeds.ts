/**
 * One-off RSS puller.
 * Fetches all feeds, dedupes by sourceUrl, merges into data/news.json.
 *
 * Usage:
 *   npm run fetch-news              # merge
 *   npm run fetch-news -- --fresh   # rebuild from scratch
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fetchAll, NewsItem } from "./lib/feeds.js";

async function main() {
  const fresh = process.argv.includes("--fresh");
  const items = await fetchAll(10);
  console.log(`[fetch-feeds] got ${items.length} items`);

  const dataPath = path.resolve(process.cwd(), "data/news.json");
  let merged: NewsItem[] = [];

  if (!fresh) {
    try {
      merged = JSON.parse(await fs.readFile(dataPath, "utf8"));
    } catch {
      merged = [];
    }
  }

  const seen = new Set(merged.map((n) => n.sourceUrl));
  let added = 0;
  for (const it of items) {
    if (seen.has(it.sourceUrl)) continue;
    seen.add(it.sourceUrl);
    merged.push(it);
    added++;
  }

  merged.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  await fs.writeFile(dataPath, JSON.stringify(merged, null, 2) + "\n", "utf8");
  console.log(`[fetch-feeds] added ${added}, total ${merged.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
