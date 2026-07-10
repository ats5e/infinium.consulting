# Infinium Technology — website

Ground-up rebuild of [infinium-technology.com](https://infinium-technology.com).
Financial-services-only technology firm in the DIFC; proprietary platforms
QBricks and TBricks. Visual thesis: **refraction under pressure — a data
estate rendered as optical glass.**

## Stack

- **Next.js 16** (App Router, TypeScript strict, all routes static)
- **Tailwind CSS v4** — tokens in `app/globals.css` `@theme`; provenance in `design/tokens.css`
- **GSAP + ScrollTrigger** (hero compression, pinned differentiators) · **Lenis** (`lerp: 0.08`)
- **react-three-fiber + drei** — hero object only, ≥768px + fine pointer + no reduced-motion
- **sharp** build-time imaging → AVIF/WebP + LQIP manifest
- Type: Outfit (display) / Inter (body) / IBM Plex Mono (utility), self-hosted latin-subset woff2 (132KB total)
- Contact: server action + Zod, honeypot, rate limit, Resend
- Vercel Analytics + Speed Insights (mount only on Vercel); no cookies, no banner needed — keep it that way

## Commands

```sh
pnpm dev            # dev server
pnpm build && pnpm start
pnpm test           # Playwright smoke + axe (desktop + mobile), serves :3100
pnpm lhci           # Lighthouse budget — fails below 95 on perf/a11y/bp/seo (mobile)
node scripts/capture.mjs   # screenshots at 390/768/1440/1920 + hero video → design/screens
```

CI (`.github/workflows/ci.yml`) runs build → Playwright → LHCI on every PR.

## Imagery — regenerating via Krea

Every visual asset is generated (no stock). The single source of truth is
`design/assets.json`: model (`bfl/flux-1.1-pro-ultra`, `raw: true`), the
global prompt suffix, per-slot prompts, sizes, seeds, and the decision log.

1. Generate via Krea MCP (`generate_image`) with the slot's prompt + suffix
   + seed at the slot's width/height. Note: Krea's `google/imagen-4-ultra`
   caps at 1280×720 — that's why FLUX. Concurrency limit is 4 jobs.
2. Save originals as `design/raw/<slot>-v<n>.png` (gitignored).
3. `node scripts/process-images.mjs` → AVIF/WebP (full + half, capped
   3200w), LQIP manifest at `public/img/manifest.json`.
4. Winning variants are pinned in `lib/images.ts` (`CHOSEN`).
5. Hero master went through `topaz/standard-enhance` (High Fidelity V2);
   `scripts/process-team.mjs` cuts the OG base from it and duotones the
   team headshots (void → ice).

QBricks imagery deliberately carries the QBricks product identity
(#D6111F / #FF4A50, extracted from qbricks.vercel.app) — the one
non-cobalt slot.

## Swapping the palette

The palette was extracted from the logo with `scripts/extract-palette.mjs`
(alpha-filtered k-means). To re-derive: replace the logo PNG in `design/`,
run the script, update the `@theme` block in `app/globals.css` and the
gradients in `components/Lockup.tsx` + `app/icon.svg`. Discipline rules
live in `design/tokens.css`; motion rules in `design/MOTION.md`.

## Deployment (Vercel)

- Import the repo; framework auto-detects. No required env vars to render.
- Contact form: set `RESEND_API_KEY` (+ optional `CONTACT_FROM`,
  `CONTACT_TO`). Without a key, submissions log to the server console.
- Domain: `infinium-technology.com` — update `SITE` in `app/layout.tsx`,
  `app/sitemap.ts`, `app/robots.ts` if it ever changes.
