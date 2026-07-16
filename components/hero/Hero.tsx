"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteImage } from "@/lib/images";
import { Counter } from "@/components/motion/Counter";
import { LogoCrystal } from "./LogoCrystal";

const GlassObject = dynamic(() => import("./GlassObject"), { ssr: false });

// layout effect on the client (runs before paint → no reveal flash),
// plain effect on the server (no SSR warning)
const useIsoLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

/*
 * The signature moment — a split composition: the headline staircase
 * owns the left, the tumbling glass cluster owns the right and bleeds
 * off the viewport edge (never cropped mid-frame), and the wireframe's
 * four stats run along the foot. The entrance is visibility-gated so it
 * always plays in view: characters cascade out of their line masks, the
 * object arrives from the right, copy/actions/stats follow. Once settled,
 * the composition remains stable and scrolls away with the page. WebGL
 * needs >=1024px + fine pointer + no reduced-motion; context loss falls
 * back to SVG.
 */
export function Hero({ staticImage: _staticImage }: { staticImage: SiteImage }) {
  void _staticImage;
  const section = useRef<HTMLElement>(null);
  const [webgl, setWebgl] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const glq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => {
      setReduced(rmq.matches);
      setWebgl(!rmq.matches && glq.matches);
    };
    update();
    rmq.addEventListener("change", update);
    glq.addEventListener("change", update);
    return () => {
      rmq.removeEventListener("change", update);
      glq.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const el = section.current;
    if (!el) return;

    const onVisibility = () => setPageVisible(!document.hidden);
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { rootMargin: "160px 0px" },
    );

    observer.observe(el);
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Signature entrance — visibility-gated (plays when the hero is in
  // view, so it is never missed on a scrolled or slow load) and once.
  useIsoLayoutEffect(() => {
    if (reduced || !section.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        scrollTrigger: { trigger: section.current, start: "top 85%", once: true },
      });
      // Reveal complete lines rather than animating every character. This
      // preserves the signature entrance without delaying comprehension.
      tl.from(
        ".hero-line",
        { yPercent: 110, duration: 0.72, stagger: 0.08, clearProps: "transform" },
        0.02,
      )
        .from(
          ".hero-visual-inner",
          { autoAlpha: 0, x: 52, scale: 0.96, duration: 0.95, ease: "power3.out", clearProps: "transform,opacity,visibility" },
          0.12,
        )
        .from(".hero-sub", { y: 18, opacity: 0, duration: 0.55, clearProps: "transform,opacity" }, 0.42)
        .from(".hero-actions > *", { y: 12, opacity: 0, duration: 0.42, stagger: 0.05, clearProps: "transform,opacity" }, 0.54)
        .from(".hero-stats > *", { y: 12, opacity: 0, duration: 0.42, stagger: 0.04, clearProps: "transform,opacity" }, 0.64);
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={section} className="relative min-h-svh" aria-label="Introduction">
      <div className="relative flex min-h-svh flex-col overflow-hidden">
        {/* halo behind the object's zone */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-10%] top-1/2 h-[80%] w-[64%] -translate-y-1/2"
          style={{
            background:
              "radial-gradient(ellipse 50% 45% at 55% 50%, rgba(115,168,251,0.2) 0%, rgba(35,79,189,0.08) 45%, transparent 70%)",
          }}
        />
        {/* the object: full-height zone anchored to the right viewport
            edge — anything that leaves frame leaves at the screen edge */}
        <div className="absolute inset-y-0 right-0 w-full md:left-auto md:w-[56vw]">
          <div className="hero-visual-inner absolute inset-0">
            {webgl && heroVisible && pageVisible ? (
              <GlassObject onContextLost={() => setWebgl(false)} />
            ) : (
              <LogoCrystal className="absolute left-[96%] top-[49%] h-[40%] w-auto -translate-x-1/2 -translate-y-1/2 opacity-20 drop-shadow-[0_18px_34px_rgba(23,56,102,0.14)] sm:left-[80%] sm:top-[42%] sm:h-[50%] sm:opacity-30 lg:left-1/2 lg:top-1/2 lg:h-[68%] lg:opacity-90" />
            )}
          </div>
        </div>
        {/* legibility scrim — type zone falls to void on the left */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-void via-void/62 to-transparent md:via-void/38" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void/85 to-transparent" />

        {/* content — the staircase headline owns the left */}
        <div className="relative z-10 mx-auto flex w-full max-w-(--container-content) flex-1 flex-col px-(--spacing-gutter) pb-8 pt-24 md:pb-10">
          <div className="flex flex-1 flex-col justify-center">
            <h1 className="font-hero text-[clamp(2.9rem,8vw,8.1rem)] font-bold uppercase leading-[0.93] tracking-[-0.01em] text-paper [text-shadow:0_10px_34px_rgba(23,56,102,0.09)]">
              <span className="block overflow-hidden">
                <span className="hero-line block">Engineering</span>
              </span>{" "}
              <span className="block overflow-hidden">
                <span className="hero-line block">
                  with <span className="hero-rotator text-cobalt">context.</span>
                </span>
              </span>
            </h1>
            <p className="hero-sub mt-8 max-w-xl leading-relaxed text-ice">
              We help the world&rsquo;s leading financial services firms
              transform their businesses through industry expertise, AI and
              automation. With a management team that has operated in financial
              markets for more than 30 years, across most of the world&rsquo;s
              financial centres, we bring a unique combination of deep industry
              knowledge and complex engineering, offering best in class
              technology and consulting solutions to accelerate our clients
              businesses.
            </p>
            <div className="hero-actions mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="btn-sheen inline-flex min-h-11 cursor-pointer items-center bg-cobalt px-7 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-white shadow-[0_8px_24px_rgba(35,79,189,0.18)] transition-[background-color,box-shadow] duration-(--duration-fast) ease-(--ease-out-expo) hover:bg-navy hover:shadow-[0_10px_28px_rgba(23,56,102,0.24)]"
              >
                Let&rsquo;s meet
              </Link>
              {[
                ["Our services", "/services"],
                ["Our solutions", "/solutions"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="inline-flex min-h-11 items-center border border-navy/18 bg-white/68 px-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-paper shadow-[0_4px_14px_rgba(23,56,102,0.05)] backdrop-blur-sm transition-[border-color,background-color,box-shadow] duration-(--duration-fast) hover:border-signal/45 hover:bg-white hover:shadow-[0_8px_22px_rgba(23,56,102,0.1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                >
                  {label}
                </Link>
              ))}
              {/* scroll cue rides beside the CTA */}
              <span aria-hidden className="hero-cue hidden text-ice/70 md:block">
                <svg width="13" height="20" viewBox="0 0 14 22" fill="none">
                  <path d="M7 1v18m0 0 5.5-5.5M7 19l-5.5-5.5" stroke="currentColor" strokeWidth="1.25" />
                </svg>
              </span>
            </div>
          </div>

          {/* stats bar along the hero's foot */}
          <div className="hero-stats mt-10 grid grid-cols-2 gap-px sm:grid-cols-4">
            {([
              [22, "", "Leading global FS clients"],
              [100, "+", "Projects completed"],
              [30, "", "Fintech solution technologies"],
              [2, "", "Global offices"],
            ] as const).map(([value, suffix, label]) => (
              <div key={label} className="border hairline bg-white/72 p-4 shadow-[0_8px_24px_rgba(23,56,102,0.05)] backdrop-blur-sm">
                <p className="font-display text-(length:--text-step-1) text-paper">
                  <Counter value={value} suffix={suffix} />
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-steel">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* first divider of the page */}
      <div aria-hidden className="load-hairline absolute inset-x-0 bottom-0 h-px bg-ice/12" />
    </section>
  );
}
