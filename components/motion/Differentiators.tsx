"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GlassImage } from "@/components/GlassImage";
import type { SiteImage } from "@/lib/images";

export type Differentiator = {
  n: string;
  title: string;
  body: string;
  image: SiteImage;
  alt: string;
};

/*
 * The .1/.2/.3 argument — the one numbered sequence on the site. Desktop
 * with fine pointer: the section pins for 300vh and scroll advances the
 * three, swapping the graphic with a clip-path reveal. Mobile, touch and
 * reduced-motion get the static stacked layout. Unpins cleanly because the
 * pin is CSS sticky, not a transform.
 */
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
      <section ref={section} className="border-t hairline">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-20">
          <p className="eyebrow">a few things we’re great at</p>
          <div className="mt-12 space-y-16">
            {items.map((d) => (
              <article key={d.n} className="space-y-5">
                <p className="font-mono text-(length:--text-label) tracking-[0.14em] text-signal">{d.n}</p>
                <h3 className="text-(length:--text-step-3)">{d.title}</h3>
                <p className="max-w-xl text-ice">{d.body}</p>
                <GlassImage image={d.image} alt={d.alt} sizes="(min-width: 768px) 60vw, 100vw" />
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={section} className="relative h-[300vh] border-t hairline">
      <div className="sticky top-0 flex h-svh items-center">
        <div className="mx-auto grid w-full max-w-(--container-content) grid-cols-12 items-center gap-10 px-(--spacing-gutter)">
          <div className="col-span-6">
            <p className="eyebrow">a few things we’re great at</p>
            <div className="mt-10 space-y-10">
              {items.map((d, i) => (
                /* inactive items dim via colour, not opacity — steel keeps
                   WCAG contrast where a 0.28 alpha would fail axe */
                <article key={d.n}>
                  <p
                    className={`font-mono text-(length:--text-label) tracking-[0.14em] transition-colors duration-(--duration-base) ease-(--ease-out-expo) ${
                      active === i ? "text-signal" : "text-steel"
                    }`}
                  >
                    {d.n}
                  </p>
                  <h3
                    className={`mt-3 text-(length:--text-step-3) transition-colors duration-(--duration-base) ease-(--ease-out-expo) ${
                      active === i ? "text-paper" : "text-steel"
                    }`}
                  >
                    {d.title}
                  </h3>
                  <div
                    className="grid transition-[grid-template-rows] duration-(--duration-slow) ease-(--ease-out-expo)"
                    style={{ gridTemplateRows: active === i ? "1fr" : "0fr" }}
                  >
                    <p className="max-w-xl overflow-hidden text-ice">{active === i ? d.body : d.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="relative col-span-6 aspect-[16/9] overflow-hidden border hairline">
            {items.map((d, i) => (
              <div
                key={d.n}
                className="absolute inset-0 transition-[clip-path] duration-(--duration-slow) ease-(--ease-out-expo)"
                style={{
                  clipPath: i <= active ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
                  zIndex: i,
                }}
              >
                <GlassImage image={d.image} alt={d.alt} sizes="45vw" className="absolute inset-0 [&>img]:h-full [&>img]:object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
