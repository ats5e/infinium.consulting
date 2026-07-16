import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

/*
 * HOW WE HELP — five stations of the method, each with a generative
 * ink drawing in the brand system: navy strokes at low alpha, steel
 * points, cobalt only at the moment of meaning. The drawings are
 * deterministic (no randomness at render — SSR-safe) and echo the
 * hero's Clarity Field: full picture, convergence, simulation,
 * execution, adaptation. Orbits and the vortex turn imperceptibly
 * slowly; everything else holds still.
 */

const INK = "#173866";
const STEEL = "#5b6b7f";
const COBALT = "#234fbd";

/* deterministic pseudo-random, seeded — stable across server/client */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CX = 80;
const CY = 56;

/* 01 — see the full picture: a radial survey, everything registered */
function FullPicture() {
  const rand = seeded(11);
  const rings = [16, 28, 40, 52];
  return (
    <svg viewBox="0 0 160 112" fill="none" aria-hidden className="h-full w-full">
      {rings.map((r, ri) =>
        Array.from({ length: 8 + ri * 5 }, (_, i) => {
          const a = (i / (8 + ri * 5)) * Math.PI * 2 + ri * 0.4;
          const jitter = 0.86 + rand() * 0.24;
          const x = CX + Math.cos(a) * r * jitter;
          const y = CY + Math.sin(a) * r * jitter * 0.82;
          return <circle key={`${ri}-${i}`} cx={x} cy={y} r={rand() > 0.85 ? 1.6 : 1} fill={STEEL} opacity={0.34 + rand() * 0.3} />;
        }),
      )}
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2 + 0.2;
        return (
          <line
            key={i}
            x1={CX + Math.cos(a) * 8}
            y1={CY + Math.sin(a) * 7}
            x2={CX + Math.cos(a) * 50}
            y2={CY + Math.sin(a) * 41}
            stroke={INK}
            strokeWidth="0.5"
            opacity="0.14"
          />
        );
      })}
      <circle cx={CX} cy={CY} r="2.6" fill={COBALT} />
      <circle cx={CX} cy={CY} r="5.5" stroke={COBALT} strokeWidth="0.6" opacity="0.35" />
    </svg>
  );
}

/* 02 — understand what matters: many inputs, few relationships */
function Understand() {
  const rand = seeded(23);
  const outs = [34, 48, 64, 78];
  return (
    <svg viewBox="0 0 160 112" fill="none" aria-hidden className="h-full w-full">
      {Array.from({ length: 9 }, (_, i) => {
        const y0 = 10 + i * 11.5;
        const y1 = outs[i % outs.length];
        return (
          <path
            key={i}
            d={`M12 ${y0} C 62 ${y0}, 96 ${y1}, 146 ${y1}`}
            stroke={INK}
            strokeWidth="0.7"
            opacity={0.2 + rand() * 0.18}
          />
        );
      })}
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={12} cy={10 + i * 11.5} r="1.3" fill={STEEL} opacity="0.55" />
      ))}
      {outs.map((y) => (
        <circle key={y} cx={146} cy={y} r="1.8" fill={COBALT} />
      ))}
    </svg>
  );
}

/* 03 — simulate the impact: concentric futures around one decision */
function Simulate() {
  return (
    <svg viewBox="0 0 160 112" fill="none" aria-hidden className="h-full w-full">
      {[10, 17, 24, 31, 38, 45, 52].map((r, i) => (
        <ellipse key={r} cx={CX} cy={CY} rx={r} ry={r * 0.82} stroke={INK} strokeWidth="0.6" opacity={0.22 - i * 0.02} />
      ))}
      <g className="motion-safe:animate-[spin_48s_linear_infinite]" style={{ transformOrigin: "80px 56px" }}>
        <circle cx={CX + 31} cy={CY - 8} r="1.5" fill={STEEL} opacity="0.7" />
        <circle cx={CX - 24} cy={CY + 16} r="1.2" fill={STEEL} opacity="0.55" />
        <circle cx={CX + 8} cy={CY - 36} r="1.2" fill={STEEL} opacity="0.55" />
      </g>
      <circle cx={CX} cy={CY} r="3" fill={COBALT} />
      <circle cx={CX} cy={CY} r="6.5" stroke={COBALT} strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

/* 04 — execute with confidence: everything through the waist, once */
function Execute() {
  const rand = seeded(47);
  return (
    <svg viewBox="0 0 160 112" fill="none" aria-hidden className="h-full w-full">
      {Array.from({ length: 8 }, (_, i) => {
        const y0 = 12 + i * 12.5;
        const y1 = 12 + ((i * 5) % 8) * 12.5;
        return (
          <path
            key={i}
            d={`M12 ${y0} C 52 ${y0}, 66 ${CY}, ${CX} ${CY} S 118 ${y1}, 148 ${y1}`}
            stroke={INK}
            strokeWidth="0.7"
            opacity={0.2 + rand() * 0.16}
          />
        );
      })}
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} cx={148} cy={12 + i * 12.5} r="1.1" fill={STEEL} opacity="0.5" />
      ))}
      <circle cx={CX} cy={CY} r="2.6" fill={COBALT} />
      <circle cx={CX} cy={CY} r="5.5" stroke={COBALT} strokeWidth="0.6" opacity="0.35" />
    </svg>
  );
}

