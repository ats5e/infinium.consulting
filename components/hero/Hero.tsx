"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteImage } from "@/lib/images";

const GlassObject = dynamic(() => import("./GlassObject"), { ssr: false });

/*
 * The signature moment: a 180svh section with a sticky viewport. Scrolling
 * through it compresses the glass object to a single vertical line of
 * light, which lands as the hairline divider that opens the next section.
 * WebGL mounts only ≥768px, fine pointer, no reduced-motion, and pauses
 * when the tab is hidden (frameloop handled by R3F on demand + visibility).
 */
export function Hero({ staticImage }: { staticImage: SiteImage }) {
  const section = useRef<HTMLElement>(null);
  const visual = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const beam = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [webgl, setWebgl] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(rm);
    setWebgl(!rm && window.matchMedia("(min-width: 768px) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (reduced || !section.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (st) => {
            progress.current = st.progress;
          },
        },
        defaults: { ease: "none" },
      });
      tl.to(copy.current, { opacity: 0, y: -32, duration: 0.3 }, 0)
        .to(glow.current, { opacity: 0, duration: 0.5 }, 0.15)
        .to(visual.current, { scaleX: 0.004, filter: "brightness(2.4)", duration: 0.62 }, 0.05)
        .fromTo(beam.current, { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.55)
        .to(visual.current, { opacity: 0, duration: 0.1 }, 0.67)
        .to(beam.current, { scaleY: 0.002, transformOrigin: "center bottom", duration: 0.3 }, 0.68);
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={section} className="relative min-h-svh md:h-[180svh]" aria-label="Introduction">
      <div className="flex min-h-svh items-center overflow-hidden pb-16 pt-28 md:sticky md:top-0 md:h-svh md:pb-0 md:pt-16">
        <div className="mx-auto grid w-full max-w-(--container-content) grid-cols-1 items-center gap-10 px-(--spacing-gutter) md:grid-cols-12">
          <div ref={copy} className="relative z-10 md:col-span-7">
            <p className="eyebrow load-copy">we build, not just advise</p>
            <h1 className="mt-6 text-(length:--text-hero) leading-[0.95] tracking-[-0.03em] -ml-[0.06em]">
              <span className="load-line block overflow-hidden">
                <span className="block">Data engineering.</span>
              </span>
              <span className="load-line block overflow-hidden">
                <span className="block">For tomorrow.</span>
              </span>
            </h1>
            <p className="load-copy mt-8 max-w-xl text-(length:--text-step-1) leading-normal text-ice">
              Proprietary platforms. Financial services only. Built inside the
              DIFC, delivered across MENA and Europe.
            </p>
            <div className="load-copy mt-10 flex items-center gap-8">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center bg-cobalt px-6 font-mono text-(length:--text-label) uppercase tracking-[0.14em] text-paper transition-colors duration-(--duration-fast) ease-(--ease-out-expo) hover:bg-signal hover:text-void"
              >
                Start a conversation
              </Link>
              <Link
                href="/services"
                className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.14em] text-steel transition-colors duration-(--duration-fast) hover:text-glass"
              >
                What we do
              </Link>
            </div>
          </div>

          <div className="load-hero relative md:col-span-5">
            {/* the light field the glass refracts against — without it the
                transmission material reads as black plastic */}
            <div
              ref={glow}
              aria-hidden
              className="pointer-events-none absolute inset-[-15%] opacity-70"
              style={{
                background:
                  "radial-gradient(ellipse 60% 55% at 52% 46%, rgba(115,168,251,0.28) 0%, rgba(54,94,238,0.12) 40%, transparent 70%)",
              }}
            />
            <div ref={visual} className="relative aspect-square w-full will-change-transform">
              {webgl ? (
                <GlassObject progress={progress} />
              ) : (
                <img
                  src={staticImage.webpHalf}
                  width={Math.round(staticImage.width / 2)}
                  height={Math.round(staticImage.height / 2)}
                  alt=""
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full object-cover object-[38%_center]"
                  style={{ backgroundImage: `url(${staticImage.lqip})`, backgroundSize: "cover" }}
                />
              )}
            </div>
            {/* the line of light the object becomes */}
            <div
              ref={beam}
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-signal opacity-0 shadow-[0_0_24px_2px_var(--color-signal)]"
            />
          </div>
        </div>
      </div>
      {/* the hairline the beam lands on — first divider of the page */}
      <div aria-hidden className="load-hairline absolute inset-x-0 bottom-0 h-px bg-ice/12" />
    </section>
  );
}
