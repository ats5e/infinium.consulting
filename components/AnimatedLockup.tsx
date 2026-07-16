"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { LogoCrystal } from "@/components/hero/LogoCrystal";

const useIsoLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

/*
 * The nav lockup, rebuilt as a live composite instead of the flat PNG:
 * real "Infinium" text set in the logo-matched face, with ONE cube —
 * the SVG mark — sitting behind the letters at the trademarked position
 * (centre-x 36.3%, measured from the supplied artwork). On entrance the
 * cube rolls across to reveal the wordmark, then rolls back and docks home.
 * A restrained internal refraction highlight lifts the navy letters from
 * the dark facets without outlining or altering the wordmark.
 * Reduced motion (and the resting state) is exactly the logo pose.
 */
const CUBE_PX = 40;
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
      return;
    }

    const ctx = gsap.context(() => {
      const width = w.offsetWidth;
      const home = CUBE_CENTER_FRAC * width;
      const start = -(home - CUBE_PX / 2);
      const out = width - CUBE_PX / 2 - home;
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "power2.inOut" } });

      tl.set(t, { clipPath: "inset(-18% 100% -18% 0%)" })
        .set(c, { x: start, rotation: 0 })
        .to(c, { x: out, rotation: 720, duration: 1.0 })
        .to(t, { clipPath: "inset(-18% 0% -18% 0%)", duration: 1.0 }, "<")
        .to(c, { x: 0, rotation: 360, duration: 0.65 })
        .from(t, { y: -2, duration: 0.35, ease: "back.out(2.5)", clearProps: "transform" }, "-=0.2")
        .set(t, { clearProps: "clipPath" })
        .set(c, { rotation: 0 });
    }, w);
    return () => ctx.revert();
  }, []);

  return (
    <span
      ref={wrap}
      data-lockup="animated"
      className={`relative isolate inline-flex items-center ${className ?? "h-6"}`}
    >
      {/* The mark remains behind the text at the registered lockup position. */}
      <span
        ref={cube}
        aria-hidden
        data-logo-layer="crystal"
        className="pointer-events-none absolute z-0 top-1/2 -translate-y-1/2 [filter:drop-shadow(0_3px_7px_rgba(23,56,102,0.24))_saturate(1.16)_contrast(1.08)]"
        style={{ left: `calc(${CUBE_CENTER_FRAC * 100}% - ${CUBE_PX / 2}px)`, width: CUBE_PX, height: CUBE_PX }}
      >
        <LogoCrystal className="h-full w-full" />
        <span className="absolute inset-[7%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.62)_0%,rgba(220,235,252,0.28)_42%,transparent_72%)]" />
      </span>
      {/* Clean navy lettering: contrast comes from the refracted mark below. */}
      <span
        ref={text}
        data-logo-layer="wordmark"
        className="relative z-10 font-hero text-[21px] font-medium tracking-[0.005em] text-paper"
      >
        Infinium
      </span>
    </span>
  );
}
