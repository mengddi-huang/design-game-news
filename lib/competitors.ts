/**
 * Delta Force (三角洲行动) competitor classifier.
 *
 * The list covers two rings of rivals:
 *   1. Extraction shooters — same subgenre, direct competitors.
 *   2. Tactical / military FPS — adjacent battleground for the same audience.
 *
 * A news item is classified by scanning title + excerpt + tags for any keyword.
 */

export const COMPETITOR_KEYWORDS: readonly string[] = [
  // Extraction shooters (direct)
  "delta force",
  "三角洲",
  "三角洲行动",
  "tarkov",
  "escape from tarkov",
  "arena breakout",
  "暗区突围",
  "gray zone warfare",
  "gray zone",
  "arc raiders",
  "bungie marathon",
  "marathon bungie",
  "hunt: showdown",
  "hunt showdown",
  "the cycle frontier",
  "the finals",

  // Tactical / military FPS (adjacent)
  "call of duty",
  "warzone",
  "modern warfare",
  "black ops",
  "battlefield",
  "rainbow six",
  "r6 siege",
  "counter-strike",
  "counterstrike",
  "cs2",
  "cs:go",
  "csgo",
  "valorant",

  // Studios that signal rival news even without game name
  "battlestate games",
  "embark studios",
  "madfinger",
  "morefun",
];

export interface TextSource {
  title: string;
  excerpt?: string;
  tags?: string[];
}

export interface CompetitorMatch {
  isCompetitor: boolean;
  keyword?: string;
}

export function matchCompetitor(item: TextSource): CompetitorMatch {
  const haystack = [
    item.title,
    item.excerpt ?? "",
    ...(item.tags ?? []),
  ]
    .join(" \u0001 ")
    .toLowerCase();

  for (const kw of COMPETITOR_KEYWORDS) {
    if (haystack.includes(kw)) {
      return { isCompetitor: true, keyword: kw };
    }
  }
  return { isCompetitor: false };
}

export function isCompetitor(item: TextSource): boolean {
  return matchCompetitor(item).isCompetitor;
}

export function splitGames<T extends TextSource>(
  items: T[]
): { competitors: T[]; others: T[] } {
  const competitors: T[] = [];
  const others: T[] = [];
  for (const it of items) {
    if (isCompetitor(it)) competitors.push(it);
    else others.push(it);
  }
  return { competitors, others };
}
