export function Footer() {
  return (
    <footer className="mt-24 border-t border-paper/10">
      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between px-6 md:px-10 py-6 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 bg-acid rounded-full" />
          Dispatch · 2026
        </div>
        <div>News curated from public RSS feeds · Copyrights belong to each source</div>
      </div>
    </footer>
  );
}
