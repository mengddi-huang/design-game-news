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
      ? "text-lg md:text-xl"
      : size === "sm"
        ? "text-[13px] md:text-sm"
        : "text-[15px] md:text-base";

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
          <div className="absolute left-2.5 top-2.5 eyebrow-acid backdrop-blur-[2px] bg-ink/40 px-1.5 py-0.5 border border-acid/30 text-[9.5px]">
            {cat.labelEn}
          </div>
        )}
        <div className="absolute left-2.5 bottom-2.5 right-2.5 flex items-end justify-between">
          <span className="eyebrow text-paper/70 text-[9.5px]">{item.source}</span>
          <span className="font-mono text-[9.5px] text-paper/60">
            {formatDate(item.publishedAt)}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <h3
          className={`${titleClass} font-medium leading-snug tracking-tightest text-paper transition-colors group-hover:text-acid line-clamp-3`}
        >
          {item.title}
        </h3>
        {item.titleEn && size !== "sm" && (
          <div className="mt-1.5 text-[11.5px] text-muted italic line-clamp-2">
            {item.titleEn}
          </div>
        )}
        {size !== "sm" && (
          <p className="mt-2 text-[12px] text-paper/65 leading-relaxed line-clamp-2">
            {item.excerpt}
          </p>
        )}
        <div className="mt-3 flex items-center gap-2">
          <span
            aria-hidden
            className="h-px w-5 bg-paper/30 transition-all duration-500 group-hover:w-8 group-hover:bg-acid"
          />
          <span className="text-[11px] text-muted transition-colors group-hover:text-acid">
            阅读
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
