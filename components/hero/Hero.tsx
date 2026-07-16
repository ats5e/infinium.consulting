"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import type { SiteImage } from "@/lib/images";

const Afterlight = dynamic(() => import("./Afterlight"), { ssr: false });

const useIsoLayoutEffect =
  typeof document !== "undefined" ? useLayoutEffect : useEffect;

/*
 * AFTERLIGHT — first application.
 *
 * Paper. The light. A whisper. One statement. One action.
 *
 * The brand's mark is a glass object; the identity never shows the
 * glass — only what it does to light. The pool breathes on a twenty-
 * second period and leans toward the cursor; it is the only thing on
 * the page that never stops moving. Everything written arrives once,
 * settles, and holds. Cobalt appears exactly once: at the decision.
 */
export function Hero({ staticImage: _staticImage }: { staticImage: SiteImage }) {
  void _staticImage;
  const section = useRef<HTMLElement>(null);
  const [webgl, setWebgl] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(rmq.matches);
    update();
    rmq.addEventListener("change", update);
    return () => rmq.removeEventListener("change", update);
  }, []);

  useIsoLayoutEffect(() => {
    if (reduced || !section.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-voice > *", {
        y: 12,
        opacity: 0,
        duration: 0.9,
        stagger: 0.14,
        delay: 0.5,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });
    }, section);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={section}
      className="relative min-h-svh overflow-hidden bg-void"
      aria-label="Introduction"
    >
      {/* the light */}
      {webgl ? (
        <Afterlight reduced={reduced} onContextLost={() => setWebgl(false)} />
      ) : (
        /* stilled afterlight — the same pool, printed */
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 34% 30% at 66% 52%, #ffffff 0%, rgba(255,255,255,0.6) 38%, transparent 70%)," +
              "radial-gradient(ellipse 52% 46% at 64% 54%, #e5eefa 0%, rgba(229,238,250,0.5) 46%, transparent 74%)," +
              "radial-gradient(ellipse 70% 62% at 62% 55%, rgba(35,79,189,0.05) 0%, transparent 70%), #f7f9fc",
          }}
        />
      )}

      {/* the voice — at the edge; the centre belongs to the light */}
      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-(--container-content) items-center px-(--spacing-gutter)">
        <div className="hero-voice max-w-md pb-10">
          <h1 className="font-hero text-[clamp(1.55rem,2.3vw,2.15rem)] font-medium leading-[1.3] tracking-[-0.01em] text-paper">
            The engineers behind the engineers.
          </h1>
          <p className="mt-8">
            <Link
              href="/contact"
              className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.1em] text-cobalt transition-colors duration-(--duration-fast) hover:text-navy"
            >
              Meet us →
            </Link>
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className="load-hairline absolute inset-x-0 bottom-0 h-px bg-ice/12"
      />
    </section>
  );
}
