import { notFound } from "next/navigation";
import Link from "next/link";
import { NewsCard } from "@/components/NewsCard";
import { FeaturedCard } from "@/components/FeaturedCard";
import { Footer } from "@/components/Footer";
import {
  CATEGORIES,
  Category,
  getCategoryMeta,
  getGamesSplit,
  getNewsByCategory,
} from "@/lib/news";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { category: string };
}) {
  const meta = getCategoryMeta(params.category);
  if (!meta) return {};
  return {
    title: `${meta.label} · Dispatch`,
    description: meta.tagline,
  };
}

export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const meta = getCategoryMeta(params.category);
  if (!meta) notFound();

  const slug = meta.slug as Category;
  const items = getNewsByCategory(slug);
  const isGames = slug === "games";
  const { competitors: rivals, others: sidebar } = isGames
    ? getGamesSplit(3)
    : { competitors: [] as typeof items, others: [] as typeof items };
  const listForBody = isGames ? rivals : items;
  const [first, ...rest] = listForBody;
  const pageTitle = isGames ? "三角洲竞品" : meta.label;
  const pageTagline = isGames
    ? "撤离射击与战术 FPS 赛道 — Tarkov / Arena Breakout / Gray Zone Warfare / ARC Raiders / Marathon / Warzone / Battlefield / R6 Siege."
    : meta.tagline;

  return (
    <main className="relative min-h-screen pt-20 md:pt-24">
      <section className="px-6 md:px-10 py-10">
        <div className="eyebrow mb-4 flex items-center gap-3">
          <Link href="/" data-hover className="hover:text-acid">
            Dispatch
          </Link>
          <span>/</span>
          <span>{meta.labelEn}</span>
        </div>
        <div className="grid grid-cols-12 gap-4 items-end">
          <h1 className="col-span-12 md:col-span-8 serif text-[44px] md:text-[72px] leading-[0.98] tracking-tightest">
            {pageTitle}
            <span className="text-acid">.</span>
          </h1>
          <div className="col-span-12 md:col-span-3 md:col-start-10 md:text-right">
            <div className="text-[13px] text-muted max-w-md">{pageTagline}</div>
            <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-acid">
              {listForBody.length} dispatches
              {isGames && sidebar.length > 0
                ? ` · +${sidebar.length} other`
                : ""}
            </div>
          </div>
        </div>
      </section>

      {first && (
        <section className="px-6 md:px-10 py-10 border-t border-paper/10">
          <div className="eyebrow-acid mb-6">
            {isGames ? "Top rival" : "Top story"}
          </div>
          <FeaturedCard item={first} />
        </section>
      )}

      <section className="px-6 md:px-10 py-12 border-t border-paper/10">
        <div className="eyebrow mb-8">
          {isGames ? "More rivals · 更多竞品" : "All stories · 全部"}
        </div>
        {rest.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {rest.map((item) => (
              <NewsCard key={item.id} item={item} size="md" showCategory={false} />
            ))}
          </div>
        ) : (
          <div className="text-[13px] text-muted">
            暂无更多条目。
          </div>
        )}
      </section>

      {isGames && sidebar.length > 0 && (
        <section className="px-6 md:px-10 py-12 border-t border-paper/10">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="eyebrow mb-1">Also in games</div>
              <h2 className="serif text-2xl md:text-3xl">其他游戏动态</h2>
              <p className="mt-2 text-[13px] text-muted max-w-md">
                赛道外值得一瞥 —— 只列近期最热的 {sidebar.length} 条。
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {sidebar.map((item) => (
              <NewsCard key={item.id} item={item} size="md" showCategory={false} />
            ))}
          </div>
        </section>
      )}

      <section className="px-6 md:px-10 py-10 border-t border-paper/10 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="eyebrow">End of stream — 已是全部</div>
        <div className="flex gap-6">
          {CATEGORIES.filter((c) => c.slug !== meta.slug).map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              data-hover
              className="font-mono text-[11px] uppercase tracking-[0.22em] hover:text-acid transition"
            >
              → {c.labelEn}
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
