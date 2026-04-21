/**
 * Daily Dispatch digest.
 *
 * Flow:
 *   1. Pull all 15 RSS feeds.
 *   2. Keep only items published in the last N hours (default 36).
 *   3. Rank per category, keep top K (default 3). 宁缺毋滥 — skip categories with nothing fresh.
 *   4. POST a markdown digest to the WeChat Work webhook.
 *   5. Merge selected items into data/news.json so the website reflects the same picks.
 *
 * Usage:
 *   tsx scripts/daily-digest.ts
 *   tsx scripts/daily-digest.ts --hours 48 --per-category 4 --dry
 *
 * Env:
 *   WECHAT_WEBHOOK_URL  — override the default webhook endpoint.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import {
  CATEGORY_LABEL,
  Category,
  NewsItem,
  fetchAll,
  truncate,
  withinHours,
} from "./lib/feeds.js";
import { isCompetitor } from "../lib/competitors.js";

type Mode = "full" | "link" | "joke";

const requireJson = createRequire(import.meta.url);

const JOKE_STATE_FILE = path.join(process.cwd(), "data", "joke-state.json");

interface JokeState {
  recent: number[];
}

async function readJokeState(): Promise<JokeState> {
  try {
    const raw = await fs.readFile(JOKE_STATE_FILE, "utf8");
    const parsed = JSON.parse(raw) as JokeState;
    if (Array.isArray(parsed.recent)) return parsed;
  } catch {}
  return { recent: [] };
}

async function writeJokeState(state: JokeState, dry: boolean): Promise<void> {
  if (dry) return;
  await fs.writeFile(JOKE_STATE_FILE, JSON.stringify(state, null, 2) + "\n", "utf8");
}

/**
 * Pick a random joke index that wasn't used in the recent window.
 * Recent window size = floor(jokes.length * 0.8) so we cycle through almost
 * the entire pool before repeating anything, guaranteeing "每次都不一样" in
 * practice unless you push many dozens of times.
 */
async function pickJoke(dry: boolean): Promise<string> {
  const jokes = requireJson("../data/jokes.json") as string[];
  if (jokes.length === 0) throw new Error("data/jokes.json is empty");

  const state = await readJokeState();
  const windowSize = Math.max(1, Math.floor(jokes.length * 0.8));
  const banned = new Set(state.recent.slice(-windowSize));

  const candidates: number[] = [];
  for (let i = 0; i < jokes.length; i++) if (!banned.has(i)) candidates.push(i);
  const pool = candidates.length > 0 ? candidates : jokes.map((_, i) => i);

  const pickedIdx = pool[Math.floor(Math.random() * pool.length)];

  const nextRecent = [...state.recent, pickedIdx].slice(-windowSize);
  await writeJokeState({ recent: nextRecent }, dry);

  return jokes[pickedIdx];
}

function formatJokeMessage(joke: string, siteUrl: string): string {
  const today = new Date();
  const stamp = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return [
    `<font color="comment">Dispatch · ${stamp} · 冷笑话</font>`,
    "",
    joke,
    "",
    `[→ 今日资讯请戳这里](${siteUrl})`,
  ].join("\n");
}

interface Args {
  hours: number;
  perCategory: number;
  dry: boolean;
  mode: Mode;
  siteUrl: string;
  webhook: string;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const get = (k: string, d?: string) => {
    const i = argv.indexOf(k);
    return i >= 0 ? argv[i + 1] : d;
  };
  return {
    hours: Number(get("--hours", "36")),
    perCategory: Number(get("--per-category", "3")),
    dry: argv.includes("--dry"),
    mode: ((get("--mode") as Mode) || "full"),
    siteUrl:
      get("--site-url") ||
      process.env.DISPATCH_SITE_URL ||
      "https://mengddi-huang.github.io/design-game-news/",
    webhook:
      process.env.WECHAT_WEBHOOK_URL ||
      "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=81f36dcc-d572-4ad6-8948-1c363c506b08",
  };
}

