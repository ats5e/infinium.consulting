"use client";

import { useEffect, useRef } from "react";

/*
 * THE CLARITY FIELD — a living financial operating system, drawn in ink.
 *
 * Reads left to right as a sentence: a diffuse field of raw events is
 * captured by braided flow-bundles, converges through an engineered
 * waist, and settles single-file into six ordered lanes — the real
 * taxonomy of financial infrastructure. Every particle follows a cubic
 * bezier owned by its bundle; disorder is a perpendicular wander that
 * decays as the particle is understood. Every ~7s one bundle reroutes
 * to a new lane with a smooth control-point migration. Nothing moves
 * randomly: chaos is only ever the *start* of a path.
 *
 * Rendering: two planes. The braid (hundreds of layered strokes, the
 * "thousands of paths" texture) paints ONCE to an offscreen canvas —
 * zero per-frame cost. The live plane draws ~1.2k tiny faceted blocks
 * derived from the Infinium logo mark. DPR-capped, paused off-screen, and
 * stilled (one rich frame) for reduced motion and automated agents so
 * frame-based measurement stays possible.
 *
 * Telemetry is real: onOrder reports the live fraction of particles
 * currently in their ordered phase.
 */

export const LANES = [
  "Payments",
  "Risk",
  "Compliance",
  "Liquidity",
  "Settlement",
  "Regulation",
] as const;

const LANE_TOP = 0.14; // lane band as fraction of height
const LANE_BOTTOM = 0.86;
const LANE_END_X = 0.9; // terminals sit on-screen so the resolution is legible
const KNOT_X = 0.52; // the engineered waist — earlier, so order owns more of the frame

export function laneY(i: number) {
  return LANE_TOP + (i * (LANE_BOTTOM - LANE_TOP)) / (LANES.length - 1);
}

type Bundle = {
  sx: number;
  sy: number;
  c1x: number;
  c1y: number;
  c2x: number;
  lane: number;
  laneFrom: number;
  laneT: number; // 0..1 migration progress (1 = settled)
  strokes: number;
};

type Particle = {
  bundle: number;
  t: number;
  speed: number;
  slot: number; // settled single-file offset, px
  wanderA: number; // chaotic wander amplitude, px
  wanderF: number;
  phase: number;
  pulse: boolean;
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const INK = "23, 56, 102"; // navy
const STEEL = "91, 107, 127";
const COBALT = "35, 79, 189";

/* A performance-conscious miniature of the three visible faces in the
 * Infinium crystal. The vertices use a true 2:1 isometric silhouette so
 * the mark remains square and recognisable when rendered at small sizes.
 *
 * `clarity` (0..1) tells the block how understood it is. Raw events read
 * as faint monochrome specks — barely a face of cobalt — and only ignite
 * into the full ice/navy/cobalt crystal as they resolve into a lane. The
 * palette itself carries the narrative: grey noise → cobalt context. */
function drawLogoBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  alpha: number,
  clarity: number,
) {
  const top = y - size;
  const shoulder = y - size * 0.5;
  const waist = y;
  const sideBase = y + size * 0.5;
  const base = y + size;

  // ice-glass top face — catches the light only as the mark resolves
  ctx.fillStyle = `rgba(154, 199, 248, ${alpha * (0.18 + 0.5 * clarity)})`;
  ctx.beginPath();
  ctx.moveTo(x, top);
  ctx.lineTo(x + size, shoulder);
  ctx.lineTo(x, waist);
  ctx.lineTo(x - size, shoulder);
  ctx.closePath();
  ctx.fill();

  // deep-navy left face — present throughout, the mass of the mark
  ctx.fillStyle = `rgba(${INK}, ${alpha * (0.5 + 0.4 * clarity)})`;
  ctx.beginPath();
  ctx.moveTo(x - size, shoulder);
  ctx.lineTo(x, waist);
  ctx.lineTo(x, base);
  ctx.lineTo(x - size, sideBase);
  ctx.closePath();
  ctx.fill();

  // cobalt right face — clarity itself; near-absent in the noise
  ctx.fillStyle = `rgba(${COBALT}, ${alpha * (0.12 + 0.88 * clarity)})`;
  ctx.beginPath();
  ctx.moveTo(x + size, shoulder);
  ctx.lineTo(x, waist);
  ctx.lineTo(x, base);
  ctx.lineTo(x + size, sideBase);
  ctx.closePath();
  ctx.fill();
}

