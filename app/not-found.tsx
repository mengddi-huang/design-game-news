import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-5">
      <div className="text-[12px] text-muted tracking-wider">404 · 页面未找到</div>
      <h1 className="serif text-5xl md:text-7xl">
        走丢了<span className="text-acid">。</span>
      </h1>
      <p className="max-w-md text-sm text-paper/70">
        这里没有资讯。也许你要找的板块还没开张,或者链接已过期。
      </p>
      <Link
        href="/"
        data-hover
        className="inline-flex items-center gap-3 border border-paper/30 px-5 py-3 text-[13px] hover:bg-acid hover:text-ink hover:border-acid transition"
      >
        回到首页 <span aria-hidden>→</span>
      </Link>
    </main>
  );
}
