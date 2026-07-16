"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteImage } from "@/lib/images";
import { Counter } from "@/components/motion/Counter";
import { LogoCrystal } from "./LogoCrystal";

const GlassObject = dynamic(() => import("./GlassObject"), { ssr: false });

/* one span per character so the entrance can cascade — whiteSpace: pre
 * keeps the word spaces alive inside the inline-blocks */
function Chars({ text }: { text: string }) {
  return (
    <>
      {[...text].map((c, i) => (
        <span key={i} className="hero-char inline-block will-change-transform" style={{ whiteSpace: "pre" }}>
          {c}
        </span>
      ))}
    </>
  );
}

/* the rotating word — "context." is the brand line and stays the anchor:
 * it is the resting state, the reduced-motion state and the accessible
 * text; the alternates flick through behind it. Widths are converted to
 * em after the display font loads so the mask scales with the clamp. */
const ROTATE = ["context.", "precision.", "intelligence.", "discipline.", "insight."];

function RotatingWord({ reduced }: { reduced: boolean }) {
  const wrap = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = wrap.current;
    if (reduced || !el) return;
    let ctx: gsap.Context | undefined;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const words = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
        const fontSize = parseFloat(getComputedStyle(el).fontSize);
        const widths = words.map((w) => w.offsetWidth / fontSize); // em
        gsap.set(el, { width: `${widths[0]}em` });
        // word 0's transform belongs to the entrance roll-in — only pin alpha
        gsap.set(words[0], { autoAlpha: 1 });
        gsap.set(words.slice(1), { yPercent: 108, autoAlpha: 0 });
        // one transition per word, 2.4s dwell between and before repeating
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.4, delay: 4, defaults: { ease: "power3.inOut" } });
        words.forEach((_, i) => {
          const next = (i + 1) % words.length;
          tl.to(el, { width: `${widths[next]}em`, duration: 0.45 }, i === 0 ? 0 : "+=2.4")
            .to(words[i], { yPercent: -108, autoAlpha: 0, duration: 0.5 }, "<")
            .fromTo(
              words[next],
              { yPercent: 108, autoAlpha: 1 },
              { yPercent: 0, duration: 0.5, immediateRender: false },
              "<0.06",
            );
        });
      }, el);
    });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [reduced]);

  return (
    <>
      <span className="sr-only">context.</span>
      <span
        ref={wrap}
        aria-hidden
        className="hero-rotator relative inline-block overflow-hidden align-bottom text-cobalt"
      >
        {ROTATE.map((w, i) => (
          <span
            key={w}
            data-word={i}
            className={`whitespace-nowrap will-change-transform ${
              i === 0 ? "inline-block" : "absolute left-0 top-0 inline-block opacity-0"
            }`}
          >
            {w}
          </span>
        ))}
      </span>
    </>
  );
}

// layout effect on the client (runs before paint → no reveal flash),
// plain effect on the server (no SSR warning)
const useIsoLayoutEffect = typeof document !== "undefined" ? useLayoutEffect : useEffect;

