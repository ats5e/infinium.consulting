"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteImage } from "@/lib/images";

export type Differentiator = {
  n: string;
  title: string;
  body: string;
  image: SiteImage;
  alt: string;
};

/*
 * The .1/.2/.3 argument — the one numbered sequence on the site. Each item
 * is a framed panel: the generated image sits inside the box BEHIND the
 * text, dimmed by a left-to-right scrim so the copy carries. Desktop with
 * a fine pointer pins the panel and scroll advances the three; everything
 * else gets the same panels stacked. Unpins cleanly (CSS sticky, no
 * transform pinning).
 */

function Panel({
  d,
  active = true,
  layered = false,
}: {
  d: Differentiator;
  active?: boolean;
  layered?: boolean;
}) {
  return (
    <article
      className={
        layered
          ? "absolute inset-0 transition-[clip-path] duration-(--duration-slow) ease-(--ease-out-expo)"
          : "relative overflow-hidden border hairline"
      }
      style={layered ? { clipPath: active ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" } : undefined}
      aria-hidden={layered ? !active : undefined}
    >
      {/* the image, boxed behind the text */}
      <picture aria-hidden className="absolute inset-0">
        <source
          type="image/avif"
          srcSet={`${d.image.avifHalf} ${Math.round(d.image.width / 2)}w`}
        />
        <img
          src={d.image.webpHalf}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={{ backgroundImage: `url(${d.image.lqip})`, backgroundSize: "cover" }}
        />
      </picture>
      {/* scrim — copy owns the left, the image breathes on the right */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-void/97 via-void/82 to-void/30"
      />
      <div aria-hidden className="absolute inset-0 bg-void/25" />

      <div className="relative flex min-h-[26rem] max-w-2xl flex-col justify-end p-8 md:min-h-[30rem] md:p-14">
        <p className="font-mono text-(length:--text-label) tracking-[0.08em] text-signal">{d.n}</p>
        <h3 className="mt-4 text-(length:--text-step-3) leading-[1.05]">{d.title}</h3>
        <p className="mt-5 leading-relaxed text-glass">{d.body}</p>
      </div>
    </article>
  );
}

export function Differentiators({ items }: { items: Differentiator[] }) {
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!pinned || !section.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        setActive(Math.min(items.length - 1, Math.floor(self.progress * items.length)));
      },
    });
    return () => st.kill();
  }, [pinned, items.length]);

  if (!pinned) {
    return (
      <section className="border-t hairline">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-16">
          <p className="eyebrow">a few things we’re great at</p>
          <div className="mt-10 grid gap-6">
            {items.map((d) => (
              <Panel key={d.n} d={d} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={section} className="relative h-[300vh] border-t hairline">
      <div className="sticky top-0 flex h-svh items-center">
        <div className="mx-auto w-full max-w-(--container-content) px-(--spacing-gutter)">
          <div className="flex items-end justify-between gap-6">
            <p className="eyebrow">a few things we’re great at</p>
            {/* sequence indicator — the only numbering on the site */}
            <div className="flex gap-5" aria-hidden>
              {items.map((d, i) => (
                <span
                  key={d.n}
                  className={`font-mono text-(length:--text-label) tracking-[0.08em] transition-colors duration-(--duration-base) ${
                    active === i ? "text-signal" : "text-steel/50"
                  }`}
                >
                  {d.n}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mt-6 overflow-hidden border hairline">
            {/* sizing ghost keeps the frame's height; layers stack above it */}
            <div className="invisible" aria-hidden>
              <Panel d={items[0]} />
            </div>
            {items.map((d, i) => (
              <Panel key={d.n} d={d} layered active={i <= active} />
            ))}
            {/* progress hairline along the frame's foot */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-cobalt to-signal transition-transform duration-(--duration-base) ease-(--ease-out-expo)"
              style={{ transform: `scaleX(${(active + 1) / items.length})` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
