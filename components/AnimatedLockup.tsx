"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { LogoCrystal } from "@/components/hero/LogoCrystal";

const useIsoLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

/*
 * The nav lockup, rebuilt as a live composite instead of the flat PNG:
 * real "Infinium" text set in the logo-matched face, with ONE cube —
 * the SVG mark — docked immediately beside the wordmark. Its entrance is
 * deliberately contained within the mark's own footprint so the wordmark
 * remains legible at every frame.
 * Reduced motion (and the resting state) is exactly the logo pose.
 */
// The source lockup's crystal is deliberately much taller than the
// wordmark. Keeping that proportion lets its top and lower facets remain
// visible even where the letters cross the centre of the mark.
const CUBE_PX = 52;
const CUBE_LEFT_PX = -8;
const TEXT_OFFSET_PX = 42;

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
      const tl = gsap.timeline({ delay: 0.08, defaults: { ease: "power3.out" } });
      tl.from(c, {
        autoAlpha: 0,
        scale: 0.84,
        rotation: -16,
        duration: 0.6,
        clearProps: "transform,opacity,visibility",
      }).from(
        t,
        {
          autoAlpha: 0,
          x: -5,
          duration: 0.45,
          clearProps: "transform,opacity,visibility",
        },
        0.12,
      );
    }, w);
    return () => ctx.revert();
  }, []);

  return (
    <span
      ref={wrap}
      className={`relative inline-flex items-center ${className ?? "h-6"}`}
      style={{ paddingLeft: TEXT_OFFSET_PX }}
    >
      {/* the one and only cube — docked beside the wordmark */}
      <span
        ref={cube}
        aria-hidden
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 opacity-100 [filter:drop-shadow(0_0_1px_rgba(23,56,102,0.46))_drop-shadow(0_2px_4px_rgba(23,56,102,0.2))_saturate(1.08)_contrast(1.04)]"
        style={{ left: CUBE_LEFT_PX, width: CUBE_PX, height: CUBE_PX }}
      >
        <LogoCrystal className="h-full w-full" />
      </span>
      {/* wordmark remains fully readable throughout the contained entrance */}
      <span
        ref={text}
        className="relative z-10 font-hero text-[21px] font-medium tracking-[0.005em] text-paper"
      >
        Infinium
      </span>
    </span>
  );
}
