"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { LogoCrystal } from "@/components/hero/LogoCrystal";

const useIsoLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

/*
 * The nav lockup with its entrance: the brand cube rolls left-to-right
 * across the wordmark, revealing the text behind it as it travels, then
 * the lockup settles with a small bounce as the cube exits. Plays once
 * per full page load; reduced motion (or JS failure states) resolve to
 * the plain lockup. The wordmark ships clipped in the SSR markup so the
 * roll never flashes the finished state first.
 */
export function AnimatedLockup({ className }: { className?: string }) {
  const wrap = useRef<HTMLSpanElement>(null);
  const mark = useRef<HTMLSpanElement>(null);
  const box = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const w = wrap.current;
    const m = mark.current;
    const b = box.current;
    if (!w || !m || !b) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      m.style.clipPath = "none";
      b.style.display = "none";
      return;
    }

    const ctx = gsap.context(() => {
      const travel = w.offsetWidth;
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: "power2.inOut" } });
      tl.set(b, { x: -2, yPercent: -50, rotation: 0, autoAlpha: 1 })
        .to(b, { x: travel + 6, rotation: 540, duration: 1.05 })
        .to(m, { clipPath: "inset(-8% 0% -8% 0%)", duration: 1.05 }, "<")
        .to(b, { autoAlpha: 0, duration: 0.16 }, "-=0.14")
        .from(m, { y: -3, duration: 0.4, ease: "back.out(3)", clearProps: "transform" }, "-=0.1")
        .set(m, { clipPath: "none" });
    }, w);
    return () => ctx.revert();
  }, []);

  return (
    <span ref={wrap} className="relative inline-block">
      {/* wordmark — clipped shut until the roll reveals it */}
      <span ref={mark} className="block" style={{ clipPath: "inset(-8% 100% -8% 0%)" }}>
        <img
          src="/img/logo-nav.png"
          alt="Infinium"
          width={238}
          height={90}
          className={`w-auto ${className ?? "h-6"}`}
          decoding="async"
        />
      </span>
      {/* the rolling brand cube */}
      <span
        ref={box}
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 opacity-0"
      >
        <LogoCrystal className="h-[22px] w-[22px]" />
      </span>
    </span>
  );
}
