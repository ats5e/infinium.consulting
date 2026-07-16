"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import type { SiteImage } from "@/lib/images";
import { Counter } from "@/components/motion/Counter";

const useIsoLayoutEffect =
  typeof document !== "undefined" ? useLayoutEffect : useEffect;

/*
 * THE RULED LINE.
 *
 * One engineered hairline divides the viewport: above it, the world as
 * it arrives — dense, murmuring, machine-broken financial matter and
 * the headline in its raw state. Below it, the same world resolved —
 * the sentence completed in ink, one paragraph, three actions, four
 * numbers. The company is not pictured. The company is the line.
 *
 * On load the page is all noise; the line descends like a platen,
 * resolving everything it passes, and settles into the corridor between
 * the two halves of the sentence. The pointer can lean on the boundary
 * (±22px, damped); it always returns. The line never moves on its own —
 * its stillness is the confidence. Every hairline on the site after
 * this one is its descendant.
 */

/* the raw world's matter — authentic machine-finance vocabulary,
 * texture from a distance, true up close (decorative, aria-hidden) */
const RAW = [
  "pacs.008.001.10",
  ":32A:260716EUR1250000,",
  "camt.053 · intraday",
  "LEI 7245009KX31",
  "VaR Δ +0.0031",
  "t+0 14:02:11.482",
  "MT103 // STP",
  "model M-114 champion",
  "ISO 20022 · pain.001",
  "ctpy graph deg 14",
  "limit util 87.3%",
  "kyc refresh Q3",
  "basis 12.5bp",
  "o/n repo 3.82",
  "fx tom/next",
  "npv Δ −18,240",
  "sanctions p<0.02",
  "drift 0.8σ",
  "collateral haircut 8%",
  "swift gpi ack",
  "book 7 recon break",
  "aml alert 4471 → fp",
  "ridge λ 0.12",
  "backtest 250d green",
] as const;

const MURMUR = ["murmur-a", "murmur-b", "murmur-c"] as const;

function RawField() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex flex-wrap content-start gap-x-8 gap-y-3.5 overflow-hidden px-(--spacing-gutter) pt-24"
    >
      {Array.from({ length: 7 }, (_, rep) =>
        RAW.map((fragment, i) => (
          <span
            key={`${rep}-${i}`}
            className={`${MURMUR[(rep + i) % 3]} whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.14em] text-paper/[0.16]`}
          >
            {fragment}
          </span>
        )),
      )}
    </div>
  );
}

const evidence = [
  [22, "", "Leading global FS clients"],
  [100, "+", "Projects completed"],
  [30, "", "Fintech solution technologies"],
  [2, "", "Global offices"],
] as const;

