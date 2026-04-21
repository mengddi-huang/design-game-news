/**
 * Full-page background watermark. Fixed, non-interactive, near invisible.
 * Text is tiled diagonally so it never clusters in one corner and never
 * competes with actual content.
 */
export function Watermark() {
  const word = "嘎嘣屿爱学习";
  const cells = Array.from({ length: 160 });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      style={{ color: "rgba(255,255,255,0.04)" }}
    >
      <div
        className="absolute -inset-[40%] flex flex-wrap gap-x-10 gap-y-8 serif text-[28px] md:text-[36px] leading-none tracking-[0.15em]"
        style={{ transform: "rotate(-18deg)" }}
      >
        {cells.map((_, i) => (
          <span key={i}>{word}</span>
        ))}
      </div>
    </div>
  );
}
