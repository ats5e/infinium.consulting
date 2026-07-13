"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteImage } from "@/lib/images";
import { Counter } from "@/components/motion/Counter";
import { LogoCrystal } from "./LogoCrystal";

const GlassObject = dynamic(() => import("./GlassObject"), { ssr: false });

/*
 * The signature moment: a 180svh section with a sticky viewport. Scrolling
 * through it compresses the glass object to a single vertical line of
 * light, which lands as the hairline divider that opens the next section.
 * WebGL mounts only ≥768px, fine pointer, no reduced-motion, and pauses
 * when the tab is hidden (frameloop handled by R3F on demand + visibility).
 */
export function Hero({ staticImage: _staticImage }: { staticImage: SiteImage }) {
  void _staticImage;
  const section = useRef<HTMLElement>(null);
  const visual = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const beam = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [webgl, setWebgl] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const glq = window.matchMedia("(min-width: 768px) and (pointer: fine)");
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
      tl.to(copy.current, { opacity: 0.2, y: -24, duration: 0.46 }, 0.22)
        .to(glow.current, { opacity: 0.16, duration: 0.5 }, 0.34)
        .to(visual.current, { scaleX: 0.004, filter: "brightness(2.4)", duration: 0.46 }, 0.42)
        .fromTo(beam.current, { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.78)
        .to(visual.current, { opacity: 0, duration: 0.08 }, 0.88)
        .to(beam.current, { scaleY: 0.002, transformOrigin: "center bottom", duration: 0.12 }, 0.9);
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={section} className="relative min-h-svh md:h-[128svh]" aria-label="Introduction">
      <div className="flex min-h-svh items-center overflow-hidden pb-16 pt-36 md:sticky md:top-0 md:h-svh md:pb-0 md:pt-28">
        <div className="mx-auto grid w-full max-w-(--container-content) grid-cols-1 items-center gap-10 px-(--spacing-gutter) md:grid-cols-12">
          <div ref={copy} className="relative z-10 md:col-span-7">
            <p className="eyebrow load-copy">Banking &amp; financial services consultancy</p>
            <h1 className="mt-6 text-(length:--text-hero) leading-[0.95] tracking-[-0.03em] -ml-[0.06em]">
              <span className="load-line block">
                <span className="block">Engineering{" "}</span>
              </span>
              <span className="load-line block">
                <span className="block">with context.</span>
              </span>
            </h1>
            <p className="load-copy mt-8 max-w-2xl leading-relaxed text-ice">
              We help the world&rsquo;s leading financial services firms
              transform their businesses through industry expertise, AI and
              automation. With a management team that has operated in financial
              markets for more than 30 years, across most of the world&rsquo;s
              financial centres, we bring a unique combination of deep industry
              knowledge and complex engineering, offering best in class
              technology and consulting solutions to accelerate our clients
              businesses.
            </p>
            <div className="load-copy mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center bg-cobalt px-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-paper transition-colors duration-(--duration-fast) ease-(--ease-out-expo) hover:bg-signal hover:text-void"
              >
                Let&rsquo;s meet
              </Link>
              <Link
                href="/services"
                className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-steel transition-colors duration-(--duration-fast) hover:text-glass"
              >
                Our services
              </Link>
              <Link
                href="/solutions"
                className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-steel transition-colors duration-(--duration-fast) hover:text-glass"
              >
                Our solutions
              </Link>
            </div>
            <div className="load-copy mt-12 grid max-w-2xl grid-cols-2 gap-px sm:grid-cols-4">
              {([
                [22, "", "Leading global FS clients"],
                [100, "+", "Projects completed"],
                [30, "", "Fintech solution technologies"],
                [2, "", "Global offices"],
              ] as const).map(([value, suffix, label]) => (
                <div key={label} className="border hairline bg-abyss/35 p-4 backdrop-blur-sm">
                  <p className="font-display text-(length:--text-step-1) text-paper">
                    <Counter value={value} suffix={suffix} />
                  </p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-steel">{label}</p>
                </div>
              ))}
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
                <LogoCrystal className="absolute inset-0 h-full w-full drop-shadow-[0_0_42px_rgba(115,168,251,0.46)]" />
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
