"use client";

import { useEffect } from "react";

/*
 * A tiny global interaction layer. It does not render UI; it simply writes
 * the current pointer position into CSS variables consumed by the site
 * backdrop and award cards. The effect is disabled on touch/reduced-motion
 * surfaces so it never fights scroll or accessibility preferences.
 */
export function PointerGlow() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    let raf = 0;
    const root = document.documentElement;

    const move = (event: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        root.style.setProperty("--pointer-x", `${event.clientX}px`);
        root.style.setProperty("--pointer-y", `${event.clientY}px`);
      });
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return null;
}
