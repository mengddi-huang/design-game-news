import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { NewsCard } from "@/components/NewsCard";
import { getAllNews, getCategoryMeta, formatDate } from "@/lib/news";

export function generateStaticParams() {
  return getAllNews().map((n) => ({ id: n.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const item = getAllNews().find((n) => n.id === params.id);
  if (!item) return {};
  return {
    title: `${item.title} · Dispatch`,
    description: item.excerpt,
  };
}

export default function NewsDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const item = getAllNews().find((n) => n.id === params.id);
  if (!item) notFound();

  const meta = getCategoryMeta(item.category);
  const related = getAllNews()
    .filter((n) => n.category === item.category && n.id !== item.id)
    .slice(0, 3);

  return (
    <main className="relative min-h-screen pt-20 md:pt-24">
      <article className="px-6 md:px-10 py-10 max-w-[1200px] mx-auto">
        <div className="eyebrow mb-6 flex flex-wrap gap-x-3">
          <Link href="/" data-hover className="hover:text-acid">
            Dispatch
          </Link>
          <span>/</span>
          <Link
            href={`/${item.category}`}
            data-hover
            className="hover:text-acid"
          >
            {meta?.labelEn}
          </Link>
          <span>/</span>
          <span className="text-paper/60">{item.id}</span>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-8 items-end mb-8">
          <div className="col-span-12 md:col-span-9">
            <h1 className="serif text-[36px] md:text-[56px] leading-[1.05] tracking-tightest text-paper">
              {item.title}
            </h1>
            {item.titleEn && (
              <div className="mt-3 text-base md:text-lg text-muted italic">
                {item.titleEn}
              </div>
            )}
          </div>
          <div className="col-span-12 md:col-span-3 flex flex-wrap gap-3 md:justify-end">
            {item.tags?.map((t) => (
              <span
                key={t}
                className="font-mono text-[10.5px] uppercase tracking-[0.2em] border border-paper/20 px-2 py-1 text-paper/75"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-paper/10 py-4 mb-8">
          <div className="eyebrow">
            <span className="text-muted">Source </span>
            <span className="text-paper">{item.source}</span>
          </div>
          <span className="h-3 w-px bg-paper/20" />
          <div className="eyebrow">
            <span className="text-muted">Published </span>
            <span className="text-paper font-mono">
              {formatDate(item.publishedAt)}
            </span>
          </div>
          <span className="h-3 w-px bg-paper/20" />
          <div className="eyebrow">
            <span className="text-muted">Category </span>
            <Link
              href={`/${item.category}`}
              data-hover
              className="text-paper hover:text-acid"
            >
              {meta?.labelEn}
            </Link>
          </div>
        </div>

        {item.cover && (
          <div className="relative w-full overflow-hidden border border-paper/10 aspect-[16/8] mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.cover}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          </div>
        )}

        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-7">
            <p className="text-[15px] md:text-base text-paper/85 leading-[1.75]">
              {item.excerpt}
            </p>
            <p className="mt-6 text-[13px] text-muted leading-relaxed">
              完整内容与版权归 {item.source} 所有。Dispatch 仅聚合标题、摘要与元信息,
              点击右侧按钮跳转至原文阅读。
            </p>
          </div>
          <aside className="col-span-12 md:col-span-4 md:col-start-9">
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              data-hover
              className="group flex items-center justify-between gap-4 border border-paper/30 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.22em] hover:bg-acid hover:text-ink hover:border-acid transition"
            >
              <span>阅读原文 · Read on {item.source}</span>
              <span
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              >
                ↗
              </span>
            </a>
          </aside>
        </div>
      </article>

      <section className="px-6 md:px-10 py-12 border-t border-paper/10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="eyebrow mb-2">Related</div>
            <h2 className="serif text-2xl md:text-3xl">
              More from {meta?.labelEn}
            </h2>
          </div>
          <Link
            href={`/${item.category}`}
            data-hover
            className="hidden md:inline-flex font-mono text-[11px] uppercase tracking-[0.22em] hover:text-acid"
          >
            All {meta?.labelEn} →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {related.map((r) => (
            <NewsCard key={r.id} item={r} size="md" showCategory={false} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
