"use client";

import { useEffect, useRef } from "react";

/*
 * THE ASSEMBLY FIELD — the reference made live.
 *
 * Reads right to left as a sentence: chunky navy-and-cobalt cubes
 * drift in from the right along a fine horizontal lattice, pass into
 * a tightly-packed stack of glass scanning sheets — where the dense,
 * nearly-understood work sits in dark columns — and emerge resolved,
 * absorbed seamlessly into the solid voxel mark on the left. The mark
 * itself never breaks: it is the finished thing, dark-seamed navy and
 * cobalt, floating on its shadow.
 *
 * Rendering: two canvas planes. The horizontal lattice threads paint
 * ONCE to a static canvas; the live plane draws the sheet stacks
 * (floating, glinting, re-sorting their docked cubes), the solid
 * mark, the drifting cloud and the resolving particles — all as 2:1
 * isometric cubes in the brand palette. DPR-capped, paused
 * off-screen, and stilled (one rich frame) for reduced motion and
 * automated agents.
 *
 * Telemetry is real: onOrder reports the live share of the field
 * currently inside or beyond the scanning stack — organised.
 */

const N = 4; // voxels per edge of the mark

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

/* the reference's three cube materials */
const GLASSY: Pal = { top: [232, 242, 252], left: [168, 196, 232], right: [205, 224, 246] };
const M_COBALT: Pal = { top: [96, 138, 226], left: [22, 52, 130], right: [52, 98, 219] };
const M_NAVY: Pal = { top: [38, 64, 108], left: [9, 20, 42], right: [21, 47, 94] };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mixc = (a: RGB, b: RGB, t: number): RGB => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const css = (c: RGB, a: number) => `rgba(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}, ${a})`;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const smooth = (t: number) => t * t * (3 - 2 * t);

/* one 2:1 isometric cube; (x, y) is the bottom-front vertex */
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
    /* the reference's dark seams */
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

type Voxel = {
  i: number;
  j: number;
  k: number;
  pal: Pal;
  flashT: number;
  missing: boolean; // the socket is open
  claimed: boolean; // a cube is already en route to it
  dissolveT: number; // >0 while the voxel fades out to open the socket
};

type Resolver = {
  vi: number; // index of the voxel whose socket it has claimed
  tj: number; // target tile on the mark's right face
  tk: number;
  sx: number;
  sy: number;
  s: number;
  dur: number;
  wf: number;
  amp: number;
  phase: number;
  trail: Array<{ x: number; y: number }>;
};

type Mote = {
  x: number;
  y: number; // resting y (may sit on a lattice band)
  size: number;
  pal: Pal;
  vx: number;
  wf: number;
  amp: number;
  phase: number;
  alpha: number;
  depth: number; // 0 far → 1 near; drives parallax, scale and weight
};

type Dock = { col: number; row: number; pal: Pal; size: number; t: number };

type Sheet = {
  x: number;
  hFrac: number;
  pwFrac: number;
  phase: number;
  docks: Dock[];
};

