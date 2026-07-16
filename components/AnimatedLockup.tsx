"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { LogoCrystal } from "@/components/hero/LogoCrystal";

const useIsoLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

/*
 * The nav lockup, rebuilt as a live composite instead of the flat PNG:
 * real "Infinium" text set in the logo-matched face, with ONE cube —
 * the SVG mark — sitting behind the letters at the logo's position
 * (centre-x 36.3%, measured from the artwork). On entrance the cube
 * rolls right revealing the letters, rolls back a full turn and docks
 * home as itself, so nothing static ever sits underneath the roll.
 * Reduced motion (and the resting state) is exactly the logo pose.
 */
const CUBE_PX = 26;
const CUBE_CENTER_FRAC = 0.363;

export function AnimatedLockup({ className }: { className?: string }) {
  const wrap = useRef<HTMLSpanElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const cube = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const w = wrap.current;
    const t = text.current;
    const c = cube.current;
    if (!w || !t || !c) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      t.style.clipPath = "none";
      return;
    }

    const ctx = gsap.context(() => {
      const width = w.offsetWidth;
      const home = CUBE_CENTER_FRAC * width; // cube centre, at rest (x = 0)
      const start = -(home - CUBE_PX / 2); // centre at the left edge
      const out = width - CUBE_PX / 2 - home; // centre at the right edge
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "power2.inOut" } });
      tl.set(c, { x: start, rotation: 0 })
        // out: roll right across the word, revealing it
        .to(c, { x: out, rotation: 720, duration: 1.0 })
        .to(t, { clipPath: "inset(-15% 0% -15% 0%)", duration: 1.0 }, "<")
        // home: one full turn back to the logo pose — the cube stays,
        // it IS the mark
        .to(c, { x: 0, rotation: 360, duration: 0.65 })
        .from(t, { y: -2, duration: 0.35, ease: "back.out(2.5)", clearProps: "transform" }, "-=0.2")
        .set(t, { clipPath: "none" })
        .set(c, { rotation: 0 });
    }, w);
    return () => ctx.revert();
  }, []);

  return (
    <span ref={wrap} className={`relative inline-flex items-center ${className ?? "h-6"}`}>
      {/* the one and only cube — behind the letters, home at the logo position */}
      <span
        ref={cube}
        aria-hidden
        className="pointer-events-none absolute top-1/2 -translate-y-1/2"
        style={{ left: `calc(${CUBE_CENTER_FRAC * 100}% - ${CUBE_PX / 2}px)`, width: CUBE_PX, height: CUBE_PX }}
      >
        <LogoCrystal className="h-full w-full" />
      </span>
      {/* wordmark — ships clipped, the roll reveals it */}
      <span
        ref={text}
        className="relative z-10 font-hero text-[21px] font-medium tracking-[0.005em] text-paper"
        style={{ clipPath: "inset(-15% 100% -15% 0%)" }}
      >
        Infinium
      </span>
    </span>
  );
}