export default function ClarityField({
  still,
  onOrder,
}: {
  still: boolean;
  onOrder?: (pct: number) => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const braidRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = wrap.current;
    const braidCanvas = braidRef.current;
    const liveCanvas = liveRef.current;
    if (!host || !braidCanvas || !liveCanvas) return;

    const rand = mulberry32(20260716);
    let W = 0;
    let H = 0;
    let dpr = 1;
    let bundles: Bundle[] = [];
    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;
    let clock = 0;
    let rerouteAt = 5;
    const pointer = { x: -1e4, y: -1e4, px: 0, py: 0 };

    /* bezier owned by a bundle, with live lane migration */
    const laneYPx = (i: number) => laneY(i) * H;
    const bundleEndY = (b: Bundle) => {
      const from = laneYPx(b.laneFrom);
      const to = laneYPx(b.lane);
      const t = b.laneT < 1 ? 1 - Math.pow(1 - b.laneT, 3) : 1; // ease-out cubic
      return from + (to - from) * t;
    };
    const point = (b: Bundle, t: number, out: { x: number; y: number }) => {
      const ey = bundleEndY(b);
      const x0 = b.sx * W,
        y0 = b.sy * H,
        x1 = b.c1x * W,
        y1 = b.c1y * H,
        x2 = b.c2x * W,
        y2 = ey,
        x3 = LANE_END_X * W,
        y3 = ey;
      const u = 1 - t;
      out.x = u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3;
      out.y = u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3;
    };

    const build = () => {
      const rect = host.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      for (const c of [braidCanvas, liveCanvas]) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
      }

      // 3 bundles per lane, born across the chaos field
      bundles = [];
      for (let lane = 0; lane < LANES.length; lane++) {
        for (let k = 0; k < 3; k++) {
          bundles.push({
            sx: 0.01 + rand() * 0.2,
            sy: 0.04 + rand() * 0.92,
            c1x: 0.3 + rand() * 0.12,
            c1y: 0.1 + rand() * 0.8,
            c2x: KNOT_X + 0.1 + rand() * 0.06,
            lane,
            laneFrom: lane,
            laneT: 1,
            strokes: 6 + Math.floor(rand() * 3),
          });
        }
      }

      const count = W < 760 ? 460 : 900;
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          bundle: Math.floor(rand() * bundles.length),
          t: rand(),
          speed: 0.045 + rand() * 0.05,
          slot: (rand() - 0.5) * 3.4,
          wanderA: 14 + rand() * 34,
          wanderF: 0.6 + rand() * 1.4,
          phase: rand() * Math.PI * 2,
          pulse: i % 40 === 0,
        });
      }

      paintBraid();
    };

    /* the braid — painted once: layered guide strokes, capillaries,
     * event debris, lane rails and the convergence wash */
    const paintBraid = () => {
      const ctx = braidCanvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const p = { x: 0, y: 0 };
      const q = { x: 0, y: 0 };

      // clarity band — the ordered right half sits on a soft cool wash,
      // so the eye reads a lit, resolved zone against the raw grey field
      const band = ctx.createLinearGradient(KNOT_X * W, 0, W, 0);
      band.addColorStop(0, "rgba(255,255,255,0)");
      band.addColorStop(1, `rgba(${COBALT}, 0.045)`);
      ctx.fillStyle = band;
      ctx.fillRect(KNOT_X * W, 0, W - KNOT_X * W, H);

      // convergence wash — one soft pool of cobalt at the waist
      const knot = ctx.createRadialGradient(KNOT_X * W, H * 0.5, 0, KNOT_X * W, H * 0.5, Math.min(W, H) * 0.5);
      knot.addColorStop(0, `rgba(${COBALT}, 0.06)`);
      knot.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = knot;
      ctx.fillRect(0, 0, W, H);

      // guide strokes: each bundle braided with jittered siblings. They
      // strengthen toward the waist and thin out into clean lane threads.
      for (const b of bundles) {
        for (let s = 0; s < b.strokes; s++) {
          const off = (s - b.strokes / 2) * 2.4;
          ctx.beginPath();
          for (let i = 0; i <= 44; i++) {
            const t = i / 44;
            point(b, t, p);
            const decay = 1 - smooth(Math.min(1, t / 0.62));
            const y = p.y + off * (0.4 + decay * 2.4) + Math.sin(t * 9 + s) * decay * 3;
            if (i === 0) ctx.moveTo(p.x, y);
            else ctx.lineTo(p.x, y);
          }
          ctx.strokeStyle = `rgba(${INK}, ${0.03 + 0.055 * (s / b.strokes)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      // capillaries: a few stray events joining a bundle early in its run
      for (let i = 0; i < 130; i++) {
        const b = bundles[Math.floor(rand() * bundles.length)];
        const join = 0.06 + rand() * 0.28;
        point(b, join, q);
        const x0 = q.x - (20 + rand() * 90);
        const y0 = q.y + (rand() - 0.5) * 130;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(x0 + (q.x - x0) * 0.5, y0 + (q.y - y0) * 0.15, q.x, q.y);
        ctx.strokeStyle = `rgba(${STEEL}, ${0.04 + rand() * 0.05})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // event debris: the unread world as a delicate grey dust, left edge
      for (let i = 0; i < 80; i++) {
        const x = rand() * W * 0.3;
        const y = rand() * H;
        ctx.fillStyle = `rgba(${STEEL}, ${0.08 + rand() * 0.1})`;
        ctx.fillRect(x, y, 1.3, 1.3);
      }

      // lane rails: fade in from the waist, resolve crisp toward the terminals
      for (let i = 0; i < LANES.length; i++) {
        const y = laneYPx(i);
        const x0 = (KNOT_X + 0.12) * W;
        const x1 = LANE_END_X * W;
        const rail = ctx.createLinearGradient(x0, 0, x1, 0);
        rail.addColorStop(0, `rgba(${INK}, 0)`);
        rail.addColorStop(0.25, `rgba(${INK}, 0.14)`);
        rail.addColorStop(1, `rgba(${INK}, 0.2)`);
        ctx.strokeStyle = rail;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.lineTo(x1, y);
        ctx.stroke();
      }
    };

    const smooth = (t: number) => t * t * (3 - 2 * t);

    /* one live frame: capture -> converge -> settle */
    const drawLive = (dt: number) => {
      const ctx = liveCanvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // depth parallax: the live plane leans opposite the pointer
      ctx.translate(pointer.px * -8, pointer.py * -5);

      const p = { x: 0, y: 0 };
      let ordered = 0;

      for (const pt of particles) {
        const b = bundles[pt.bundle];
        pt.t += pt.speed * dt;
        if (pt.t >= 1) {
          // absorbed at the terminal; a new event enters the field
          pt.t = 0;
          pt.wanderA = 14 + Math.random() * 34;
          pt.slot = (Math.random() - 0.5) * 7;
        }
        const t = pt.t;
        point(b, t, p);

        // disorder decays as the particle is understood
        const order = smooth(Math.min(1, t / 0.62));
        if (t > 0.62) ordered++;
        const wander = Math.sin(clock * pt.wanderF + pt.phase) * pt.wanderA * (1 - order);
        const oy = wander + pt.slot * order;

        // the cursor attracts nearby flow — the system attends
        let ax = 0;
        let ay = 0;
        let near = 0;
        const dx = p.x - pointer.x;
        const dy = p.y + oy - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 130 * 130) {
          near = 1 - Math.sqrt(d2) / 130;
          ax = -dx * near * 0.14;
          ay = -dy * near * 0.14;
        }

        const alpha = pt.pulse ? 0.9 : 0.22 + order * 0.4 + near * 0.28;
        // Keep the raw field delicate, but let resolved marks read as a
        // full three-face block. Clarity drives both colour and size, so
        // the lanes visibly sharpen as chaos becomes context.
        const clarity = pt.pulse ? 1 : Math.min(1, order + near * 0.5);
        const size = pt.pulse ? 5 : 1.7 + order * 1.5 + near * 0.65;
        drawLogoBlock(ctx, p.x + ax, p.y + oy + ay, size, alpha, clarity);
      }

      onOrder?.(Math.round((ordered / particles.length) * 100));
    };

    /* an engineered decision: one bundle re-routes to a new lane */
    const maybeReroute = () => {
      if (clock < rerouteAt) return;
      rerouteAt = clock + 6 + Math.random() * 3;
      const b = bundles[Math.floor(Math.random() * bundles.length)];
      const to = Math.floor(Math.random() * LANES.length);
      if (to === b.lane) return;
      b.laneFrom = b.lane;
      b.lane = to;
      b.laneT = 0;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000) || 0.016;
      last = now;
      clock += dt;
      pointer.px += (clamp(pointer.x / W - 0.5, -0.5, 0.5) - pointer.px) * 0.04;
      pointer.py += (clamp(pointer.y / H - 0.5, -0.5, 0.5) - pointer.py) * 0.04;
      for (const b of bundles) if (b.laneT < 1) b.laneT = Math.min(1, b.laneT + dt / 1.4);
      maybeReroute();
      drawLive(dt);
    };

    const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

    const start = () => {
      if (running || still || !visible) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    build();
    if (still) {
      // one rich, measurable frame: the system mid-thought
      clock = 20;
      drawLive(0.016);
    } else {
      start();
    }

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.x = -1e4;
      pointer.y = -1e4;
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    // spend nothing while off-screen
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) stop();
      else start();
    });
    io.observe(host);

    let resizeT = 0;
    const onResize = () => {
      window.clearTimeout(resizeT);
      resizeT = window.setTimeout(() => {
        build();
        if (still) {
          clock = 20;
          drawLive(0.016);
        }
      }, 180);
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeT);
    };
  }, [still, onOrder]);

  return (
    <div ref={wrap} aria-hidden className="absolute inset-0">
      <canvas ref={braidRef} className="absolute inset-0 h-full w-full" />
      <canvas ref={liveRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
