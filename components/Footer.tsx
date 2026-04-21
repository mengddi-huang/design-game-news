export function Footer() {
  return (
    <footer className="mt-24 border-t border-paper/10">
      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between px-6 md:px-10 py-6 text-[12px] text-muted">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 bg-acid rounded-full" />
          简报 Dispatch · 2026
        </div>
        <div>资讯均聚合自公开 RSS 源 · 版权归各原作者所有</div>
      </div>
    </footer>
  );
}
