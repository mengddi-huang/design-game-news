import Link from "next/link";
import { NewsItem, formatDate, getCategoryMeta } from "@/lib/news";

interface Props {
  item: NewsItem;
  size?: "sm" | "md" | "lg";
  showCategory?: boolean;
}

export function NewsCard({ item, size = "md", showCategory = true }: Props) {
  const cat = getCategoryMeta(item.category);
  const aspect =
    size === "lg" ? "aspect-[16/10]" : size === "sm" ? "aspect-[4/3]" : "aspect-[3/2]";
  const titleClass =
    size === "lg"
      ? "text-2xl md:text-[28px]"
      : size === "sm"
        ? "text-base md:text-lg"
        : "text-xl md:text-[22px]";

  return (
    <Link
      href={`/news/${item.id}`}
      data-hover
      className="card group block"
    >
      <div
        className={`card-cover relative ${aspect} overflow-hidden bg-panel border border-paper/[0.06]`}
      >
        {item.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.cover}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-panel to-ink" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
        {showCategory && cat && (
          <div className="absolute left-3 top-3 eyebrow-acid backdrop-blur-[2px] bg-ink/40 px-2 py-1 border border-acid/30">
            {cat.labelEn}
          </div>
        )}
        <div className="absolute left-3 bottom-3 right-3 flex items-end justify-between">
          <span className="eyebrow text-paper/70">{item.source}</span>
          <span className="font-mono text-[10.5px] text-paper/60">
            {formatDate(item.publishedAt)}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <h3
          className={`${titleClass} font-medium leading-snug tracking-tightest text-paper transition-colors group-hover:text-acid`}
        >
          {item.title}
        </h3>
        {item.titleEn && size !== "sm" && (
          <div className="mt-2 text-[12.5px] text-muted italic line-clamp-2">
            {item.titleEn}
          </div>
        )}
        {size !== "sm" && (
          <p className="mt-3 text-[13px] text-paper/70 leading-relaxed line-clamp-2">
            {item.excerpt}
          </p>
        )}
        <div className="mt-4 flex items-center gap-2">
          <span
            aria-hidden
            className="h-px w-6 bg-paper/30 transition-all duration-500 group-hover:w-10 group-hover:bg-acid"
          />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted transition-colors group-hover:text-acid">
            Read
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