function rankPerCategory(
  items: NewsItem[],
  perCategory: number
): Record<Category, NewsItem[]> {
  const byCat: Record<Category, NewsItem[]> = {
    games: [],
    visual: [],
    interaction: [],
  };
  for (const it of items) byCat[it.category].push(it);

  (Object.keys(byCat) as Category[]).forEach((c) => {
    byCat[c].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    const seen = new Set<string>();
    byCat[c] = byCat[c].filter((x) => {
      if (seen.has(x.sourceUrl)) return false;
      seen.add(x.sourceUrl);
      return true;
    });
  });

  // Games: fill with Delta Force rivals first; if rivals fall short of the quota,
  // top up with at most 1 "other games" item to keep it a sidebar.
  const games = byCat.games;
  const rivals = games.filter((it) => isCompetitor(it));
  const others = games.filter((it) => !isCompetitor(it));
  const rivalTake = Math.min(rivals.length, perCategory);
  const otherTake =
    rivalTake < perCategory ? Math.min(1, others.length) : 0;
  byCat.games = [
    ...rivals.slice(0, rivalTake),
    ...others.slice(0, otherTake),
  ];

  byCat.visual = byCat.visual.slice(0, perCategory);
  byCat.interaction = byCat.interaction.slice(0, perCategory);

  return byCat;
}

/**
 * WeChat Work bot markdown notes:
 *   - supported: # headers, **bold**, `code`, [text](url), > quote, lists, <font color="info|comment|warning">
 *   - NOT supported: horizontal rule (---), nested markdown inside quotes, tables, arbitrary HTML
 *   - Keep lines flat; separate items with blank lines; avoid wrapping links in > quotes.
 */
function escapeForWeChat(s: string): string {
  // Strip characters that confuse the parser; in particular, square brackets in titles
  // collide with link syntax, and backticks can open stray code spans.
  return s.replace(/[\[\]]/g, " ").replace(/`/g, "'").replace(/\s+/g, " ").trim();
}

function formatWeChatMarkdown(
  byCat: Record<Category, NewsItem[]>,
  hours: number
): string {
  const today = new Date();
  const stamp = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const emoji: Record<Category, string> = {
    games: "🎮",
    visual: "🎨",
    interaction: "🧭",
  };

  const lines: string[] = [];
  lines.push(`# Dispatch · ${stamp}`);
  lines.push(`<font color="comment">游戏 / 视觉设计 / 交互设计 · 近 ${hours} 小时精选</font>`);
  lines.push("");

  let total = 0;
  (Object.keys(byCat) as Category[]).forEach((c) => {
    const items = byCat[c];
    if (!items.length) return;

    lines.push(`**${emoji[c]} ${CATEGORY_LABEL[c]}**`);
    lines.push("");

    for (const it of items) {
      total += 1;
      const title = escapeForWeChat(it.title);
      lines.push(`[${title}](${it.sourceUrl})`);
      lines.push(
        `<font color="comment">${escapeForWeChat(it.source)} · ${it.publishedAt}</font>`
      );
      if (it.excerpt) {
        lines.push(truncate(escapeForWeChat(it.excerpt), 90));
      }
      lines.push("");
    }
  });

  if (total === 0) {
    return [
      `# Dispatch · ${stamp}`,
      "",
      `<font color="comment">近 ${hours} 小时内各来源暂无新内容,明天再聚。</font>`,
    ].join("\n");
  }

  lines.push(
    `<font color="comment">共 ${total} 条 · 点击标题跳原文</font>`
  );
  return lines.join("\n").trim();
}

function formatLinkOnly(
  byCat: Record<Category, NewsItem[]>,
  siteUrl: string
): string {
  const today = new Date();
  const stamp = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const counts = {
    games: byCat.games.length,
    visual: byCat.visual.length,
    interaction: byCat.interaction.length,
  };
  const total = counts.games + counts.visual + counts.interaction;

  if (total === 0) {
    return [
      `# Dispatch · ${stamp}`,
      "",
      `<font color="comment">今日各来源无新动态,明天再聚。</font>`,
      "",
      `[查看 Dispatch →](${siteUrl})`,
    ].join("\n");
  }

  return [
    `# Dispatch · ${stamp}`,
    "",
    `<font color="info">游戏 ${counts.games} · 视觉 ${counts.visual} · 交互 ${counts.interaction}</font>`,
    "",
    `[→ 打开 Dispatch 看今日全部](${siteUrl})`,
  ].join("\n");
}

function safeTruncateUtf8(s: string, maxBytes: number): string {
  const buf = Buffer.from(s, "utf8");
  if (buf.byteLength <= maxBytes) return s;
  // Walk back to the last full UTF-8 boundary to avoid cutting mid-char.
  let end = maxBytes;
  while (end > 0 && (buf[end] & 0xc0) === 0x80) end--;
  return buf.slice(0, end).toString("utf8") + "\n\n<font color=\"comment\">(truncated)</font>";
}

async function postToWeChat(webhook: string, markdown: string): Promise<void> {
  const safe = safeTruncateUtf8(markdown, 3800);

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      msgtype: "markdown",
      markdown: { content: safe },
    }),
  });
  const json = (await res.json()) as { errcode?: number; errmsg?: string };
  if (json.errcode !== 0) {
    throw new Error(
      `WeChat webhook failed: errcode=${json.errcode} errmsg=${json.errmsg}`
    );
  }
}

