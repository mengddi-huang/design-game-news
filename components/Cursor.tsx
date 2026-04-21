"use client";

import { useEffect, useRef } from "react";

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    function move(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot!.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }

    function raf() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring!.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    function onEnter() {
      ring!.style.setProperty("--ring-scale", "2.4");
      ring!.style.setProperty("--ring-bg", "rgba(232,255,74,0.15)");
      ring!.style.setProperty("--ring-border", "rgba(232,255,74,0.9)");
    }
    function onLeave() {
      ring!.style.setProperty("--ring-scale", "1");
      ring!.style.setProperty("--ring-bg", "transparent");
      ring!.style.setProperty("--ring-border", "rgba(242,242,242,0.6)");
    }

    window.addEventListener("mousemove", move, { passive: true });
    document.querySelectorAll("a, button, [data-hover]").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          borderRadius: "50%",
          border: "1px solid var(--ring-border, rgba(242,242,242,0.6))",
          background: "var(--ring-bg, transparent)",
          pointerEvents: "none",
          zIndex: 80,
          mixBlendMode: "difference",
          transition:
            "width 0.25s ease, height 0.25s ease, background 0.25s ease, border-color 0.25s ease",
          transform: "scale(var(--ring-scale, 1))",
          transformOrigin: "center",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 5,
          height: 5,
          marginLeft: -2.5,
          marginTop: -2.5,
          borderRadius: "50%",
          background: "var(--paper)",
          pointerEvents: "none",
          zIndex: 81,
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}
