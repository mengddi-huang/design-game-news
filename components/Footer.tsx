import Link from "next/link";
import { CATEGORIES } from "@/lib/news";

const SOURCES = {
  games: [
    "GamesIndustry.biz",
    "Game Developer",
    "80 Level",
    "Polygon",
    "Rock Paper Shotgun",
  ],
  visual: [
    "It's Nice That",
    "Designboom",
    "Eye on Design",
    "Typewolf",
    "Fonts In Use",
  ],
  interaction: [
    "Smashing Magazine",
    "UX Collective",
    "Nielsen Norman Group",
    "Awwwards Blog",
    "A List Apart",
  ],
};

export function Footer() {
  return (
    <footer className="mt-24 border-t border-paper/10">
      <div className="grid grid-cols-12 gap-6 px-6 md:px-10 py-12">
        <div className="col-span-12 md:col-span-5">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-paper mb-3">
            <span className="inline-block h-1.5 w-1.5 bg-acid rounded-full mr-2 align-middle" />
            Dispatch
          </div>
          <p className="serif text-2xl md:text-3xl leading-[1.15] text-paper max-w-md">
            每周从十五个专业来源里挑出最值得读的几条。
          </p>
          <p className="mt-4 text-[13px] text-muted max-w-md leading-relaxed">
            Dispatch 只做标题 + 摘要 + 外链的轻量聚合,不抓取全文,
            完整版权属于各来源。
          </p>
        </div>
        <div className="col-span-12 md:col-span-6 md:col-start-7 grid grid-cols-3 gap-6">
          {CATEGORIES.map((c) => (
            <div key={c.slug}>
              <Link
                href={`/${c.slug}`}
                data-hover
                className="eyebrow-acid hover:underline block mb-3"
              >
                {c.labelEn}
              </Link>
              <ul className="space-y-1.5 text-[12.5px] text-paper/70">
                {SOURCES[c.slug].map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between px-6 md:px-10 py-5 border-t border-paper/10 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted">
        <div>© 2026 Dispatch · News curated from public RSS feeds</div>
        <div>Visual language inspired by rogierdeboeve.com</div>
      </div>
    </footer>
  );
}