/* 05 — adapt continuously: the system turns with the world */
function Adapt() {
  const rand = seeded(59);
  const arms = [0, 2.1, 4.2];
  return (
    <svg viewBox="0 0 160 112" fill="none" aria-hidden className="h-full w-full">
      <g className="motion-safe:animate-[spin_64s_linear_infinite_reverse]" style={{ transformOrigin: "80px 56px" }}>
        {arms.map((a0, ai) => {
          const pts = Array.from({ length: 26 }, (_, i) => {
            const t = i / 25;
            const a = a0 + t * 3.6;
            const r = 6 + t * 46;
            return `${CX + Math.cos(a) * r},${CY + Math.sin(a) * r * 0.82}`;
          });
          return <polyline key={ai} points={pts.join(" ")} stroke={INK} strokeWidth="0.7" opacity="0.26" fill="none" />;
        })}
        {arms.map((a0, ai) =>
          [0.35, 0.62, 0.88].map((t) => {
            const a = a0 + t * 3.6;
            const r = 6 + t * 46;
            return (
              <circle
                key={`${ai}-${t}`}
                cx={CX + Math.cos(a) * r}
                cy={CY + Math.sin(a) * r * 0.82}
                r={1.2}
                fill={STEEL}
                opacity={0.4 + rand() * 0.3}
              />
            );
          }),
        )}
      </g>
      <circle cx={CX} cy={CY} r="2.4" fill={COBALT} />
    </svg>
  );
}

const STATIONS = [
  {
    title: "See the full picture",
    body: "Unify fragmented data across systems, silos and geographies to reveal what matters.",
    art: <FullPicture />,
  },
  {
    title: "Understand what matters",
    body: "Apply context, rules and domain knowledge to identify relationships, exposures and opportunities.",
    art: <Understand />,
  },
  {
    title: "Simulate the impact",
    body: "Model scenarios, stress outcomes and quantify risk before making critical decisions.",
    art: <Simulate />,
  },
  {
    title: "Execute with confidence",
    body: "Operationalise intelligence across workflows so decisions are faster, safer and auditable.",
    art: <Execute />,
  },
  {
    title: "Adapt continuously",
    body: "Learn, refine and evolve with your business, your markets and the world around you.",
    art: <Adapt />,
  },
] as const;

export function HowWeHelp() {
  return (
    <section aria-label="How we help" className="border-b hairline">
      <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-14 md:py-18">
        <div className="flex items-center gap-4">
          <h2 className="eyebrow">How we help</h2>
          <span aria-hidden className="h-px w-10 bg-cobalt/50" />
        </div>
        <Reveal className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5">
          {STATIONS.map(({ title, body, art }) => (
            <article key={title} className="group">
              <div className="h-24 w-full max-w-40">{art}</div>
              <h3 className="mt-6 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-paper">
                {title}
              </h3>
              <p className="mt-3 max-w-56 text-(length:--text-body-sm) leading-relaxed text-ice">
                {body}
              </p>
              <p className="mt-5">
                <Link
                  href="/services"
                  aria-label={`${title} — our services`}
                  className="font-mono text-(length:--text-label) text-cobalt transition-transform duration-(--duration-fast) group-hover:translate-x-1 inline-block"
                >
                  →
                </Link>
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
