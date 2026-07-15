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
 * The signature moment, full-bleed: the tumbling glass cluster is the
 * hero's backdrop layer, copy sits lower-left over a readability scrim,
 * and the wireframe's four stats run along the foot. Scrolling compresses
 * the cluster to a line of light that lands as the first hairline.
 * WebGL needs >=768px + fine pointer + no reduced-motion; context loss
 * falls back to the SVG mark.
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

  // Signature entrance — plays on every load, not gated by the session
  // flag. Words rise and sharpen from blur; copy, actions and stats follow.
  useIsoLayoutEffect(() => {
    if (reduced || !section.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      // clearProps strips GSAP's inline styles on completion, so the
      // resting headline is pure CSS — no lingering filter/transform layer
      tl.from(".hero-word", {
        yPercent: 118,
        opacity: 0,
        filter: "blur(16px)",
        duration: 1.1,
        stagger: 0.14,
        delay: 0.12,
        clearProps: "filter,opacity,transform,willChange",
      })
        .from(".hero-sub", { y: 22, opacity: 0, duration: 0.8, clearProps: "transform,opacity" }, 0.55)
        .from(".hero-actions > *", { y: 16, opacity: 0, duration: 0.6, stagger: 0.08, clearProps: "transform,opacity" }, 0.7)
        .from(".hero-stats > *", { y: 18, opacity: 0, duration: 0.6, stagger: 0.06, clearProps: "transform,opacity" }, 0.82);
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={section} className="relative min-h-svh md:h-[128svh]" aria-label="Introduction">
      <div className="relative flex min-h-svh flex-col overflow-hidden md:sticky md:top-0 md:h-svh">
        {/* the light field the glass refracts against */}
        <div
          ref={glow}
          aria-hidden
          className="pointer-events-none absolute right-[-8%] top-[52%] h-[80%] w-[60%] -translate-y-1/2 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 55% 50% at 55% 48%, rgba(115,168,251,0.26) 0%, rgba(54,94,238,0.11) 42%, transparent 70%)",
          }}
        />
        {/* the cluster: bounded to the right, clear of the nav */}
        <div
          ref={visual}
          className="absolute right-[-18%] top-[46%] aspect-square w-[88%] max-w-[560px] -translate-y-1/2 will-change-transform md:right-[1%] md:top-[52%] md:w-[42%] md:max-w-[620px]"
        >
          {webgl ? (
            <GlassObject progress={progress} onContextLost={() => setWebgl(false)} />
          ) : (
            <LogoCrystal className="absolute inset-0 h-full w-full opacity-90 drop-shadow-[0_0_42px_rgba(115,168,251,0.46)]" />
          )}
          {/* the line of light the cluster becomes */}
          <div
            ref={beam}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-signal opacity-0 shadow-[0_0_24px_2px_var(--color-signal)]"
          />
        </div>
        {/* readability scrim — copy owns the left */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-void via-void/55 to-transparent" />

        {/* content, lower-left */}
        <div className="relative z-10 mx-auto flex w-full max-w-(--container-content) flex-1 flex-col justify-end px-(--spacing-gutter) pb-10 pt-32 md:pb-12">
          <div ref={copy} className="max-w-3xl">
            <h1 className="font-display text-[clamp(3.25rem,8vw,7.5rem)] font-extrabold leading-[0.9] tracking-[-0.045em] -ml-[0.05em] text-paper [text-shadow:0_2px_60px_rgba(115,168,251,0.18)]">
              <span className="block leading-[0.9]">
                <span className="hero-word inline-block will-change-transform">Engineering{" "}</span>
              </span>
              <span className="block leading-[0.9]">
                <span className="hero-word inline-block will-change-transform">
                  with <span className="text-signal">context.</span>
                </span>
              </span>
            </h1>
            <p className="hero-sub mt-8 max-w-2xl leading-relaxed text-ice">
              We help the world&rsquo;s leading financial services firms
              transform their businesses through industry expertise, AI and
              automation. With a management team that has operated in financial
              markets for more than 30 years, across most of the world&rsquo;s
              financial centres, we bring a unique combination of deep industry
              knowledge and complex engineering, offering best in class
              technology and consulting solutions to accelerate our clients
              businesses.
            </p>
            <div className="hero-actions mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href="/contact"
                className="btn-sheen inline-flex min-h-11 items-center bg-cobalt px-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-paper transition-colors duration-(--duration-fast) ease-(--ease-out-expo) hover:bg-signal hover:text-void"
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
          </div>

          {/* stats bar along the hero's foot */}
          <div className="hero-stats mt-12 grid grid-cols-2 gap-px sm:grid-cols-4">
            {([
              [22, "", "Leading global FS clients"],
              [100, "+", "Projects completed"],
              [30, "", "Fintech solution technologies"],
              [2, "", "Global offices"],
            ] as const).map(([value, suffix, label]) => (
              <div key={label} className="spot border hairline bg-abyss/35 p-4 backdrop-blur-sm">
                <p className="font-display text-(length:--text-step-1) text-paper">
                  <Counter value={value} suffix={suffix} />
                </p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-steel">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* the hairline the beam lands on — first divider of the page */}
      <div aria-hidden className="load-hairline absolute inset-x-0 bottom-0 h-px bg-ice/12" />
    </section>
  );
}