/*
 * The signature moment — a split composition: the headline staircase
 * owns the left, the tumbling glass cluster owns the right and bleeds
 * off the viewport edge (never cropped mid-frame), and the wireframe's
 * four stats run along the foot. The entrance is visibility-gated so it
 * always plays in view: characters cascade out of their line masks, the
 * object arrives from the right, copy/actions/stats follow. Scrolling
 * drifts the title lines apart, then compresses the cluster to a line
 * of light that lands as the first hairline. WebGL needs >=768px +
 * fine pointer + no reduced-motion; context loss falls back to SVG.
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
      // the title lines drift apart as the page starts to move
      tl.to(".hero-line-a", { xPercent: -3.5, duration: 0.5 }, 0.02)
        .to(".hero-line-b", { xPercent: 2.5, duration: 0.5 }, 0.02)
        .to(copy.current, { opacity: 0.15, y: -28, duration: 0.46 }, 0.22)
        .to(glow.current, { opacity: 0.16, duration: 0.5 }, 0.34)
        .to(visual.current, { scaleX: 0.004, filter: "brightness(2.4)", duration: 0.46 }, 0.42)
        .fromTo(beam.current, { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.78)
        .to(visual.current, { opacity: 0, duration: 0.08 }, 0.88)
        .to(beam.current, { scaleY: 0.002, transformOrigin: "center bottom", duration: 0.12 }, 0.9);
    }, section);
    return () => ctx.revert();
  }, [reduced]);

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
      // clearProps strips GSAP's inline styles on completion, so the
      // resting hero is pure CSS — no lingering transform layers
      tl.from(
        ".hero-char",
        { yPercent: 120, duration: 1.05, stagger: 0.03, clearProps: "transform,willChange" },
        0.05,
      )
        // the rotating word rolls in with its line (it isn't a .hero-char)
        .from(
          ".hero-rotator [data-word='0']",
          { yPercent: 120, duration: 1.0, clearProps: "transform" },
          0.5,
        )
        .from(
          ".hero-visual-inner",
          { autoAlpha: 0, x: 70, scale: 0.94, duration: 1.5, ease: "power3.out", clearProps: "transform,opacity,visibility" },
          0.25,
        )
        .from(".hero-sub", { y: 24, opacity: 0, duration: 0.8, clearProps: "transform,opacity" }, 0.8)
        .from(".hero-actions > *", { y: 16, opacity: 0, duration: 0.6, stagger: 0.08, clearProps: "transform,opacity" }, 0.95)
        .from(".hero-stats > *", { y: 18, opacity: 0, duration: 0.6, stagger: 0.06, clearProps: "transform,opacity" }, 1.1);
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={section} className="relative min-h-svh md:h-[128svh]" aria-label="Introduction">
      <div className="relative flex min-h-svh flex-col overflow-hidden md:sticky md:top-0 md:h-svh">
        {/* halo behind the object's zone */}
        <div
          ref={glow}
          aria-hidden
          className="pointer-events-none absolute right-[-10%] top-1/2 h-[80%] w-[64%] -translate-y-1/2"
          style={{
            background:
              "radial-gradient(ellipse 50% 45% at 55% 50%, rgba(115,168,251,0.13) 0%, rgba(54,94,238,0.06) 45%, transparent 70%)",
          }}
        />
        {/* the object: full-height zone anchored to the right viewport
            edge — anything that leaves frame leaves at the screen edge */}
        <div ref={visual} className="absolute inset-y-0 right-0 w-full will-change-transform md:left-auto md:w-[56vw]">
          <div className="hero-visual-inner absolute inset-0">
            {webgl ? (
              <GlassObject progress={progress} onContextLost={() => setWebgl(false)} />
            ) : (
              <LogoCrystal className="absolute left-1/2 top-1/2 h-[68%] w-auto -translate-x-1/2 -translate-y-1/2 opacity-75 drop-shadow-[0_0_42px_rgba(115,168,251,0.32)]" />
            )}
          </div>
          {/* the line of light the object becomes */}
          <div
            ref={beam}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-full w-px bg-signal opacity-0 shadow-[0_0_24px_2px_var(--color-signal)]"
          />
        </div>
        {/* legibility scrim — type zone falls to void on the left */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-void via-void/62 to-transparent md:via-void/38" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void/85 to-transparent" />

        {/* content — the staircase headline owns the left */}
        <div className="relative z-10 mx-auto flex w-full max-w-(--container-content) flex-1 flex-col px-(--spacing-gutter) pb-8 pt-24 md:pb-10">
          <div ref={copy} className="flex flex-1 flex-col justify-center">
            <h1 className="font-hero text-[clamp(2.9rem,8vw,8.1rem)] font-bold uppercase leading-[0.93] tracking-[-0.01em] text-paper [text-shadow:0_2px_50px_rgba(4,6,10,0.85)]">
              {/* the trailing space keeps the accessible name one phrase:
                  "Engineering with context." — blocks alone don't add it */}
              <span className="hero-line-a block overflow-hidden">
                <Chars text="Engineering" />{" "}
              </span>
              <span className="hero-line-b block overflow-hidden md:ml-[6vw]">
                <Chars text="with " />
                <RotatingWord reduced={reduced} />
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
            <div className="hero-actions mt-10 flex items-center gap-6">
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
              {/* scroll cue rides beside the CTA */}
              <span aria-hidden className="hero-cue hidden text-ice/70 md:block">
                <svg width="13" height="20" viewBox="0 0 14 22" fill="none" className="motion-safe:animate-bounce [animation-duration:2.2s]">
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
