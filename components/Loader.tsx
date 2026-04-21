"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function Loader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!rootRef.current || !barRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => setGone(true),
    });

    tl.to(barRef.current, {
      scaleX: 1,
      duration: 0.9,
      ease: "expo.out",
    });
    tl.to(
      rootRef.current,
      {
        yPercent: -100,
        duration: 0.9,
        ease: "expo.inOut",
      },
      "+=0.15"
    );
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[90] bg-ink flex items-center justify-center"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="eyebrow">Dispatch · 2026</div>
        <div className="h-px w-40 bg-paper/10 overflow-hidden">
          <div
            ref={barRef}
            className="h-full w-full origin-left bg-acid"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
