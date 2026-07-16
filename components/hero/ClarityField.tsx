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
 * zero per-frame cost. The live plane draws ~1.2k velocity-stretched
 * particle segments per frame. DPR-capped, paused off-screen, and
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

const LANE_TOP = 0.12; // lane band as fraction of height
const LANE_BOTTOM = 0.88;
const LANE_END_X = 0.985; // lanes run to the label column
const KNOT_X = 0.6; // the engineered waist

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

      const count = W < 760 ? 520 : 1200;
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          bundle: Math.floor(rand() * bundles.length),
          t: rand(),
          speed: 0.045 + rand() * 0.05,
          slot: (rand() - 0.5) * 7,
          wanderA: 14 + rand() * 34,
          wanderF: 0.6 + rand() * 1.4,
          phase: rand() * Math.PI * 2,
          pulse: i % 34 === 0,
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

      // convergence wash — one soft pool of cobalt at the waist
      const knot = ctx.createRadialGradient(KNOT_X * W, H * 0.5, 0, KNOT_X * W, H * 0.5, Math.min(W, H) * 0.42);
      knot.addColorStop(0, `rgba(${COBALT}, 0.05)`);
      knot.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = knot;
      ctx.fillRect(0, 0, W, H);

      // guide strokes: each bundle braided with jittered siblings
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
          ctx.strokeStyle = `rgba(${INK}, ${0.028 + 0.05 * (s / b.strokes)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      // capillaries: stray events joining a bundle early in its run
      for (let i = 0; i < 240; i++) {
        const b = bundles[Math.floor(rand() * bundles.length)];
        const join = 0.06 + rand() * 0.3;
        point(b, join, q);
        const x0 = q.x - (20 + rand() * 90);
        const y0 = q.y + (rand() - 0.5) * 130;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(x0 + (q.x - x0) * 0.5, y0 + (q.y - y0) * 0.15, q.x, q.y);
        ctx.strokeStyle = `rgba(${STEEL}, ${0.05 + rand() * 0.06})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      // event debris: the unread world, left edge
      ctx.textBaseline = "middle";
      for (let i = 0; i < 130; i++) {
        const x = rand() * W * 0.34;
        const y = rand() * H;
        if (rand() < 0.5) {
          ctx.fillStyle = `rgba(${STEEL}, ${0.1 + rand() * 0.12})`;
          ctx.fillRect(x, y, 1.4, 1.4);
        } else {
          ctx.font = "500 7px system-ui, sans-serif";
          ctx.fillStyle = `rgba(${STEEL}, ${0.07 + rand() * 0.05})`;
          ctx.fillText((rand() * 9.99).toFixed(2), x, y);
        }
      }

      // lane rails
      for (let i = 0; i < LANES.length; i++) {
        const y = laneYPx(i);
        ctx.beginPath();
        ctx.moveTo((KNOT_X + 0.14) * W, y);
        ctx.lineTo(LANE_END_X * W, y);
        ctx.strokeStyle = `rgba(${INK}, 0.14)`;
        ctx.lineWidth = 1;
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
      const q = { x: 0, y: 0 };
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
        point(b, Math.max(0, t - 0.012), q);

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

        const alpha = pt.pulse ? 0.85 : 0.22 + order * 0.3 + near * 0.3;
        ctx.strokeStyle = pt.pulse ? `rgba(${COBALT}, ${alpha})` : `rgba(${INK}, ${alpha})`;
        ctx.lineWidth = pt.pulse ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(q.x + ax, q.y + oy + ay);
        ctx.lineTo(p.x + ax, p.y + oy + ay);
        ctx.stroke();

        if (pt.pulse) {
          ctx.fillStyle = `rgba(${COBALT}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x + ax, p.y + oy + ay, 1.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // terminal ticks: a soft cobalt arrival at each lane end
      for (let i = 0; i < LANES.length; i++) {
        const y = laneYPx(i);
        const beat = 0.35 + 0.3 * Math.sin(clock * 1.4 + i * 1.1);
        ctx.fillStyle = `rgba(${COBALT}, ${beat})`;
        ctx.fillRect(LANE_END_X * W - 3, y - 1, 3, 2);
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
