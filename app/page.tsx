import Link from "next/link";
import { NewsCard } from "@/components/NewsCard";
import { FeaturedCard } from "@/components/FeaturedCard";
import { Footer } from "@/components/Footer";
import {
  CATEGORIES,
  getAllNews,
  getGamesSplit,
  getNewsByCategory,
} from "@/lib/news";

export default function Home() {
  const all = getAllNews();
  const featured = all[0];
  const secondary = all.slice(1, 4);

  return (
    <>
      <main className="relative min-h-screen pt-20 md:pt-24">
        {/* ---------- HERO / MASTHEAD ---------- */}
        <section className="px-6 md:px-10 pt-6 pb-10">
          <div className="grid grid-cols-12 gap-4 mb-10">
            <div className="col-span-12 md:col-span-8">
              <div className="text-[12px] text-muted mb-4 tracking-wider">
                第 01 期 · 2026 春 · 主理人{" "}
                <span className="text-acid">谷博屿</span>
              </div>
              <h1 className="serif text-[40px] md:text-[64px] leading-[1.05] tracking-tightest text-paper max-w-[16ch]">
                游戏与设计行业的
                <span className="text-acid">每周简报</span>。
              </h1>
              <p className="mt-5 text-[14px] md:text-[15px] text-paper/70 max-w-xl leading-relaxed">
                游戏板块聚焦<span className="text-acid">三角洲行动</span>的竞品赛道 —
                Tarkov、Arena Breakout、Gray Zone Warfare、ARC Raiders、Marathon、Warzone
                等撤离与战术 FPS;设计板块覆盖视觉与交互的一线动态。
              </p>
            </div>
            <div className="col-span-12 md:col-span-3 md:col-start-10 flex flex-col justify-end gap-3">
              <div className="text-[12px] text-muted tracking-wider">板块</div>
              <div className="flex flex-col">
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.slug}`}
                    data-hover
                    className="group flex items-center justify-between border-t border-paper/10 py-2.5 text-paper hover:text-acid transition-colors"
                  >
                    <span className="text-[15px]">{c.label}</span>
                    <span className="text-[12px] text-muted group-hover:text-acid">
                      {getNewsByCategory(c.slug).length} 条
                      <span className="ml-2">→</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- FEATURED ---------- */}
        <section className="px-6 md:px-10 py-16 md:py-20 border-t border-paper/10">
          <div className="flex items-center justify-between mb-8">
            <div className="text-[12px] text-acid tracking-wider">今日精选</div>
            <div className="text-[12px] text-muted">{featured.source}</div>
          </div>
          <FeaturedCard item={featured} />
        </section>

        {/* ---------- SECONDARY ROW ---------- */}
        <section className="px-6 md:px-10 py-16 md:py-20 border-t border-paper/10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-[12px] text-muted tracking-wider mb-2">最新</div>
              <h2 className="serif text-2xl md:text-3xl">刚刚送达</h2>
            </div>
            <Link
              href="/games"
              data-hover
              className="hidden md:inline-flex items-center gap-2 text-[12px] text-muted hover:text-acid transition"
            >
              按板块浏览 <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 md:gap-x-16 gap-y-14 md:gap-y-20">
            {secondary.map((item) => (
              <NewsCard key={item.id} item={item} size="md" />
            ))}
          </div>
        </section>

        {/* ---------- CATEGORY SECTIONS ---------- */}
        {CATEGORIES.map((cat) => {
          if (cat.slug === "games") {
            const { competitors, others } = getGamesSplit(2);
            const rivals = competitors.slice(0, 4);
            return (
              <section
                key={cat.slug}
                className="px-6 md:px-10 py-16 md:py-20 border-t border-paper/10"
              >
                <div className="grid grid-cols-12 gap-4 mb-8 items-end">
                  <div className="col-span-12 md:col-span-8">
                    <div className="text-[12px] text-muted tracking-wider mb-2">
                      游戏 · 三角洲竞品
                    </div>
                    <h2 className="serif text-3xl md:text-[40px] tracking-tightest">
                      三角洲竞品追踪
                      <span className="text-acid">.</span>
                    </h2>
                    <p className="mt-2 text-[13px] text-muted max-w-lg">
                      撤离射击 & 战术 FPS 赛道 —— Tarkov、Arena Breakout、
                      Gray Zone Warfare、ARC Raiders、Marathon、Warzone 等。
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-3 md:col-start-10 md:text-right">
                    <Link
                      href="/games"
                      data-hover
                      className="inline-flex items-center gap-2 text-[12px] hover:text-acid transition"
                    >
                      查看全部竞品 <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>

                {rivals.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 md:gap-x-12 gap-y-12 md:gap-y-16">
                    {rivals.map((item) => (
                      <NewsCard
                        key={item.id}
                        item={item}
                        size="sm"
                        showCategory={false}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-[13px] text-muted">
                    暂无竞品新动态 —— 等 Tarkov / Arena Breakout / Warzone 下一波更新。
                  </div>
                )}

                {others.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-paper/10">
                    <div className="flex items-end justify-between mb-5">
                      <div>
                        <div className="text-[12px] text-muted tracking-wider mb-1">
                          本周其他
                        </div>
                        <h3 className="serif text-lg md:text-xl text-paper/90">
                          其他游戏动态
                        </h3>
                      </div>
                      <div className="text-[12px] text-muted">
                        {others.length} 条
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 md:gap-x-16 gap-y-12">
                      {others.map((item) => (
                        <NewsCard
                          key={item.id}
                          item={item}
                          size="sm"
                          showCategory={false}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          }

          const items = getNewsByCategory(cat.slug).slice(0, 4);
          return (
            <section
              key={cat.slug}
              className="px-6 md:px-10 py-16 md:py-20 border-t border-paper/10"
            >
              <div className="grid grid-cols-12 gap-4 mb-8 items-end">
                <div className="col-span-12 md:col-span-8">
                  <div className="text-[12px] text-muted tracking-wider mb-2">
                    {cat.label}
                  </div>
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
                    className="inline-flex items-center gap-2 text-[12px] hover:text-acid transition"
                  >
                    查看全部 {cat.label} <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 md:gap-x-12 gap-y-12 md:gap-y-16">
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
