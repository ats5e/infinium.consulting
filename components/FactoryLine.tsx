"use client";

import { useEffect, useRef, useState } from "react";

/*
 * THE FACTORY LINE — the AI Factory page's argument, made live.
 *
 * Reads left to right as a production line: pale, disordered cubes
 * (disconnected pilots) drift in from the left at loose heights,
 * pass through a gate of scanning glass — where each one is pulled
 * onto a lattice lane, stilled, and ignited cobalt — and emerge
 * governed. On the far side, resolved cubes are lifted one by one
 * into five use-case towers that fill, flash, ship and rebuild.
 *
 * Same materials and physics as the homepage assembly field: 2:1
 * isometric cubes in the brand palette on two canvas planes (static
 * lattice painted once, live plane on rAF), DPR-capped, paused
 * off-screen, and stilled — one rich frame — for reduced motion and
 * automated agents.
 *
 * Telemetry is real: the governed share and shipped count in the
 * band's header are read off the live simulation each frame.
 */

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

type RGB = [number, number, number];
type Pal = { top: RGB; left: RGB; right: RGB };

const GLASSY: Pal = { top: [232, 242, 252], left: [168, 196, 232], right: [205, 224, 246] };
const M_COBALT: Pal = { top: [96, 138, 226], left: [22, 52, 130], right: [52, 98, 219] };
const M_NAVY: Pal = { top: [38, 64, 108], left: [9, 20, 42], right: [21, 47, 94] };
const IGNITE: Pal = { top: [206, 226, 252], left: [150, 186, 240], right: [178, 206, 248] };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mixc = (a: RGB, b: RGB, t: number): RGB => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const mixp = (a: Pal, b: Pal, t: number): Pal => ({ top: mixc(a.top, b.top, t), left: mixc(a.left, b.left, t), right: mixc(a.right, b.right, t) });
const css = (c: RGB, a: number) => `rgba(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}, ${a})`;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