export function Hero({ staticImage: _staticImage }: { staticImage: SiteImage }) {
  void _staticImage;
  const section = useRef<HTMLElement>(null);
  const anchor = useRef<HTMLSpanElement>(null);
  const rest = useRef(0);
  const settled = useRef(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useIsoLayoutEffect(() => {
    const sec = section.current;
    const anc = anchor.current;
    if (!sec || !anc) return;

    const apply = (v: number) => sec.style.setProperty("--line", `${v}px`);
    const measure = () =>
      anc.getBoundingClientRect().top - sec.getBoundingClientRect().top - 26;

    rest.current = measure();

    if (reduced) {
      apply(rest.current);
      return;
    }

    settled.current = false;
    const proxy = { v: sec.offsetHeight * 1.12 };
    apply(proxy.v);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => {
          settled.current = true;
        },
      });
      tl.from(".hero-meta > *", { y: 8, opacity: 0, duration: 0.45, stagger: 0.07, clearProps: "transform,opacity" }, 0)
        .from(".hero-line-raw", { yPercent: 106, duration: 0.8, clearProps: "transform" }, 0.1)
        // the platen: descends, resolves, lands with real weight
        .to(proxy, { v: rest.current + 10, duration: 1.5, ease: "power3.inOut", onUpdate: () => apply(proxy.v) }, 0.35)
        .to(proxy, { v: rest.current, duration: 0.5, ease: "back.out(2.2)", onUpdate: () => apply(proxy.v) })
        .from(".hero-line-resolved", { y: 18, opacity: 0, duration: 0.6, ease: "power3.out", clearProps: "transform,opacity" }, 1.25)
        .from(".hero-intro > *", { y: 12, opacity: 0, duration: 0.5, stagger: 0.07, clearProps: "transform,opacity" }, 1.45)
        .from(".hero-evidence > *", { opacity: 0, duration: 0.45, stagger: 0.05, clearProps: "opacity" }, 1.62);
    }, sec);

    // the boundary leans toward attention, then returns — fine pointers only
    let quick: ((v: number) => void) | null = null;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      if (!settled.current || !fine) return;
      if (!quick) quick = gsap.quickTo(proxy, "v", { duration: 0.55, ease: "power3", onUpdate: () => apply(proxy.v) });
      const top = sec.getBoundingClientRect().top;
      const lean = (e.clientY - top - rest.current) * 0.25;
      quick(rest.current + Math.max(-22, Math.min(22, lean)));
    };
    const onLeave = () => {
      if (settled.current && quick) quick(rest.current);
    };
    const onResize = () => {
      rest.current = measure();
      if (settled.current) {
        proxy.v = rest.current;
        apply(rest.current);
      }
    };
    sec.addEventListener("pointermove", onMove);
    sec.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      ctx.revert();
      sec.removeEventListener("pointermove", onMove);
      sec.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  return (
    <section
      ref={section}
      className="relative min-h-svh overflow-hidden bg-void"
      aria-label="Introduction"
      style={{ "--line": "56%" } as React.CSSProperties}
    >
      {/* THE VEIL — the raw world, everything above the line */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-20 overflow-hidden bg-void"
        style={{ height: "var(--line)" }}
      >
        <RawField />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-void via-void/80 to-transparent" />
      </div>

      {/* THE LINE — and its cobalt full stop */}
      <div
        aria-hidden
        className="absolute inset-x-0 z-20 h-px bg-paper"
        style={{ top: "var(--line)" }}
      >
        <span className="absolute right-(--spacing-gutter) top-1/2 size-[5px] -translate-y-1/2 bg-cobalt" />
      </div>

      {/* no z-index here: the container must not trap its children's
          stacking — meta + the raw headline rise above the veil (z-30),
          the resolved world stays beneath it (z-10) until the line passes */}
      <div className="relative mx-auto flex min-h-svh w-full max-w-(--container-content) flex-col px-(--spacing-gutter) pb-7 pt-24 md:pb-8 md:pt-28">
        {/* meta — lives in the raw world */}
        <div className="hero-meta relative z-30 flex items-center justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.12em] text-steel">
          <p>Financial systems / AI / automation</p>
          <p className="hidden text-right sm:block">Amsterdam / Dubai</p>
        </div>

        <h1 className="mt-6 font-hero font-bold uppercase md:mt-8">
          {/* raw state — thin ink, machine-loose, above the line */}
          <span className="relative z-30 block overflow-hidden pb-[0.04em] -mb-[0.04em]">
            <span className="hero-line-raw block text-[clamp(2.9rem,9.2vw,8.4rem)] leading-[0.86] tracking-[0.004em] text-paper/[0.38]">
              Engineering
            </span>
          </span>{" "}
          {/* resolved state — full ink, below the line */}
          <span ref={anchor} className="relative z-10 mt-10 block md:mt-14">
            <span className="hero-line-resolved block text-[clamp(2.9rem,9.2vw,8.4rem)] leading-[0.86] tracking-[-0.022em] text-paper">
              with <span className="text-cobalt">context.</span>
            </span>
          </span>
        </h1>

        {/* the resolved world — one paragraph, three actions */}
        <div className="hero-intro mt-8 grid items-center gap-6 md:mt-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10">
          <p className="max-w-3xl text-[clamp(0.98rem,1.35vw,1.2rem)] leading-[1.55] text-ice">
            We turn complex financial systems into intelligent, scalable
            infrastructure—combining deep industry context with engineering,
            AI and automation.
          </p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link
              href="/contact"
              className="btn-sheen inline-flex min-h-11 items-center bg-cobalt px-7 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-white shadow-[0_8px_24px_rgba(35,79,189,0.18)] transition-[background-color,box-shadow] duration-(--duration-fast) ease-(--ease-out-expo) hover:bg-navy hover:shadow-[0_10px_28px_rgba(23,56,102,0.24)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
            >
              Let&rsquo;s meet
            </Link>
            <Link
              href="/services"
              className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-steel transition-colors duration-(--duration-fast) hover:text-paper"
            >
              Our services
            </Link>
            <Link
              href="/solutions"
              className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-steel transition-colors duration-(--duration-fast) hover:text-paper"
            >
              Our solutions
            </Link>
          </div>
        </div>

        {/* the evidence — four facts under the first descendant hairline */}
        <div className="hero-evidence mt-auto grid grid-cols-2 border-t border-navy/12 pt-0 sm:grid-cols-4">
          {evidence.map(([value, suffix, label]) => (
            <div
              key={label}
              className="border-navy/12 px-3 py-4 first:pl-0 odd:border-r sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0"
            >
              <p className="font-display text-(length:--text-step-1) leading-none text-paper">
                <Counter value={value} suffix={suffix} />
              </p>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.075em] text-steel sm:text-[10px]">
                {label}
              </p>
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
