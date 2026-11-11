"use client";

import { useEffect, useRef, useState } from "react";

/*
 * The R&D band's motion graphic (concept B, "The stack", chosen by Jack,
 * 11 Nov 2026): four isometric layers drop into place bottom-up — systems
 * of record, QBricks, governed data products, AI & reporting — while the
 * matching label lights. Pure CSS keyframes (globals.css, .stack-*), on the
 * editorial curve; it only runs while on screen, and reduced motion shows
 * the finished stack, still.
 */
const LAYERS = [
  { label: "AI, analytics & reporting", tone: "stack-slab--glass" },
  { label: "Governed data products", tone: "stack-slab--bright" },
  { label: "QBricks: ingest, contract, govern", tone: "stack-slab--cobalt" },
  { label: "Systems of record", tone: "stack-slab--base" },
] as const;

export function StackMotion() {
  const ref = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setPlaying(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure
      ref={ref}
      data-playing={playing ? "" : undefined}
      className="stack-motion grid gap-10 rounded-2xl bg-white/[0.07] p-8 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:items-center md:p-10"
    >
      <figcaption className="sr-only">
        How QBricks works: systems of record feed QBricks, which ingests, contracts and governs the data into governed data products for AI, analytics and reporting.
      </figcaption>
      <ol className="flex flex-col gap-6 text-[15px] text-white" aria-hidden>
        {LAYERS.map((l, i) => (
          <li key={l.label} className="stack-label flex items-center gap-3" style={{ "--i": LAYERS.length - 1 - i } as React.CSSProperties}>
            <span className="stack-dot size-2 shrink-0 rounded-full" />
            {l.label}
          </li>
        ))}
      </ol>
      <div aria-hidden className="stack-stage relative mx-auto h-[19rem] w-full max-w-[26rem] sm:h-[22rem]">
        {[...LAYERS].reverse().map((l, i) => (
          <div key={l.label} className="stack-layer absolute inset-0" style={{ "--i": i } as React.CSSProperties}>
            <div className={`stack-slab ${l.tone}`} />
          </div>
        ))}
      </div>
    </figure>
  );
}
