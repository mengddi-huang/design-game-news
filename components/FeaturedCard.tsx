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
      <div className="col-span-12 md:col-span-6 card-cover relative aspect-[16/10] overflow-hidden border border-paper/[0.06] bg-panel">
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
          <div className="absolute left-3 top-3 bg-ink/50 border border-acid/30 px-1.5 py-0.5 backdrop-blur-[2px] text-[11px] text-acid">
            精选 · {cat.label}
          </div>
        )}
      </div>

      <div className="col-span-12 md:col-span-6 flex flex-col justify-center">
        <div className="eyebrow mb-3 flex items-center gap-2 text-[10px]">
          <span>{item.source}</span>
          <span className="h-px w-5 bg-muted/60" />
          <span>{formatDate(item.publishedAt)}</span>
        </div>
        <h2 className="serif text-xl md:text-[26px] leading-[1.15] text-paper transition-colors group-hover:text-acid">
          {item.title}
        </h2>
        {item.titleEn && (
          <div className="mt-2 text-[12.5px] text-muted italic">
            {item.titleEn}
          </div>
        )}
        <p className="mt-4 text-[13px] text-paper/70 leading-relaxed max-w-prose line-clamp-3">
          {item.excerpt}
        </p>
        <div className="mt-5 flex items-center gap-2">
          <span
            aria-hidden
            className="h-px w-8 bg-paper/40 transition-all duration-500 group-hover:w-12 group-hover:bg-acid"
          />
          <span className="text-[12px] text-muted transition-colors group-hover:text-acid">
            阅读全文
          </span>
          <span
            aria-hidden
            className="card-arrow text-muted transition-transform duration-300 text-xs"
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
