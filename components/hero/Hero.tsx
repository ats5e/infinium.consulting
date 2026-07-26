"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import type { SiteImage } from "@/lib/images";
import AssemblyField from "./AssemblyField";

const useIsoLayoutEffect =
  typeof document !== "undefined" ? useLayoutEffect : useEffect;

/*
 * THE ASSEMBLY FIELD hero.
 *
 * A disciplined split: the copy column is pristine — stacked whisper,
 * one editorial sentence with a single cobalt word, a short measure,
 * two quiet actions — and all complexity is quarantined inside the
 * field on the right: a granular cloud of raw events drawn leftward
 * through a run of glass sorting planes until each voxel slots into
 * the solid 4×4×4 mark.
 */

export function Hero({ staticImage: _staticImage }: { staticImage: SiteImage }) {
  void _staticImage;
  const section = useRef<HTMLElement>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // automated agents get one rich, measurable frame
    const update = () => setStill(rmq.matches || navigator.webdriver === true);
    update();
    rmq.addEventListener("change", update);
    return () => rmq.removeEventListener("change", update);
  }, []);

  useIsoLayoutEffect(() => {
    if (still || !section.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".hero-line", { yPercent: 110, duration: 0.9, stagger: 0.1, clearProps: "transform" }, 0.08)
        .from(".hero-field-wrap", { opacity: 0, x: 36, duration: 1.4, ease: "power3.out", clearProps: "transform,opacity" }, 0.3)
        .from(".hero-body", { y: 14, opacity: 0, duration: 0.6, clearProps: "transform,opacity" }, 0.55)
        .from(".hero-actions > *", { y: 10, opacity: 0, duration: 0.5, stagger: 0.08, clearProps: "transform,opacity" }, 0.7)
        .from(".hero-rail > *", { opacity: 0, duration: 0.6, stagger: 0.1, clearProps: "opacity" }, 0.9);
    }, section);
    return () => ctx.revert();
  }, [still]);

  return (
    <section
      ref={section}
      data-testid="home-hero"
      className="relative overflow-hidden bg-void md:min-h-[clamp(38rem,82svh,44rem)]"
      aria-label="Introduction"
    >
      {/* legibility wash: the copy column stays pristine over the
          field's left tail */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 hidden h-[52%] w-[56%] bg-gradient-to-r from-void via-void/92 to-transparent md:block"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-(--container-content) flex-col px-(--spacing-gutter) pb-7 pt-24 md:min-h-[clamp(38rem,82svh,44rem)] md:pt-28">
        <div data-testid="hero-copy-column" className="flex w-full max-w-2xl flex-col items-start pt-6 text-left md:pt-6">
          <h1 className="w-full font-hero text-[clamp(2.5rem,4.6vw,4.2rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-paper">
            <span className="block w-full overflow-hidden pb-[0.06em] -mb-[0.06em]">
              <span className="hero-line block">From complex systems</span>
            </span>{" "}
            <span className="block w-full overflow-hidden pb-[0.06em] -mb-[0.06em]">
              <span className="hero-line block">
                to <span className="text-cobalt">confident decisions.</span>
              </span>
            </span>
          </h1>

          <p className="hero-body mt-6 w-full max-w-xl text-[clamp(0.98rem,1.25vw,1.12rem)] leading-[1.6] text-ice">
            We help banks, insurers and asset managers turn siloed and messy data
            into intelligent, scalable assets, built on deep financial services
            context and engineered with AI &amp; automation.
          </p>

          <div className="hero-actions mt-9 flex w-full flex-wrap items-center justify-start gap-x-8 gap-y-4">
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

        {/* the rail */}
        <div className="hero-rail mt-auto hidden items-end gap-6 pt-8 md:flex">
          <div className="flex items-center gap-3">
            <span aria-hidden className="block h-5 w-px bg-navy/30" />
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-steel">
              Scroll to explore
            </span>
          </div>
        </div>
      </div>

      {/* the field — owns the right, bleeds to the viewport edge */}
      <div className="hero-field-wrap pointer-events-none relative -mr-[18%] -mt-6 h-[38svh] min-h-64 max-h-80 w-[118%] pb-2 md:pointer-events-auto md:absolute md:inset-y-0 md:left-[47%] md:right-0 md:mr-0 md:mt-0 md:h-auto md:min-h-0 md:max-h-none md:w-auto md:pb-0">
        {/* the canvas stops short of the section edge, so the field always
            has clear air beneath it before the next band */}
        <div data-testid="hero-graphic" className="absolute inset-x-0 bottom-[9%] top-0 md:bottom-[7%] md:top-[12%]">
          <AssemblyField still={still} />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[16%] bg-gradient-to-b from-transparent to-void" />
      </div>


      <div
        aria-hidden
        className="load-hairline absolute inset-x-0 bottom-0 h-px bg-ice/12"
      />
    </section>
  );
}
