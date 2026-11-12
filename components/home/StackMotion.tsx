"use client";

import { useEffect, useRef, useState } from "react";

/*
 * The R&D band's motion graphic — "The stack", v2 (Jack, 12 Nov: "a lot
 * more impressive").
 *
 * Four isometric slabs with real thickness, each showing what it holds:
 * scattered raw records at the bottom, QBricks' contract scan above them,
 * an ordered grid of governed data products, and a glass analytics layer
 * on top. Data rises through the stack as small tiles that change colour
 * as they pass each layer.
 *
 * The stack assembles once when it scrolls into view, then takes a short
 * guided tour: each layer lifts and lights with its label, bottom to top,
 * three times, and then everything rests fully lit (WCAG 2.2.2 — nothing
 * moves forever). Hovering or focusing a label takes over the tour.
 * Reduced motion: the finished stack, still; labels still highlight.
 *
 * Geometry: every top face is a rounded square drawn in a group that is
 * rotated 45° and squashed to half height — a 2:1 isometric rhombus —
 * so face contents are authored in plain square coordinates (0–250).
 */
const LAYERS = [
  { key: "record", label: "Systems of record" },
  { key: "qbricks", label: "QBricks: ingest, contract, govern" },
  { key: "products", label: "Governed data products" },
  { key: "ai", label: "AI, analytics & reporting" },
] as const;

const CX = 260;
const SIDE = 250;
const DEPTH = 14;
const GAP = 110;
const BASE_Y = 476;
const faceTransform = (cy: number) => `translate(${CX} ${cy}) scale(1 0.5) rotate(45) translate(${-SIDE / 2} ${-SIDE / 2})`;

/* deterministic scatter for the raw-records layer */
const RAW = [
  [22, 30, 20, 12], [70, 18, 14, 22], [120, 40, 26, 10], [176, 24, 16, 16], [208, 70, 22, 12],
  [30, 84, 12, 24], [86, 96, 24, 12], [150, 88, 12, 12], [42, 150, 26, 12], [104, 146, 14, 26],
  [164, 140, 22, 14], [206, 170, 14, 14], [28, 206, 18, 12], [88, 204, 12, 18], [146, 200, 26, 12],
] as const;

/* rising data: x offset from centre, delay (s), duration (s) */
const PARTICLES = [
  [-118, 0, 5.2], [-78, 1.4, 4.6], [-40, 2.6, 5.6], [-6, 0.7, 4.8], [30, 3.1, 5.2],
  [66, 1.9, 4.4], [104, 0.3, 5.8], [132, 2.2, 5], [-98, 3.6, 5.4], [14, 4.1, 4.6],
] as const;

function Slab({ index, active, dimmed }: { index: number; active: boolean; dimmed: boolean }) {
  const cy = BASE_Y - index * GAP;
  const key = LAYERS[index].key;
  const clip = `stack-clip-${key}`;
  return (
    <g className="stack-enter" style={{ "--i": index } as React.CSSProperties}>
      <g className="stack-slab-g" data-active={active || undefined} data-dimmed={dimmed || undefined}>
        {/* thickness: the face repeated downwards in the side colour */}
        {Array.from({ length: DEPTH / 2 }, (_, d) => (
          <rect key={d} transform={faceTransform(cy + DEPTH - d * 2)} width={SIDE} height={SIDE} rx="26" className={`stack-side stack-side--${key}`} />
        ))}
        <g transform={faceTransform(cy)}>
          <clipPath id={clip}>
            <rect width={SIDE} height={SIDE} rx="26" />
          </clipPath>
          <rect width={SIDE} height={SIDE} rx="26" className={`stack-face stack-face--${key}`} />
          <g clipPath={`url(#${clip})`}>
            {key === "record" &&
              RAW.map(([x, y, w, h], i) => (
                <rect key={i} x={x} y={y} width={w} height={h} rx="2" className="stack-raw" transform={`rotate(${(i * 37) % 24 - 12} ${x + w / 2} ${y + h / 2})`} />
              ))}
            {key === "qbricks" && (
              <>
                {Array.from({ length: 25 }, (_, i) => (
                  <rect key={i} x={25 + (i % 5) * 42} y={25 + Math.floor(i / 5) * 42} width="32" height="32" rx="5" className="stack-cell" />
                ))}
                {/* the contract scan */}
                <rect className="stack-scan" x="-70" y="-10" width="60" height={SIDE + 20} fill="url(#stack-scan-grad)" />
              </>
            )}
            {key === "products" &&
              Array.from({ length: 9 }, (_, i) => (
                <rect key={i} x={28 + (i % 3) * 68} y={28 + Math.floor(i / 3) * 68} width="58" height="58" rx="9" className="stack-product" style={{ "--p": i } as React.CSSProperties} />
              ))}
            {key === "ai" && (
              <>
                {[70, 108, 60, 130, 96, 156].map((h, i) => (
                  <rect key={i} x={34 + i * 32} y={206 - h} width="20" height={h} rx="5" className="stack-bar" style={{ "--p": i } as React.CSSProperties} />
                ))}
                <polyline points="44,150 76,112 108,160 140,90 172,118 204,62" className="stack-line" />
              </>
            )}
          </g>
          <rect width={SIDE} height={SIDE} rx="26" className={`stack-edge stack-edge--${key}`} />
        </g>
      </g>
    </g>
  );
}

