import Link from "next/link";
import { Loader } from "@/components/Loader";
import { NewsCard } from "@/components/NewsCard";
import { FeaturedCard } from "@/components/FeaturedCard";
import { Footer } from "@/components/Footer";
import { CATEGORIES, getAllNews, getNewsByCategory } from "@/lib/news";

export default function Home() {
  const all = getAllNews();
  const featured = all[0];
  const secondary = all.slice(1, 4);

  return (
    <>
      <Loader />
      <main className="relative min-h-screen pt-20 md:pt-24">
        {/* ---------- HERO / MASTHEAD ---------- */}
        <section className="px-6 md:px-10 pt-6 pb-10">
          <div className="grid grid-cols-12 gap-4 mb-10">
            <div className="col-span-12 md:col-span-8">
              <div className="eyebrow mb-4">
                Issue 01 · Spring 2026 · 中 / EN
              </div>
              <h1 className="serif text-[40px] md:text-[64px] leading-[1.05] tracking-tightest text-paper max-w-[16ch]">
                游戏与设计行业的
                <span className="text-acid">每周简报</span>。
              </h1>
              <p className="mt-5 text-[14px] md:text-[15px] text-paper/70 max-w-xl leading-relaxed">
                聚合来自 GamesIndustry、Game Developer、80 Level、Smashing Magazine、
                It&apos;s Nice That、Eye on Design、NN/g 等专业来源的近期资讯,
                只保留标题、摘要与原文链接。
              </p>
            </div>
            <div className="col-span-12 md:col-span-3 md:col-start-10 flex flex-col justify-end gap-3">
              <div className="eyebrow">Categories</div>
              <div className="flex flex-col">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    data-hover
                    className="group flex items-center justify-between border-t border-paper/10 py-2.5 text-paper hover:text-acid transition-colors"
                  >
                    <span className="text-[15px]">{c.label}</span>
                    <span className="font-mono text-[11px] text-muted group-hover:text-acid">
                      {getNewsByCategory(c.slug).length} · {c.labelEn}
                      <span className="ml-2">→</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- FEATURED ---------- */}
        <section className="px-6 md:px-10 py-10 border-t border-paper/10">
          <div className="flex items-center justify-between mb-8">
            <div className="eyebrow-acid">Today&apos;s pick · 今日精选</div>
            <div className="eyebrow">{featured.source}</div>
          </div>
          <FeaturedCard item={featured} />
        </section>

        {/* ---------- SECONDARY ROW ---------- */}
        <section className="px-6 md:px-10 py-10 border-t border-paper/10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="eyebrow mb-2">Latest · 最新</div>
              <h2 className="serif text-2xl md:text-3xl">Fresh off the wire</h2>
            </div>
            <Link
              href="/games"
              data-hover
              className="hidden md:inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted hover:text-acid transition"
            >
              By category <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {secondary.map((item) => (
              <NewsCard key={item.id} item={item} size="md" />
            ))}
          </div>
        </section>

        {/* ---------- CATEGORY SECTIONS ---------- */}
        {CATEGORIES.map((cat) => {
          const items = getNewsByCategory(cat.slug).slice(0, 4);
          return (
            <section
              key={cat.slug}
              className="px-6 md:px-10 py-12 border-t border-paper/10"
            >
              <div className="grid grid-cols-12 gap-4 mb-8 items-end">
                <div className="col-span-12 md:col-span-8">
                  <div className="eyebrow mb-2">{cat.labelEn}</div>
                  <h2 className="serif text-3xl md:text-[40px] tracking-tightest">
                    {cat.label}
                    <span className="text-acid">.</span>
                  </h2>
                  <p className="mt-2 text-[13px] text-muted max-w-lg">
                    {cat.tagline}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-3 md:col-start-10 md:text-right">
                  <Link
                    href={`/${cat.slug}`}
                    data-hover
                    className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] hover:text-acid transition"
                  >
                    All {cat.labelEn} <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {items.map((item) => (
                  <NewsCard
                    key={item.id}
                    item={item}
                    size="sm"
                    showCategory={false}
                  />
                ))}
              </div>
            </section>
          );
        })}

        <Footer />
      </main>
    </>
  );
}
