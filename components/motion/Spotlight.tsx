"use client";

import { useEffect } from "react";

/*
 * One delegated pointer listener feeds --spot-x/--spot-y to whichever
 * .spot card the cursor is over; the highlight itself is pure CSS.
 * Skipped entirely on coarse pointers.
 */
export function Spotlight() {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(".spot");
      if (!(el instanceof HTMLElement)) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
      el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);
  return null;
}
