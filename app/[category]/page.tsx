import { notFound } from "next/navigation";
import Link from "next/link";
import { NewsCard } from "@/components/NewsCard";
import { FeaturedCard } from "@/components/FeaturedCard";
import { Footer } from "@/components/Footer";
import {
  CATEGORIES,
  Category,
  getCategoryMeta,
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

  const items = getNewsByCategory(meta.slug as Category);
  const [first, ...rest] = items;

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
            {meta.label}
            <span className="text-acid">.</span>
          </h1>
          <div className="col-span-12 md:col-span-3 md:col-start-10 md:text-right">
            <div className="text-[13px] text-muted max-w-md">{meta.tagline}</div>
            <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-acid">
              {items.length} dispatches
            </div>
          </div>
        </div>
      </section>

      {first && (
        <section className="px-6 md:px-10 py-10 border-t border-paper/10">
          <div className="eyebrow-acid mb-6">Top story</div>
          <FeaturedCard item={first} />
        </section>
      )}

      <section className="px-6 md:px-10 py-12 border-t border-paper/10">
        <div className="eyebrow mb-8">All stories · 全部</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {rest.map((item) => (
            <NewsCard key={item.id} item={item} size="md" showCategory={false} />
          ))}
        </div>
      </section>

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
