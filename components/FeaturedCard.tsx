import Link from "next/link";
import { NewsItem, formatDate, getCategoryMeta } from "@/lib/news";

interface Props {
  item: NewsItem;
}

export function FeaturedCard({ item }: Props) {
  const cat = getCategoryMeta(item.category);
  return (
    <Link
      href={`/news/${item.id}`}
      data-hover
      className="card group grid grid-cols-12 gap-6 md:gap-10 items-stretch"
    >
      <div className="col-span-12 md:col-span-7 card-cover relative aspect-[16/10] overflow-hidden border border-paper/[0.06] bg-panel">
        {item.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        {cat && (
          <div className="absolute left-4 top-4 eyebrow-acid bg-ink/50 border border-acid/30 px-2 py-1 backdrop-blur-[2px]">
            Featured · {cat.labelEn}
          </div>
        )}
      </div>

      <div className="col-span-12 md:col-span-5 flex flex-col justify-center">
        <div className="eyebrow mb-5 flex items-center gap-3">
          <span>{item.source}</span>
          <span className="h-px w-6 bg-muted/60" />
          <span>{formatDate(item.publishedAt)}</span>
        </div>
        <h2 className="serif text-3xl md:text-[44px] leading-[1.1] text-paper transition-colors group-hover:text-acid">
          {item.title}
        </h2>
        {item.titleEn && (
          <div className="mt-3 text-sm text-muted italic">{item.titleEn}</div>
        )}
        <p className="mt-6 text-[14px] text-paper/75 leading-relaxed max-w-prose line-clamp-4">
          {item.excerpt}
        </p>
        <div className="mt-8 flex items-center gap-3">
          <span
            aria-hidden
            className="h-px w-10 bg-paper/40 transition-all duration-500 group-hover:w-16 group-hover:bg-acid"
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted transition-colors group-hover:text-acid">
            Read dispatch
          </span>
          <span
            aria-hidden
            className="card-arrow text-muted transition-transform duration-300"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