export function StackMotion() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [entered, setEntered] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [held, setHeld] = useState(false);
  const [toured, setToured] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setEntered(true);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // the guided tour: bottom to top, three times, then rest fully lit
  useEffect(() => {
    if (!inView || held || toured) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let step = 0;
    let timer = 0;
    const tick = () => {
      if (step >= LAYERS.length * 3) {
        setActive(null);
        setToured(true);
        return;
      }
      setActive(step % LAYERS.length);
      step += 1;
      timer = window.setTimeout(tick, 2100);
    };
    timer = window.setTimeout(tick, 1900); // after the assembly
    return () => window.clearTimeout(timer);
  }, [inView, held, toured]);

  const moving = inView && !toured && !held;

  return (
    <figure
      ref={ref}
      data-entered={entered || undefined}
      data-moving={moving || undefined}
      onMouseLeave={() => {
        setHeld(false);
        if (toured) setActive(null);
      }}
      className="stack-motion grid items-center gap-8 rounded-2xl bg-white/[0.07] p-7 sm:max-lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:p-9 xl:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"
    >
      <figcaption className="sr-only">
        How QBricks works: systems of record feed QBricks, which ingests, contracts and governs the data into governed data products for AI, analytics and reporting.
      </figcaption>

      <ol className="flex flex-col-reverse gap-2">
        {LAYERS.map((layer, i) => {
          const isActive = active === i;
          return (
            <li key={layer.key}>
              <button
                type="button"
                aria-pressed={isActive}
                onMouseEnter={() => {
                  setHeld(true);
                  setActive(i);
                }}
                onFocus={() => {
                  setHeld(true);
                  setActive(i);
                }}
                onBlur={() => setHeld(false)}
                onClick={() => {
                  setHeld(true);
                  setActive(i);
                }}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[15px] outline-none transition-colors duration-(--duration-base) focus-visible:ring-2 focus-visible:ring-white ${
                  isActive ? "bg-white/[0.1] text-white" : active === null ? "text-white" : "text-white/75 hover:text-white"
                }`}
              >
                <span className={`text-xs tabular-nums transition-colors duration-(--duration-base) ${isActive ? "text-on-dark-accent" : "text-white/75"}`}>0{i + 1}</span>
                {layer.label}
              </button>
            </li>
          );
        })}
      </ol>

      <svg viewBox="62 14 396 584" aria-hidden className="stack-svg mx-auto h-auto w-full max-w-[36rem]">
        <defs>
          <linearGradient id="stack-scan-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="stack-floor" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#9bc4ff" stopOpacity="0.28" />
            <stop offset="1" stopColor="#9bc4ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* a soft pool of light under the stack */}
        <ellipse cx={CX} cy={BASE_Y + 46} rx="196" ry="56" fill="url(#stack-floor)" />

        <Slab index={0} active={active === 0} dimmed={active !== null && active !== 0} />
        <Slab index={1} active={active === 1} dimmed={active !== null && active !== 1} />

        {/* data rising through the stack, drawn between the layers */}
        <g className="stack-particles">
          {PARTICLES.map(([x, delay, dur], i) => (
            <rect
              key={i}
              x={CX + x - 4}
              y={BASE_Y - 12}
              width="8"
              height="8"
              rx="1.5"
              className="stack-particle"
              style={{ animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
            />
          ))}
        </g>

        <Slab index={2} active={active === 2} dimmed={active !== null && active !== 2} />
        <Slab index={3} active={active === 3} dimmed={active !== null && active !== 3} />
      </svg>
    </figure>
  );
}
