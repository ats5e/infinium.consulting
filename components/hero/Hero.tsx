"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
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
        {/* restrained halo — the object reads dark, near-monochrome */}
        <div
          ref={glow}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[52%] h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "radial-gradient(ellipse 50% 45% at 50% 50%, rgba(115,168,251,0.10) 0%, rgba(54,94,238,0.05) 45%, transparent 70%)",
          }}
        />
        {/* the object: centred — the full-bleed backdrop the headline sits over */}
        <div
          ref={visual}
          className="absolute left-1/2 top-[54%] aspect-square w-[min(120vw,540px)] -translate-x-1/2 -translate-y-1/2 will-change-transform md:top-[52%] md:w-[min(58vw,780px)]"
        >
          {webgl ? (
            <GlassObject progress={progress} onContextLost={() => setWebgl(false)} />
          ) : (
            <LogoCrystal className="absolute inset-0 h-full w-full opacity-80 drop-shadow-[0_0_42px_rgba(115,168,251,0.32)]" />
          )}
          {/* the line of light the object becomes */}
          <div
            ref={beam}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-signal opacity-0 shadow-[0_0_24px_2px_var(--color-signal)]"
          />
        </div>
        {/* legibility scrim — centre-weighted wash, edges fall to black */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 95% 80% at 50% 46%, rgba(4,6,10,0.44) 0%, rgba(4,6,10,0.16) 48%, rgba(4,6,10,0.74) 100%)",
          }}
        />

        {/* content — one centred monolith over the graphic */}
        <div className="relative z-10 mx-auto flex w-full max-w-(--container-content) flex-1 flex-col px-(--spacing-gutter) pb-10 pt-24 md:pb-12">
          <div ref={copy} className="flex flex-1 flex-col items-center justify-center text-center">
            <h1 className="font-display text-[clamp(2.9rem,7vw,6.5rem)] font-extrabold leading-[0.95] tracking-[-0.045em] text-paper [text-shadow:0_2px_50px_rgba(4,6,10,0.85)]">
              <span className="block">
                <span className="hero-word inline-block will-change-transform">Engineering with{" "}</span>
              </span>
              <span className="block">
                <span className="hero-word inline-block will-change-transform">
                  <span className="text-signal">context.</span>
                </span>
              </span>
            </h1>
            <p className="hero-sub mx-auto mt-8 max-w-3xl leading-relaxed text-ice">
              We help the world&rsquo;s leading financial services firms
              transform their businesses through industry expertise, AI and
              automation. With a management team that has operated in financial
              markets for more than 30 years, across most of the world&rsquo;s
              financial centres, we bring a unique combination of deep industry
              knowledge and complex engineering, offering best in class
              technology and consulting solutions to accelerate our clients
              businesses.
            </p>
            <div className="hero-actions mt-10 flex items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  const el = section.current;
                  if (!el) return;
                  const top = el.getBoundingClientRect().bottom + window.scrollY;
                  // route through Lenis when it owns the scroll; native otherwise
                  if (window.__lenis) window.__lenis.scrollTo(top, { duration: 1.2 });
                  else window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
                }}
                className="btn-sheen inline-flex min-h-11 cursor-pointer items-center bg-cobalt px-7 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-paper transition-colors duration-(--duration-fast) ease-(--ease-out-expo) hover:bg-signal hover:text-void"
              >
                Learn more
              </button>
            </div>
            {/* scroll cue, Palantir-style */}
            <div aria-hidden className="hero-cue mt-14 hidden text-ice/70 md:block">
              <svg width="14" height="22" viewBox="0 0 14 22" fill="none" className="motion-safe:animate-bounce [animation-duration:2.2s]">
                <path d="M7 1v18m0 0 5.5-5.5M7 19l-5.5-5.5" stroke="currentColor" strokeWidth="1.25" />
              </svg>
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