function drawIsoCube(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  e: number,
  pal: Pal,
  alpha: number,
  seamAlpha = 0,
) {
  const w = e * 0.866;
  const h = e * 0.5;
  const d = e;

  ctx.fillStyle = css(pal.top, alpha);
  ctx.beginPath();
  ctx.moveTo(x, y - d);
  ctx.lineTo(x + w, y - d - h);
  ctx.lineTo(x, y - d - 2 * h);
  ctx.lineTo(x - w, y - d - h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = css(pal.left, alpha);
  ctx.beginPath();
  ctx.moveTo(x, y - d);
  ctx.lineTo(x - w, y - d - h);
  ctx.lineTo(x - w, y - h);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = css(pal.right, alpha);
  ctx.beginPath();
  ctx.moveTo(x, y - d);
  ctx.lineTo(x + w, y - d - h);
  ctx.lineTo(x + w, y - h);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();

  if (seamAlpha > 0) {
    ctx.strokeStyle = `rgba(6, 16, 36, ${seamAlpha})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x, y - d);
    ctx.lineTo(x + w, y - d - h);
    ctx.lineTo(x, y - d - 2 * h);
    ctx.lineTo(x - w, y - d - h);
    ctx.closePath();
    ctx.moveTo(x, y - d);
    ctx.lineTo(x, y);
    ctx.moveTo(x - w, y - d - h);
    ctx.lineTo(x - w, y - h);
    ctx.lineTo(x, y);
    ctx.lineTo(x + w, y - h);
    ctx.lineTo(x + w, y - d - h);
    ctx.stroke();
  }
}

/* the line's geography, as fractions of the canvas */
const GATE_IN = 0.36; // alignment begins
const GATE_OUT = 0.55; // governed; eligible for lifting
const FADE_OUT = 0.64; // unlifted cubes retire here
const GROUND_Y = 0.8; // the towers' floor
const TOWER_H = 6; // cubes per finished tower

const TOWERS: Array<{ x: number; label: string }> = [
  { x: 0.66, label: "FIN CRIME" },
  { x: 0.735, label: "CREDIT" },
  { x: 0.81, label: "FRAUD" },
  { x: 0.885, label: "SERVICING" },
  { x: 0.945, label: "REPORTING" },
];

type Mote = {
  x: number;
  yFree: number; // disordered height, pre-gate
  lane: number; // the lattice lane the gate pulls it onto
  size: number;
  pal: Pal;
  vx: number;
  wf: number;
  amp: number;
  phase: number;
  alpha: number;
  depth: number;
};

type Tower = {
  filled: number;
  claimed: number; // filled + cubes en route
  flash: number[]; // per-slot ignition
  shipT: number; // >0 while the finished tower lifts away
  holdT: number; // glow hold before shipping
};

type Lift = {
  tower: number;
  slot: number;
  sx: number;
  sy: number;
  size: number;
  s: number;
  dur: number;
  trail: Array<{ x: number; y: number }>;
};

function FactoryLineCanvas({
  still,
  onStats,
}: {
  still: boolean;
  onStats?: (governed: number, shipped: number) => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const threadsRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = wrap.current;
    const threadsCanvas = threadsRef.current;
    const liveCanvas = liveRef.current;
    if (!host || !threadsCanvas || !liveCanvas) return;

    const rand = mulberry32(20260819);
    let W = 0;
    let H = 0;
    let dpr = 1;
    let e = 18; // tower cube edge, px
    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;
    let clock = 0;
    const pointer = { x: -1e4, y: -1e4, px: 0, py: 0 };
    let motes: Mote[] = [];
    let towers: Tower[] = [];
    let lifts: Lift[] = [];
    let lanes: number[] = [];
    let shipped = 0;
    let nextLift = 1.2;
    let pulseX = -1;
    let nextPulse = 1.6;
    let monoFont = "ui-monospace, monospace";

    /* the gate: three scanning sheets astride the lane bundle */
    const SHEETS = [
      { x: 0.4, hFrac: 0.62, phase: 0.7 },
      { x: 0.46, hFrac: 0.7, phase: 2.9 },
      { x: 0.52, hFrac: 0.64, phase: 4.4 },
    ];

    const towerBase = (ti: number) => ({ bx: TOWERS[ti].x * W, by: GROUND_Y * H });
    const slotPos = (ti: number, slot: number, out: { x: number; y: number }) => {
      const { bx, by } = towerBase(ti);
      out.x = bx;
      out.y = by - slot * e;
    };

    const respawn = (m: Mote) => {
      m.x = -0.03 - rand() * 0.1;
      m.yFree = 0.1 + rand() * 0.62;
      m.lane = Math.floor(rand() * lanes.length);
      const roll = rand();
      m.pal = roll < 0.12 ? M_NAVY : roll < 0.5 ? M_COBALT : GLASSY;
    };

    const build = () => {
      const rect = host.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      for (const c of [threadsCanvas, liveCanvas]) {
        c.width = Math.round(W * dpr);
        c.height = Math.round(H * dpr);
      }
      e = clamp(Math.min(H * 0.088, W * 0.021), 9, 24);
      monoFont = getComputedStyle(host).fontFamily || monoFont;

      /* the lanes: the gate pulls every cube onto one of these */
      lanes = Array.from({ length: 6 }, (_, i) => 0.2 + (i * 0.42) / 5);

      towers = TOWERS.map(() => ({
        filled: 0,
        claimed: 0,
        flash: Array.from({ length: TOWER_H }, () => 0),
        shipT: 0,
        holdT: 0,
      }));
      /* the line is mid-shift when the visitor arrives */
      const seeds = [3, 5, 1, 4, 2];
      towers.forEach((t, i) => {
        t.filled = seeds[i];
        t.claimed = seeds[i];
      });
      shipped = 7;
      lifts = [];

      const count = clamp(Math.round((W * H) / 16000), 34, 72);
      motes = Array.from({ length: count }, () => {
        const depth = Math.pow(rand(), 0.85);
        const m: Mote = {
          x: 0,
          yFree: 0,
          lane: 0,
          size: lerp(3, 9.5, depth),
          pal: GLASSY,
          vx: lerp(0.022, 0.052, depth),
          wf: 0.4 + rand() * 0.5,
          amp: lerp(2, 6.5, depth),
          phase: rand() * Math.PI * 2,
          alpha: lerp(0.42, 1, depth),
          depth,
        };
        respawn(m);
        m.x = rand() * 0.62 - 0.03; // scatter along the whole intake on load
        return m;
      });
      motes.sort((a, b) => a.depth - b.depth);

      /* ——— the static plane: lanes, gate shadow, ground lattice ——— */
      const tctx = threadsCanvas.getContext("2d");
      if (!tctx) return;
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tctx.clearRect(0, 0, W, H);
      const tr = mulberry32(99);

      /* intake lanes: loose threads gathering into the gate */
      for (const lane of lanes) {
        const y = lane * H;
        tctx.strokeStyle = `rgba(23, 56, 102, ${0.07 + tr() * 0.05})`;
        tctx.lineWidth = 0.8;
        tctx.beginPath();
        tctx.moveTo(-2, y);
        tctx.lineTo(W * FADE_OUT, y);
        tctx.stroke();
      }
      for (let n = 0; n < 5; n++) {
        const y = (0.12 + tr() * 0.6) * H;
        tctx.strokeStyle = `rgba(23, 56, 102, ${0.04 + tr() * 0.04})`;
        tctx.lineWidth = 0.7;
        tctx.beginPath();
        tctx.moveTo(-2, y);
        tctx.lineTo(W * (GATE_IN + tr() * 0.08), y);
        tctx.stroke();
      }

      /* the ground plane beneath the towers: the factory floor.
       * Same isometric axes as the cubes; fades with distance. */
      const gw = e * 0.866;
      const gh = e * 0.5;
      const bx = TOWERS[0].x * W - gw * 4;
      const by = GROUND_Y * H;
      const gx = (u: number, v: number) => bx + (u - v) * gw;
      const gy = (u: number, v: number) => by + (u + v) * gh;
      const U0 = -1;
      const U1 = Math.ceil(((TOWERS[4].x - TOWERS[0].x) * W + gw * 8) / gw);
      const V0 = -2;
      const V1 = 5;
      tctx.lineWidth = 0.7;
      for (let u = U0; u <= U1; u++) {
        const a = 0.1 * (1 - (u - U0) / (U1 - U0)) + 0.03;
        const grad = tctx.createLinearGradient(gx(u, V0), gy(u, V0), gx(u, V1), gy(u, V1));
        grad.addColorStop(0, `rgba(23, 56, 102, ${a})`);
        grad.addColorStop(1, "rgba(23, 56, 102, 0)");
        tctx.strokeStyle = grad;
        tctx.beginPath();
        tctx.moveTo(gx(u, V0), gy(u, V0));
        tctx.lineTo(gx(u, V1), gy(u, V1));
        tctx.stroke();
      }
      for (let v = V0; v <= V1; v++) {
        tctx.strokeStyle = `rgba(23, 56, 102, ${0.07 * (1 - (v - V0) / (V1 - V0)) + 0.02})`;
        tctx.beginPath();
        tctx.moveTo(gx(U0, v), gy(U0, v));
        tctx.lineTo(gx(U1, v), gy(U1, v));
        tctx.stroke();
      }

      /* the conveyor's own edge: one firmer line under the lane bundle */
      tctx.strokeStyle = "rgba(23, 56, 102, 0.12)";
      tctx.lineWidth = 1;
      tctx.beginPath();
      tctx.moveTo(-2, H * (lanes[lanes.length - 1] + 0.09));
      tctx.lineTo(W * (GATE_OUT + 0.03), H * (lanes[lanes.length - 1] + 0.09));
      tctx.stroke();
    };

    const drawSheet = (ctx: CanvasRenderingContext2D, sh: { x: number; hFrac: number; phase: number }) => {
      const x = sh.x * W;
      const pw = clamp(0.042 * W, 26, 84);
      const ph = sh.hFrac * H * 0.5;
      const ps = pw * 0.3;
      const yc = 0.42 * H + Math.sin(clock * 0.42 + sh.phase) * 4;
      const boost = pulseX < 0 ? 0 : Math.exp(-Math.pow((sh.x - pulseX) / 0.05, 2));

      const TLx = x - pw, TRx = x + pw;
      const TLy = yc - ph + ps, TRy = yc - ph - ps;
      const BLy = yc + ph + ps, BRy = yc + ph - ps;

      ctx.beginPath();
      ctx.moveTo(TLx, TLy);
      ctx.lineTo(TRx, TRy);
      ctx.lineTo(TRx, BRy);
      ctx.lineTo(TLx, BLy);
      ctx.closePath();
      ctx.fillStyle = `rgba(${boost > 0 ? "236, 243, 255" : "255, 255, 255"}, ${0.2 + boost * 0.3})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(62, 102, 216, ${0.45 + boost * 0.5})`;
      ctx.lineWidth = 1.1 + boost * 0.9;
      ctx.stroke();
      ctx.strokeStyle = "rgba(62, 102, 216, 0.15)";
      ctx.beginPath();
      ctx.moveTo(TLx + 3, TLy + 1);
      ctx.lineTo(TRx + 3, TRy + 1);
      ctx.lineTo(TRx + 3, BRy + 1);
      ctx.lineTo(TLx + 3, BLy + 1);
      ctx.closePath();
      ctx.stroke();

      /* fine grid */
      ctx.strokeStyle = `rgba(35, 79, 189, ${0.07 + boost * 0.3})`;
      ctx.lineWidth = 0.7;
      const cols = 4;
      const rows = 9;
      for (let c = 1; c < cols; c++) {
        const t = c / cols;
        const sx = TLx + (TRx - TLx) * t;
        ctx.beginPath();
        ctx.moveTo(sx, TLy + (TRy - TLy) * t);
        ctx.lineTo(sx, BLy + (BRy - BLy) * t);
        ctx.stroke();
      }
      for (let rw = 1; rw < rows; rw++) {
        const t = rw / rows;
        ctx.beginPath();
        ctx.moveTo(TLx, TLy + (BLy - TLy) * t);
        ctx.lineTo(TRx, TRy + (BRy - TRy) * t);
        ctx.stroke();
      }

      /* node spheres on the frame */
      for (const [nx, ny] of [
        [TLx, TLy],
        [TRx, TRy],
        [TRx, BRy],
        [TLx, BLy],
      ] as const) {
        ctx.fillStyle = "rgba(43, 87, 207, 0.95)";
        ctx.beginPath();
        ctx.arc(nx, ny, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.beginPath();
        ctx.arc(nx - 0.8, ny - 0.8, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawTower = (ctx: CanvasRenderingContext2D, ti: number) => {
      const t = towers[ti];
      const { bx, by } = towerBase(ti);
      const rise = t.shipT > 0 ? smooth(t.shipT) * e * 2.2 : 0;
      const alpha = t.shipT > 0 ? 1 - smooth(t.shipT) : 1;
      const glow = t.holdT > 0 ? Math.sin(clock * 6) * 0.14 + 0.2 : 0;

      /* the floating shadow */
      const grad = ctx.createRadialGradient(bx, by + e * 0.6, 0, bx, by + e * 0.6, e * 2.6);
      grad.addColorStop(0, `rgba(16, 34, 66, ${0.13 * alpha})`);
      grad.addColorStop(1, "rgba(16, 34, 66, 0)");
      ctx.save();
      ctx.translate(bx, by + e * 0.6);
      ctx.scale(1, 0.24);
      ctx.translate(-bx, -(by + e * 0.6));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bx, by + e * 0.6, e * 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const r = mulberry32(311 + ti);
      for (let s = 0; s < t.filled; s++) {
        const pal: Pal = {
          top: mixc([18, 42, 80], [24, 50, 92], r()),
          left: mixc([10, 21, 42], [14, 27, 52], r()),
          right: mixc([40, 87, 210], [52, 100, 224], r()),
        };
        const y = by - s * e - rise;
        drawIsoCube(ctx, bx, y, e, pal, alpha, (0.3 + t.flash[s] * 0.7) * alpha);
        const f = Math.max(t.flash[s] * 0.55, glow);
        if (f > 0) drawIsoCube(ctx, bx, y, e, IGNITE, f * alpha);
      }

      /* the open socket: a faint wireframe where the next cube seats */
      if (t.shipT === 0 && t.holdT === 0 && t.filled < TOWER_H) {
        const y = by - t.filled * e;
        const w = e * 0.866;
        const h = e * 0.5;
        ctx.strokeStyle = `rgba(35, 79, 189, ${0.2 + Math.sin(clock * 2.2 + ti) * 0.08})`;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(bx, y - e);
        ctx.lineTo(bx + w, y - e - h);
        ctx.lineTo(bx, y - e - 2 * h);
        ctx.lineTo(bx - w, y - e - h);
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);
      }

      /* the label plate — only when the towers have air between them */
      if (W > 880) {
        ctx.font = `500 9px ${monoFont}`;
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(23, 56, 102, 0.52)";
        ctx.fillText(TOWERS[ti].label, bx, by + e * 1.5 + 12);
      }
    };

    /* alpha dip while a cube sits inside a pane of glass */
    const glassDim = (xf: number) => {
      for (const sh of SHEETS) if (Math.abs(xf - sh.x) < 0.018) return 0.62;
      return 1;
    };

    const drawLive = (dt: number) => {
      const ctx = liveCanvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.translate(pointer.px * -30, pointer.py * -18);

      for (let i = SHEETS.length - 1; i >= 0; i--) drawSheet(ctx, SHEETS[i]);

      /* the intake cloud, aligning as it crosses the gate */
      for (const m of motes) {
        m.x += m.vx * dt;
        const g = smooth(clamp((m.x - GATE_IN) / (GATE_OUT - GATE_IN), 0, 1));
        if (m.x > FADE_OUT + 0.05) respawn(m);

        const mx = m.x * W + pointer.px * -14 * m.depth;
        const yF = m.yFree * H + Math.sin(clock * m.wf + m.phase) * m.amp * (1 - g * 0.85);
        const yL = lanes[m.lane] * H;
        let my = lerp(yF, yL, g);

        const kick = pulseX < 0 ? 0 : Math.exp(-Math.pow((m.x - pulseX) / 0.055, 2));
        if (kick > 0.02) my -= kick * 6 * m.depth;

        if (pointer.x > 0) {
          const dx = pointer.x - (mx + pointer.px * -30);
          const dy = pointer.y - (my + pointer.py * -18);
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const force = ((130 - dist) / 130) * (1 - g * 0.7);
            my += (dy > 0 ? -1 : 1) * force * 40;
          }
        }

        const fadeIn = smooth(clamp((m.x + 0.02) / 0.05, 0, 1));
        const fadeOut = 1 - smooth(clamp((m.x - (FADE_OUT - 0.04)) / 0.06, 0, 1));
        const pal = mixp(m.pal, M_COBALT, g * (m.pal === GLASSY ? 0.75 : 0.25));
        const sz = m.size * (1 + kick * 0.18);
        drawIsoCube(ctx, mx, my, sz, pal, m.alpha * fadeIn * fadeOut * glassDim(m.x), g * 0.3);
        if (kick > 0.05) drawIsoCube(ctx, mx, my, sz, IGNITE, kick * 0.45 * fadeIn * fadeOut);
      }

      /* the towers, far to near */
      for (let ti = 0; ti < towers.length; ti++) drawTower(ctx, ti);

      /* cubes being lifted into their sockets */
      const t = { x: 0, y: 0 };
      for (const a of lifts) {
        a.s = Math.min(1, a.s + dt / a.dur);
        slotPos(a.tower, a.slot, t);

        const SLIDE = Math.min(0.3, 0.18 / a.dur);
        const FLY = 1 - SLIDE;
        const stageD = e * 1.6;
        const apx = t.x;
        const apy = t.y - e - stageD; // staged directly above the socket

        let x: number;
        let y: number;
        let size: number;
        let seat = 0;

        if (a.s < FLY) {
          const f = smooth(a.s / FLY);
          const x0 = a.sx * W;
          const y0 = a.sy * H;
          const c1x = lerp(x0, apx, 0.35);
          const c1y = y0 - H * 0.16;
          const c2x = lerp(x0, apx, 0.8);
          const c2y = apy - H * 0.1;
          const u = 1 - f;
          x = u * u * u * x0 + 3 * u * u * f * c1x + 3 * u * f * f * c2x + f * f * f * apx;
          y = u * u * u * y0 + 3 * u * u * f * c1y + 3 * u * f * f * c2y + f * f * f * apy;
          size = lerp(a.size, e, smooth(clamp((f - 0.2) / 0.8, 0, 1)));
        } else {
          seat = (a.s - FLY) / SLIDE;
          const k = seat * seat;
          x = apx;
          y = lerp(apy, t.y, k);
          size = e;
        }

        a.trail.push({ x, y });
        if (a.trail.length > 12) a.trail.shift();
        for (let ti2 = 0; ti2 < a.trail.length - 1; ti2++) {
          const q = ti2 / a.trail.length;
          const pt = a.trail[ti2];
          ctx.fillStyle = `rgba(52, 98, 219, ${q * q * 0.28 * (1 - seat)})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y - size * 0.5, lerp(0.6, 3, q), 0, Math.PI * 2);
          ctx.fill();
        }

        const ord = clamp(a.s * 1.4, 0, 1);
        drawIsoCube(ctx, x, y, size, mixp(M_COBALT, M_NAVY, ord * 0.3), lerp(0.85, 1, ord), 0.3 * ord);

        if (a.s >= 1) {
          const tw = towers[a.tower];
          tw.filled += 1;
          tw.flash[a.slot] = 1.4;
          if (tw.filled >= TOWER_H) tw.holdT = 1; // finished: glow, then ship
        }
      }
      lifts = lifts.filter((a) => a.s < 1);

      /* telemetry: how much of the live field is governed */
      let governedCount = 0;
      let total = motes.length + lifts.length;
      for (const m of motes) if (m.x > GATE_IN) governedCount++;
      governedCount += lifts.length;
      for (const tw of towers) {
        total += tw.filled;
        governedCount += tw.filled;
      }
      onStats?.(Math.round((governedCount / Math.max(1, total)) * 100), shipped);
    };

    /* ——— the line's slow decisions ——— */

    const maybeLift = () => {
      if (clock < nextLift || lifts.length >= 2) return;
      const open = towers
        .map((tw, ti) => ({ tw, ti }))
        .filter(({ tw }) => tw.shipT === 0 && tw.holdT === 0 && tw.claimed < TOWER_H);
      if (!open.length) return;
      /* recruit a governed cube from the far side of the gate */
      const candidates = motes.filter((m) => m.x > GATE_OUT && m.x < FADE_OUT);
      if (!candidates.length) return;
      nextLift = clock + 1.1 + rand() * 1.2;

      const pick = open[Math.floor(rand() * open.length)];
      const m = candidates[Math.floor(rand() * candidates.length)];
      lifts.push({
        tower: pick.ti,
        slot: pick.tw.claimed,
        sx: m.x,
        sy: lanes[m.lane],
        size: Math.max(4.5, m.size),
        s: 0,
        dur: 1.3 + rand() * 0.9,
        trail: [],
      });
      pick.tw.claimed += 1;
      respawn(m);
    };

    const maybeShip = (dt: number) => {
      for (const tw of towers) {
        if (tw.holdT > 0) {
          tw.holdT = Math.max(0, tw.holdT - dt * 0.5);
          if (tw.holdT === 0) tw.shipT = 0.0001;
        } else if (tw.shipT > 0) {
          tw.shipT = Math.min(1, tw.shipT + dt * 1.4);
          if (tw.shipT >= 1) {
            tw.filled = 0;
            tw.claimed = 0;
            tw.flash = tw.flash.map(() => 0);
            tw.shipT = 0;
            shipped += 1;
          }
        }
        for (let s = 0; s < tw.flash.length; s++)
          if (tw.flash[s] > 0) tw.flash[s] = Math.max(0, tw.flash[s] - dt * 1.8);
      }
    };

    const maybePulse = (dt: number) => {
      if (pulseX >= 0) {
        pulseX += dt * 0.55; // sweeps with the flow, left → right
        if (pulseX > GATE_OUT + 0.12) pulseX = -1;
        return;
      }
      if (clock >= nextPulse) {
        nextPulse = clock + 4 + rand() * 2.4;
        pulseX = GATE_IN - 0.14;
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000) || 0.016;
      last = now;
      clock += dt;
      pointer.px += (clamp(pointer.x / W - 0.5, -0.5, 0.5) - pointer.px) * 0.04;
      pointer.py += (clamp(pointer.y / H - 0.5, -0.5, 0.5) - pointer.py) * 0.04;

      maybeLift();
      maybeShip(dt);
      maybePulse(dt);
      drawLive(dt);
    };

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
      // one rich, measurable frame: the line mid-shift
      clock = 20;
      pulseX = 0.45;
      drawLive(0.016);
    } else {
      start();
    }

    const onMove = (ev: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.x = ev.clientX - r.left;
      pointer.y = ev.clientY - r.top;
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
          pulseX = 0.45;
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
  }, [still, onStats]);

  return (
    <div ref={wrap} aria-hidden className="absolute inset-0 font-mono">
      <canvas ref={threadsRef} className="absolute inset-0 h-full w-full" />
      <canvas ref={liveRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

/* ——— the band ——— */

export function FactoryLineBand() {
  const [still, setStill] = useState(false);
  const governedRef = useRef<HTMLSpanElement>(null);
  const shippedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const rmq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // automated agents get one rich, measurable frame
    const update = () => setStill(rmq.matches || navigator.webdriver === true);
    update();
    rmq.addEventListener("change", update);
    return () => rmq.removeEventListener("change", update);
  }, []);

  return (
    <section
      data-testid="factory-line"
      aria-label="The AI Factory, visualised: disconnected pilots enter on the left, are governed through the factory gate, and ship as production use cases on the right"
      className="relative overflow-hidden bg-void"
    >
      <div className="relative mx-auto max-w-(--container-content) px-(--spacing-gutter) pt-10">
        <div className="flex items-baseline justify-between gap-6 border-b hairline pb-4">
          <div className="hidden grid-cols-3 gap-6 sm:grid sm:grow">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">
              <span className="text-signal">01</span> · Disconnected pilots
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">
              <span className="text-signal">02</span> · The factory
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel">
              <span className="text-signal">03</span> · Production use cases
            </p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel sm:hidden">
            Pilots → factory → production
          </p>
          <p aria-hidden className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-steel">
            governed <span ref={governedRef} className="text-signal">—</span>
            <span className="mx-2 text-steel/50">·</span>
            shipped <span ref={shippedRef} className="text-signal">—</span>
          </p>
        </div>
      </div>
      <div className="relative h-72 sm:h-80 md:h-96">
        <FactoryLineCanvas
          still={still}
          onStats={(governed, shipped) => {
            if (governedRef.current) governedRef.current.textContent = `${governed}%`;
            if (shippedRef.current) shippedRef.current.textContent = String(shipped).padStart(2, "0");
          }}
        />
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-ice/12" />
    </section>
  );
}
