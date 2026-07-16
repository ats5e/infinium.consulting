"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import type { SiteImage } from "@/lib/images";
import ClarityField, { LANES, laneY } from "./ClarityField";

const useIsoLayoutEffect =
  typeof document !== "undefined" ? useLayoutEffect : useEffect;

/*
 * THE CLARITY FIELD hero.
 *
 * A disciplined split: the copy column is pristine — stacked whisper,
 * one editorial sentence with a single cobalt word, a short measure,
 * two quiet actions — and all complexity is quarantined inside the
 * field on the right, where raw events braid into six engineered
 * lanes. The bottom rail is live telemetry: the percentage is the real
 * fraction of the field currently in its ordered phase.
 */

const LANE_ICONS: Record<(typeof LANES)[number], React.ReactNode> = {
  Payments: (
    <path d="M2 4.5h7M7 2.5l2 2-2 2M10 9.5H3M5 7.5l-2 2 2 2" />
  ),
  Risk: <path d="M6 1.8 11 10H1L6 1.8ZM6 5v2.4M6 8.6v.2" />,
  Compliance: <path d="M6 1.5 10 3v3c0 2.4-1.7 4-4 5-2.3-1-4-2.6-4-5V3l4-1.5ZM4.4 6l1.2 1.2L8 4.8" />,
  Liquidity: <path d="M1 6h2l1.5-3 2 6L8.5 6H11" />,
  Settlement: (
    <path d="M2.5 2.5h2v2h-2zM7.5 2.5h2v2h-2zM2.5 7.5h2v2h-2zM7.5 7.5h2v2h-2z" />
  ),
  Regulation: <path d="M1.5 10.5h9M2.5 8.5v-4M5 8.5v-4M7 8.5v-4M9.5 8.5v-4M1.5 4.5 6 1.5l4.5 3" />,
};

export function Hero({ staticImage: _staticImage }: { staticImage: SiteImage }) {
  void _staticImage;
  const section = useRef<HTMLElement>(null);
  const [still, setStill] = useState(false);
  const [order, setOrder] = useState(0);
  const orderGate = useRef({ v: -1, t: 0 });

  useEffect(() => {
    const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // automated agents get one rich, measurable frame
    const update = () => setStill(rmq.matches || navigator.webdriver === true);
    update();
    rmq.addEventListener("change", update);
    return () => rmq.removeEventListener("change", update);
  }, []);

  const handleOrder = useCallback((pct: number) => {
    const now = performance.now();
    const g = orderGate.current;
    if (pct !== g.v && now - g.t > 300) {
      g.v = pct;
      g.t = now;
      setOrder(pct);
    }
  }, []);

  useIsoLayoutEffect(() => {
    if (still || !section.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero-line", { yPercent: 110, duration: 0.9, stagger: 0.1, clearProps: "transform" }, 0.08)
        .from(".hero-field-wrap", { opacity: 0, x: 36, duration: 1.4, ease: "power3.out", clearProps: "transform,opacity" }, 0.3)
        .from(".hero-body", { y: 14, opacity: 0, duration: 0.6, clearProps: "transform,opacity" }, 0.55)
        .from(".hero-actions > *", { y: 10, opacity: 0, duration: 0.5, stagger: 0.08, clearProps: "transform,opacity" }, 0.7)
        .from(".hero-rail > *", { opacity: 0, duration: 0.6, stagger: 0.1, clearProps: "opacity" }, 1.0);
    }, section);
    return () => ctx.revert();
  }, [still]);

  return (
    <section
      ref={section}
      className="relative overflow-hidden bg-void md:min-h-svh"
      aria-label="Introduction"
    >
      {/* legibility wash: the copy column stays pristine over the
          field's left tail */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[54%] bg-gradient-to-r from-void via-void/90 to-transparent md:block"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-(--container-content) flex-col px-(--spacing-gutter) pb-8 pt-24 md:min-h-svh md:pt-28">
        <div className="max-w-xl pt-6 md:pt-12">
          <h1 className="font-hero text-[clamp(2.5rem,4.6vw,4.2rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-paper">
            <span className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
              <span className="hero-line block">Complex systems</span>
            </span>{" "}
            <span className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
              <span className="hero-line block">
                become <span className="text-cobalt">decisions.</span>
              </span>
            </span>
          </h1>

          <p className="hero-body mt-6 max-w-md text-[clamp(0.98rem,1.25vw,1.12rem)] leading-[1.6] text-ice">
            We turn complex financial systems into intelligent, scalable
            infrastructure—combining deep industry context with engineering,
            AI and automation.
          </p>

          <div className="hero-actions mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/services"
              className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.1em] text-cobalt transition-colors duration-(--duration-fast) hover:text-navy"
            >
              Explore our work →
            </Link>
            <Link
              href="/contact"
              className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.1em] text-steel transition-colors duration-(--duration-fast) hover:text-paper"
            >
              Meet us →
            </Link>
          </div>
        </div>

        {/* the rail: a running system, not a picture */}
        <div className="hero-rail mt-auto hidden items-end justify-between gap-6 pt-12 md:flex">
          <div className="flex items-center gap-3">
            <span aria-hidden className="block h-5 w-px bg-navy/30" />
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
              Scroll to explore
            </span>
          </div>
          <div aria-hidden className="flex items-center gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
              Organising complexity into context
            </span>
            <span className="relative h-px w-28 overflow-hidden bg-navy/15">
              <span
                className="absolute inset-y-0 left-0 bg-cobalt transition-[width] duration-(--duration-base)"
                style={{ width: `${order}%` }}
              />
            </span>
            <span className="w-8 font-mono text-[9px] uppercase tracking-[0.1em] text-cobalt tabular-nums">
              {order}%
            </span>
          </div>
        </div>
      </div>

      {/* the field — owns the right, bleeds to the viewport edge */}
      <div className="hero-field-wrap pointer-events-none relative mx-auto mt-2 h-[44svh] w-full pb-6 md:pointer-events-auto md:absolute md:inset-y-0 md:left-[36%] md:right-0 md:mt-0 md:h-auto md:w-auto md:pb-0">
        <div className="absolute inset-y-[4%] left-0 right-24 md:inset-y-[10%] md:right-28">
          <ClarityField still={still} onOrder={handleOrder} />
        </div>
        {/* the six lanes of financial infrastructure */}
        <div aria-hidden className="absolute inset-y-[4%] right-2 w-20 md:inset-y-[10%] md:right-6 md:w-24">
          {LANES.map((lane, i) => (
            <div
              key={lane}
              className="absolute left-0 flex -translate-y-1/2 items-center gap-2"
              style={{ top: `${laneY(i) * 100}%` }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="#5b6b7f"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {LANE_ICONS[lane]}
              </svg>
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-steel">
                {lane}
              </span>
            </div>
          ))}
        </div>
      </div>


      <div
        aria-hidden
        className="load-hairline absolute inset-x-0 bottom-0 h-px bg-ice/12"
      />
    </section>
  );
}
