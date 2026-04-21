import Link from "next/link";
import { CATEGORIES } from "@/lib/news";

export function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-ink/70 border-b border-paper/[0.06]">
      <div className="flex items-center justify-between px-6 md:px-10 h-14">
        <Link
          href="/"
          data-hover
          className="flex items-center gap-2 text-[13px] tracking-[0.18em] text-paper"
        >
          <span className="inline-block h-1.5 w-1.5 bg-acid rounded-full" />
          简报 Dispatch
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-[13px] text-paper/80">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              data-hover
              className="hover:text-acid transition-colors"
            >
              {c.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block text-[12px] text-muted">
          第 01 期 · 2026
        </div>
      </div>
    </header>
  );
}
