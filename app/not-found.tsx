import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-5">
      <div className="eyebrow">Error 404 · Not Found</div>
      <h1 className="serif text-5xl md:text-7xl">
        Lost<span className="text-acid">.</span>
      </h1>
      <p className="max-w-md text-sm text-paper/70">
        这里没有资讯。也许你要找的版块还没开张,或者链接已过期。
      </p>
      <Link
        href="/"
        data-hover
        className="inline-flex items-center gap-3 border border-paper/30 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] hover:bg-acid hover:text-ink hover:border-acid transition"
      >
        Back to Dispatch <span aria-hidden>→</span>
      </Link>
    </main>
  );
}