async function writeWebsiteData(items: NewsItem[]): Promise<void> {
  const dataPath = path.resolve(process.cwd(), "data/news.json");
  let existing: NewsItem[] = [];
  try {
    existing = JSON.parse(await fs.readFile(dataPath, "utf8"));
  } catch {
    existing = [];
  }

  const seen = new Set(existing.map((n) => n.sourceUrl));
  let added = 0;
  for (const it of items) {
    if (seen.has(it.sourceUrl)) continue;
    seen.add(it.sourceUrl);
    existing.push(it);
    added++;
  }

  existing.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Keep only the most recent 60 items to keep the bundle lean
  existing = existing.slice(0, 60);

  await fs.writeFile(dataPath, JSON.stringify(existing, null, 2) + "\n", "utf8");
  console.log(
    `[daily-digest] merged ${added} new items into data/news.json (total ${existing.length})`
  );
}

async function main() {
  const args = parseArgs();
  console.log(
    `[daily-digest] fetching RSS (window=${args.hours}h, per-category=${args.perCategory}, dry=${args.dry})`
  );

  // Joke mode only needs the site URL; skip the (slow) RSS fetch entirely.
  if (args.mode === "joke") {
    const joke = await pickJoke(args.dry);
    const md = formatJokeMessage(joke, args.siteUrl);
    if (args.dry) {
      console.log("\n--- PREVIEW ---\n");
      console.log(md);
      console.log("\n--- END PREVIEW ---\n");
      return;
    }
    await postToWeChat(args.webhook, md);
    console.log("[daily-digest] pushed joke to WeChat Work webhook");
    return;
  }

  const all = await fetchAll(12);
  console.log(`[daily-digest] total items parsed: ${all.length}`);

  const fresh = all.filter((it) => withinHours(it, args.hours));
  console.log(`[daily-digest] within last ${args.hours}h: ${fresh.length}`);

  const picked = rankPerCategory(fresh, args.perCategory);
  const flat = (Object.values(picked) as NewsItem[][]).flat();
  console.log(
    `[daily-digest] selected: games=${picked.games.length} visual=${picked.visual.length} interaction=${picked.interaction.length}`
  );

  const md =
    args.mode === "link"
      ? formatLinkOnly(picked, args.siteUrl)
      : formatWeChatMarkdown(picked, args.hours);

  if (args.dry) {
    console.log("\n--- PREVIEW ---\n");
    console.log(md);
    console.log("\n--- END PREVIEW ---\n");
    return;
  }

  await postToWeChat(args.webhook, md);
  console.log("[daily-digest] pushed digest to WeChat Work webhook");

  if (flat.length > 0) {
    await writeWebsiteData(flat);
  }
}

main().catch((err) => {
  console.error("[daily-digest] FAILED", err);
  process.exit(1);
});