export default function AssemblyField({
  still,
  onOrder,
}: {
  still: boolean;
  onOrder?: (pct: number) => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const threadsRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = wrap.current;
    const threadsCanvas = threadsRef.current;
    const liveCanvas = liveRef.current;
    if (!host || !threadsCanvas || !liveCanvas) return;

    const rand = mulberry32(20260726);
    let W = 0;
    let H = 0;
    let dpr = 1;
    let e = 20; // voxel edge of the mark, px
    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;
    let clock = 0;
    const pointer = { x: -1e4, y: -1e4, px: 0, py: 0 };
    let voxels: Voxel[] = [];
    let drawOrder: number[] = [];
    let resolvers: Resolver[] = [];
    let motes: Mote[] = [];
    let sheets: Sheet[] = [];
    let nextResolver = 2;
    let nextShuffle = 3.5;
    let glintSheet = 0;
    let glintAt = 4;
    let glintT = -1;
    let nextSocket = 2.5;

    /* the scan pulse: a cobalt wavefront sweeping the stack right → left,
     * lighting each sheet as it passes. The field's heartbeat. */
    let pulseX = -1; // -1 = idle
    let nextPulse = 1.2;
    /* the mark's reaction when a cube seats: a ripple across its face */
    let rippleT = 0;
    let rippleJ = 0;
    let rippleK = 0;

    /* the mark's anchor — voxel (0,0,0) bottom vertex, normalized */
    const ANCHOR_X = 0.175;
    /* the mark spans ±4e about this line, so matching the sheet stack's
     * centre (0.52) sits it level with the rest of the field */
    const ANCHOR_Y = 0.52;
    const STACK_END = 0.6; // organised once left of here

    const bob = () => Math.sin(clock * 0.8) * e * 0.1;

    const voxelPos = (i: number, j: number, k: number, out: { x: number; y: number }) => {
      const w = e * 0.866;
      const h = e * 0.5;
      out.x = ANCHOR_X * W + (i - j) * w;
      out.y = ANCHOR_Y * H + e + (i + j) * h - k * e + bob();
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
      e = clamp(Math.min(H * 0.08, W * 0.028), 10, 32);

      const r = mulberry32(7);

      /* the solid mark: uniform faces, gentle per-tile variance only */
      voxels = [];
      for (let k = 0; k < N; k++)
        for (let j = 0; j < N; j++)
          for (let i = 0; i < N; i++) {
            const isGap = i === 3 && ((j === 1 && k === 2) || (j === 2 && k === 1) || (j === 0 && k === 3));
            const sheenR = r() < 0.14 ? 0.12 : 0;
            voxels.push({
              i,
              j,
              k,
              flashT: 0,
              missing: isGap,
              claimed: false,
              dissolveT: 0,
              pal: {
                top: mixc([18, 42, 80], [24, 50, 92], r()),
                left: mixc([10, 21, 42], [14, 27, 52], r()),
                right: mixc(mixc([40, 87, 210], [48, 97, 222], r()), [116, 156, 240], sheenR),
              },
            });
          }
      drawOrder = voxels
        .map((_, idx) => idx)
        .sort((a, b) => voxels[a].i + voxels[a].j + voxels[a].k - (voxels[b].i + voxels[b].j + voxels[b].k));

      /* the scanning stack: exactly 6 sheets as in reference */
      const defs: Array<[number, number, number]> = [
        [0.38, 0.76, 0.046],
        [0.44, 0.82, 0.046],
        [0.50, 0.78, 0.05],
        [0.56, 0.80, 0.05],
        [0.62, 0.66, 0.046],
        [0.68, 0.60, 0.046],
      ];
      const dockCounts = [4, 12, 18, 16, 8, 4];
      sheets = defs.map(([x, hFrac, pwFrac], idx) => {
        const docks: Dock[] = [];
        const core = idx >= 2 && idx <= 5;
        /* the dense, nearly-understood work sits in dark columns:
         * contiguous vertical runs, as in the reference */
        const columns: number[] = [];
        const colCount = core ? 2 + Math.floor(r() * 2) : 1 + Math.floor(r() * 2);
        while (columns.length < colCount) {
          const c = Math.floor(r() * 6);
          if (!columns.includes(c)) columns.push(c);
        }
        const cells = new Set<string>();
        const put = (col: number, row: number) => {
          if (row < 0 || row > 9 || docks.length >= dockCounts[idx]) return;
          const key = `${col}:${row}`;
          if (cells.has(key)) return;
          cells.add(key);
          const roll = r();
          /* cobalt and glass only — the near-black cubes made the stack
           * read as clutter against the paper */
          const pal = core ? (roll < 0.62 ? M_COBALT : GLASSY) : roll < 0.45 ? M_COBALT : GLASSY;
          docks.push({ col, row, pal, size: e * (0.3 + r() * 0.16), t: 1 });
        };
        for (const col of columns) {
          const run = 3 + Math.floor(r() * 4);
          const start = Math.floor(r() * (10 - run));
          for (let rw = start; rw < start + run; rw++) put(col, rw);
        }
        while (docks.length < dockCounts[idx] * 0.9) put(Math.floor(r() * 6), Math.floor(r() * 10));
        return { x, hFrac, pwFrac, phase: r() * Math.PI * 2, docks };
      });

      /* the drifting cloud: three depth layers, so the field has
       * parallax and the flow is legible rather than a frozen scatter */
      const bands = Array.from({ length: 12 }, (_, i) => 0.15 + (i * 0.7) / 11);
      const count = clamp(Math.round((W * H) / 13000), 55, 110);
      motes = Array.from({ length: count }, () => {
        const u = r();
        const x = 0.38 + Math.pow(u, 0.8) * 0.7;
        const roll = r();
        const onBand = r() < 0.55;
        const y = onBand ? bands[Math.floor(r() * bands.length)] + (r() - 0.5) * 0.03 : 0.1 + r() * 0.8;
        const depth = Math.pow(r(), 0.85); // biased to the far field
        return {
          x,
          y,
          size: lerp(2.6, 10, depth),
          /* a little navy for depth, but mostly cobalt and glass */
          pal: roll < 0.16 ? M_NAVY : roll < 0.6 ? M_COBALT : GLASSY,
          vx: lerp(0.012, 0.042, depth), // near cubes outrun far ones
          wf: 0.35 + r() * 0.5,
          amp: lerp(1.5, 5, depth),
          phase: r() * Math.PI * 2,
          alpha: lerp(0.4, 1, depth),
          depth,
        };
      });
      // painter order: far first, so near cubes sit convincingly in front
      motes.sort((a, b) => a.depth - b.depth);

      /* resolvers will be spawned dynamically by maybeResolve */
      resolvers = [];

      /* the lattice: fine horizontal threads, painted once */
      const tctx = threadsCanvas.getContext("2d");
      if (tctx) {
        tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        tctx.clearRect(0, 0, W, H);
        const tr = mulberry32(99);
        for (const band of bands) {
          const y = band * H;
          const x0 = (0.34 + tr() * 0.2) * W;
          tctx.strokeStyle = `rgba(23, 56, 102, ${0.08 + tr() * 0.05})`;
          tctx.lineWidth = 0.8;
          tctx.beginPath();
          tctx.moveTo(x0, y);
          tctx.lineTo(W * 1.02, y);
          tctx.stroke();
        }
        /* a few finer intermediate threads */
        for (let n = 0; n < 6; n++) {
          const y = (0.14 + tr() * 0.72) * H;
          tctx.strokeStyle = `rgba(23, 56, 102, ${0.05 + tr() * 0.04})`;
          tctx.lineWidth = 0.7;
          tctx.beginPath();
          tctx.moveTo((0.4 + tr() * 0.3) * W, y);
          tctx.lineTo(W * 1.02, y);
          tctx.stroke();
        }
        /* threads running from the mark through the stack */
        for (let n = 0; n < 3; n++) {
          const y = (0.52 + (n - 1) * 0.07) * H;
          tctx.strokeStyle = `rgba(23, 56, 102, ${0.08 + tr() * 0.04})`;
          tctx.lineWidth = 0.8;
          tctx.beginPath();
          tctx.moveTo(W * (ANCHOR_X + 0.09), y);
          tctx.lineTo(W * (0.68 + tr() * 0.06), y);
          tctx.stroke();
        }
      }
    };

    /* ——— drawing ——— */

    const drawSheet = (ctx: CanvasRenderingContext2D, p: Sheet, idx: number) => {
      const x = p.x * W;
      const pw = clamp(p.pwFrac * W, 30, 96);
      const ph = p.hFrac * H * 0.5;
      const ps = pw * 0.3;
      const yc = 0.52 * H + Math.sin(clock * 0.42 + p.phase) * 4;
      /* how strongly the scan pulse is washing over this sheet */
      const boost = pulseX < 0 ? 0 : Math.exp(-Math.pow((p.x - pulseX) / 0.05, 2));

      const TLx = x - pw, TRx = x + pw;
      const TLy = yc - ph + ps, TRy = yc - ph - ps;
      const BLy = yc + ph + ps, BRy = yc + ph - ps;

      /* near-invisible glass with a crisp double frame */
      ctx.beginPath();
      ctx.moveTo(TLx, TLy);
      ctx.lineTo(TRx, TRy);
      ctx.lineTo(TRx, BRy);
      ctx.lineTo(TLx, BLy);
      ctx.closePath();
      ctx.fillStyle = `rgba(${boost > 0 ? "236, 243, 255" : "255, 255, 255"}, ${0.22 + boost * 0.3})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(62, 102, 216, ${0.5 + boost * 0.5})`;
      ctx.lineWidth = 1.1 + boost * 0.9;
      ctx.stroke();
      ctx.strokeStyle = "rgba(62, 102, 216, 0.16)";
      ctx.beginPath();
      ctx.moveTo(TLx + 3, TLy + 1);
      ctx.lineTo(TRx + 3, TRy + 1);
      ctx.lineTo(TRx + 3, BRy + 1);
      ctx.lineTo(TLx + 3, BLy + 1);
      ctx.closePath();
      ctx.stroke();

      /* fine grid */
      ctx.strokeStyle = `rgba(35, 79, 189, ${0.08 + boost * 0.34})`;
      ctx.lineWidth = 0.7;
      const cols = 6;
      const rows = 10;
      for (let c = 1; c < cols; c++) {
        const t = c / cols;
        const gx = TLx + (TRx - TLx) * t;
        ctx.beginPath();
        ctx.moveTo(gx, TLy + (TRy - TLy) * t);
        ctx.lineTo(gx, BLy + (BRy - BLy) * t);
        ctx.stroke();
      }
      for (let rw = 1; rw < rows; rw++) {
        const t = rw / rows;
        ctx.beginPath();
        ctx.moveTo(TLx, TLy + (BLy - TLy) * t);
        ctx.lineTo(TRx, TRy + (BRy - TRy) * t);
        ctx.stroke();
      }

      /* docked, nearly-understood work */
      for (const dk of p.docks) {
        const tc = (dk.col + 0.5) / cols;
        const trr = (dk.row + 0.5) / rows;
        const dx = TLx + (TRx - TLx) * tc;
        const dy = TLy + (TRy - TLy) * tc + (BLy - TLy) * trr;
        /* the pulse lifts and ignites the work it passes over */
        const lift = boost * dk.size * 0.5;
        const sz = dk.size * (1 + boost * 0.22);
        drawIsoCube(ctx, dx, dy + dk.size - lift, sz, dk.pal, smooth(clamp(dk.t, 0, 1)), 0.2 + boost * 0.4);
        if (boost > 0.05)
          drawIsoCube(ctx, dx, dy + dk.size - lift, sz, { top: [206, 226, 252], left: [150, 186, 240], right: [178, 206, 248] }, boost * 0.5);
      }

      /* node spheres on the frame */
      for (const [nx, ny] of [
        [TLx, TLy],
        [TRx, TRy],
        [TRx, BRy],
        [TLx, BLy],
        [TLx, (TLy + BLy) / 2],
        [TRx, (TRy + BRy) / 2],
      ] as const) {
        ctx.fillStyle = "rgba(43, 87, 207, 0.95)";
        ctx.beginPath();
        ctx.arc(nx, ny, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.beginPath();
        ctx.arc(nx - 0.8, ny - 0.8, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      /* an occasional glint sweeping the glass */
      if (idx === glintSheet && glintT >= 0 && glintT <= 1) {
        const t = glintT;
        const gx = TLx + (TRx - TLx) * t;
        const grad = ctx.createLinearGradient(gx - 12, 0, gx + 12, 0);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(0.5, "rgba(255,255,255,0.45)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(gx, TLy + (TRy - TLy) * t);
        ctx.lineTo(gx, BLy + (BRy - BLy) * t);
        ctx.stroke();
      }
    };

    const drawMark = (ctx: CanvasRenderingContext2D) => {
      /* the mark floats on a soft shadow */
      const p = { x: 0, y: 0 };
      voxelPos(1.5, 1.5, 0, p);
      const sy = ANCHOR_Y * H + e * 2.5;
      const lift = 0.13 - (bob() / (e * 0.14)) * 0.025;
      const grad = ctx.createRadialGradient(p.x, sy, 0, p.x, sy, e * 4.6);
      grad.addColorStop(0, `rgba(16, 34, 66, ${lift})`);
      grad.addColorStop(1, "rgba(16, 34, 66, 0)");
      ctx.save();
      ctx.translate(p.x, sy);
      ctx.scale(1, 0.22);
      ctx.translate(-p.x, -sy);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, sy, e * 4.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      for (const idx of drawOrder) {
        const v = voxels[idx];
        if (v.missing) continue;
        const pos = { x: 0, y: 0 };
        voxelPos(v.i, v.j, v.k, pos);
        /* a voxel dissolving back out to open its socket */
        const solid = v.dissolveT > 0 ? smooth(v.dissolveT) : 1;
        drawIsoCube(ctx, pos.x, pos.y, e, v.pal, solid, (0.3 + v.flashT * 0.7) * solid);

        /* the ripple: a ring of light travelling out from where a cube seated */
        let ring = 0;
        if (rippleT > 0 && v.i === N - 1) {
          const d = Math.hypot(v.j - rippleJ, v.k - rippleK);
          const front = (1 - rippleT) * 4.2; // expanding radius, in voxels
          ring = Math.max(0, 1 - Math.abs(d - front) * 1.5) * rippleT;
        }
        const glow = Math.max(v.flashT * 0.55, ring * 0.6);
        if (glow > 0)
          drawIsoCube(ctx, pos.x, pos.y, e, { top: [214, 231, 252], left: [170, 200, 240], right: [190, 214, 248] }, glow);
      }
    };

    /* alpha dip while a cube sits inside a pane of glass */
    const glassDim = (x: number) => {
      for (const p of sheets) {
        const pw = clamp(p.pwFrac * W, 30, 96) * 0.55;
        if (Math.abs(x - p.x * W) < pw) return 0.65;
      }
      return 1;
    };

    const drawLive = (dt: number) => {
      const ctx = liveCanvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.translate(pointer.px * -40, pointer.py * -25);

      /* the stack, far to near */
      for (let i = sheets.length - 1; i >= 0; i--) drawSheet(ctx, sheets[i], i);

      /* the drifting cloud */
      let organised = 0;
      for (const m of motes) {
        m.x -= m.vx * dt;
        if (m.x < 0.355) {
          m.x = 1.0 + rand() * 0.06;
        }
        if (m.x < STACK_END) organised++;
        /* near layers travel further with the pointer — parallax depth */
        const mx = m.x * W + pointer.px * -18 * m.depth;
        let my = m.y * H + Math.sin(clock * m.wf + m.phase) * m.amp;

        /* the pulse shoves and ignites what it sweeps past */
        const kick = pulseX < 0 ? 0 : Math.exp(-Math.pow((m.x - pulseX) / 0.055, 2));
        if (kick > 0.02) my -= kick * 7 * m.depth;

        if (pointer.x > 0) {
          const trueMx = mx + pointer.px * -40;
          const trueMy = my + pointer.py * -25;
          const dx = pointer.x - trueMx;
          const dy = pointer.y - trueMy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const force = (140 - dist) / 140;
            my += (dy > 0 ? -1 : 1) * force * 45;
          }
        }
        
        const fade = smooth(clamp((m.x - 0.355) / 0.05, 0, 1));
        const sz = m.size * (1 + kick * 0.18);
        drawIsoCube(ctx, mx, my, sz, m.pal, m.alpha * fade * glassDim(mx), m.size > 5 ? 0.14 : 0);
        if (kick > 0.05)
          drawIsoCube(ctx, mx, my, sz, { top: [206, 226, 252], left: [150, 186, 240], right: [178, 206, 248] }, kick * 0.45 * fade);
      }

      /* the mark */
      drawMark(ctx);

      /* cubes resolving home, absorbed into the right face */
      const t = { x: 0, y: 0 };
      for (const a of resolvers) {
        a.s = Math.min(1, a.s + dt / a.dur);
        const tv = voxels[a.vi];
        voxelPos(N - 1, a.tj, a.tk, t);

        /* The journey is two moves: a flight to a staging point held just
         * off the face along its outward normal, then a short, accelerating
         * slide straight down that normal into the socket — so the cube
         * clicks home instead of drifting to a stop in front of it. */
        const SLIDE = Math.min(0.3, 0.2 / a.dur); // ~0.2s of travel, always
        const FLY = 1 - SLIDE;
        const NX = 0.866; // the +i face normal, in screen space
        const NY = 0.5;
        const stageD = e * 1.35;
        const apx = t.x + NX * stageD;
        const apy = t.y + NY * stageD;

        let x: number;
        let y: number;
        let size: number;
        let seating = 0;

        if (a.s < FLY) {
          const f = a.s / FLY;
          const s = f * f * (3 - 2 * f); // smooth, no overshoot
          const x0 = a.sx * W;
          const y0 = a.sy * H;
          const c1x = W * 0.62;
          const c1y = y0 * 0.85 + H * 0.07;
          const c2x = apx + W * 0.08;
          const c2y = apy - H * 0.02;
          const u = 1 - s;
          x = u * u * u * x0 + 3 * u * u * s * c1x + 3 * u * s * s * c2x + s * s * s * apx;
          y = u * u * u * y0 + 3 * u * u * s * c1y + 3 * u * s * s * c2y + s * s * s * apy;
          size = lerp(4.5, e, smooth(clamp((s - 0.25) / 0.75, 0, 1)));
        } else {
          /* the click: accelerate along the normal, arriving exactly */
          seating = (a.s - FLY) / SLIDE;
          const k = seating * seating;
          x = lerp(apx, t.x, k);
          y = lerp(apy, t.y, k);
          size = e; // already socket-sized, so the hand-off is invisible
        }

        const ord = clamp(a.s / FLY, 0, 1);
        if (x / W < STACK_END) organised++;

        /* a comet trail, so the eye can follow the journey */
        a.trail.push({ x, y });
        if (a.trail.length > 14) a.trail.shift();
        /* the trail retracts as the cube seats, so nothing smears the face */
        for (let ti = 0; ti < a.trail.length - 1; ti++) {
          const q = ti / a.trail.length;
          const pt = a.trail[ti];
          ctx.fillStyle = `rgba(52, 98, 219, ${q * q * 0.3 * (1 - seating)})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y - e * 0.5, lerp(0.6, 3.2, q), 0, Math.PI * 2);
          ctx.fill();
        }

        /* it wears the socket's own colours by the time it arrives, so the
         * swap from flying cube to seated voxel is invisible */
        const pal: Pal = {
          top: mixc(GLASSY.top, tv.pal.top, ord),
          left: mixc(GLASSY.left, tv.pal.left, ord),
          right: mixc(GLASSY.right, tv.pal.right, ord),
        };
        drawIsoCube(ctx, x, y, size, pal, lerp(0.8, 1, ord) * glassDim(x), 0.3 * ord);

        if (a.s >= 1) {
          tv.missing = false; // the socket it claimed is now filled
          tv.claimed = false;
          tv.flashT = 1.5;
          /* the mark answers: a ring of light from the point of contact */
          rippleT = 1;
          rippleJ = a.tj;
          rippleK = a.tk;
        }
      }
      resolvers = resolvers.filter((a) => a.s < 1);

      for (const v of voxels) {
        if (v.flashT > 0) v.flashT = Math.max(0, v.flashT - dt * 1.8);
        if (v.dissolveT > 0) {
          v.dissolveT = Math.max(0, v.dissolveT - dt * 2.4);
          if (v.dissolveT === 0) v.missing = true; // fully faded: socket is open
        }
      }

      onOrder?.(Math.round((organised / (motes.length + resolvers.length)) * 100));
    };

    /* ——— the living system's slow decisions ——— */

    /* A cube only launches once it owns an open socket, and it holds that
     * claim until it seats. Nothing ever arrives at a solid face. */
    const maybeResolve = () => {
      if (clock < nextResolver || resolvers.length >= 4) return;
      const free = voxels.filter((v) => v.i === N - 1 && v.missing && !v.claimed);
      if (!free.length) return;
      nextResolver = clock + 0.7 + rand() * 0.8;

      const target = free[Math.floor(rand() * free.length)];
      target.claimed = true;
      resolvers.push({
        vi: voxels.indexOf(target),
        tj: target.j,
        tk: target.k,
        sx: 0.85 + rand() * 0.15,
        sy: 0.15 + rand() * 0.6,
        s: 0,
        dur: 2.6 + rand() * 1.8,
        wf: 0,
        amp: 0,
        phase: 0,
        trail: [],
      });
    };

    /* The mark keeps a few sockets open ahead of demand: a seated voxel
     * dissolves back out, so arrivals always have somewhere to go. */
    const OPEN_SOCKETS = 3;
    const maybeOpenSocket = () => {
      if (clock < nextSocket) return;
      const open = voxels.filter((v) => v.i === N - 1 && v.missing).length;
      if (open >= OPEN_SOCKETS) return;
      const seated = voxels.filter(
        (v) => v.i === N - 1 && !v.missing && v.dissolveT === 0 && v.flashT === 0,
      );
      if (!seated.length) return;
      nextSocket = clock + 1.2 + rand() * 1.4;

      const v = seated[Math.floor(rand() * seated.length)];
      v.dissolveT = 1; // fades out; the socket opens when it reaches 0
      rippleT = 1;
      rippleJ = v.j;
      rippleK = v.k;
    };

    /* the heartbeat: a wavefront crossing the stack right → left */
    const maybePulse = (dt: number) => {
      if (pulseX >= 0) {
        pulseX -= dt * 0.62;
        if (pulseX < 0.28) pulseX = -1;
        return;
      }
      if (clock >= nextPulse) {
        nextPulse = clock + 4.2 + rand() * 2.2;
        pulseX = 1.02;
      }
    };

    const maybeShuffle = (dt: number) => {
      for (const p of sheets) for (const dk of p.docks) if (dk.t < 1) dk.t = Math.min(1, dk.t + dt * 1.4);
      if (clock < nextShuffle) return;
      nextShuffle = clock + 3 + rand() * 3;
      const p = sheets[Math.floor(rand() * sheets.length)];
      if (!p.docks.length) return;
      const dk = p.docks[Math.floor(rand() * p.docks.length)];
      dk.row = Math.floor(rand() * 10); // re-sorted within its column
      dk.t = 0; // fades in at its new cell
    };

    const maybeGlint = (dt: number) => {
      if (glintT >= 0) {
        glintT += dt / 1.1;
        if (glintT > 1) glintT = -1;
        return;
      }
      if (clock >= glintAt) {
        glintAt = clock + 6 + rand() * 5;
        glintSheet = Math.floor(rand() * sheets.length);
        glintT = 0;
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000) || 0.016;
      last = now;
      clock += dt;
      pointer.px += (clamp(pointer.x / W - 0.5, -0.5, 0.5) - pointer.px) * 0.04;
      pointer.py += (clamp(pointer.y / H - 0.5, -0.5, 0.5) - pointer.py) * 0.04;
      
      if (rippleT > 0) rippleT = Math.max(0, rippleT - dt * 1.15);

      maybeOpenSocket();
      maybeResolve();
      maybePulse(dt);
      maybeShuffle(dt);
      maybeGlint(dt);
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
      // one rich, measurable frame: the field mid-flow
      clock = 20;
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
      <canvas ref={threadsRef} className="absolute inset-0 h-full w-full" />
      <canvas ref={liveRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
