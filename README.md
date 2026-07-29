# Infinium Technology — website

Production site for [infinium-technology.com](https://infinium-technology.com).
Financial-services technology and consulting firm, head office in Amsterdam
(Infinium Consulting B.V.) with a second office in the DIFC, Dubai
(Infinium Technology Ltd). Proprietary solutions: **QBricks** and **VBricks**.

Visual thesis: **refraction under pressure — a data estate rendered as
optical glass.**

## Stack

- **Next.js 16** (App Router, TypeScript strict, all routes static/SSG)
- **Tailwind CSS v4** — tokens in `app/globals.css` `@theme`; provenance in `design/tokens.css`
- **GSAP** — hero copy reveal, lockup, scroll reveals. All motion is gated on `prefers-reduced-motion`.
- **Canvas 2D** — the homepage hero graphic (`components/hero/AssemblyField.tsx`). No WebGL, no 3D libraries.
- **sharp** build-time imaging → AVIF/WebP + LQIP manifest
- Type: Outfit (display), Geist, Inter, Quicksand (the QBricks wordmark) — self-hosted latin-subset woff2
- Contact: server action + Zod, honeypot, rate limit, delivery via Formspree
- Vercel Analytics + Speed Insights, mounted only on Vercel

## Commands

```sh
pnpm dev                    # dev server on :3000
pnpm build && pnpm start    # production build + serve
pnpm lint                   # ESLint
pnpm exec tsc --noEmit      # type check
pnpm test                   # Playwright smoke + axe (desktop + mobile), serves :3100
pnpm lhci                   # Lighthouse budget, serves :3200
node scripts/capture.mjs    # screenshots at 390/768/1440/1920 → design/screens
```

Lighthouse thresholds (`lighthouserc.json`): performance ≥ 90; accessibility,
best-practices and SEO ≥ 95. Current mobile scores are 96–99 / 100 / 100 / 100.

CI (`.github/workflows/ci.yml`) runs lint → types → production dependency
audit → build → Playwright → Lighthouse on every push to `main` and every PR.

## Editing content

**All page copy lives in the codebase — there is no CMS.** Changing a
headline is a developer task: edit the TSX, commit, push, and CI deploys it.

- Page markup and copy: `components/wireframe/Pages.tsx`. One exported
  function per page, plus `routeFor()` (path → renderer + metadata) and
  `ALL_PATHS` (drives `generateStaticParams` and the sitemap).
- Structured content (services, sectors, technologies, case studies,
  perspectives): `lib/content.ts`.
- Shared section components: `components/wireframe/Primitives.tsx`.

### Adding a page

Three edits, all in `components/wireframe/Pages.tsx`, and they must agree:

1. Write the page function.
2. Add the path to `routeFor()` with its `title` and `description`.
3. Add the path to `ALL_PATHS`.

Miss step 3 and the page renders in dev but 404s in production, and is
absent from the sitemap. Routes with their own directory under `app/`
(`/`, `/about`, `/services`, `/careers`, `/contact`, `/privacy`) are listed
in `DEDICATED` in `app/[...slug]/page.tsx` and take their metadata from
their own `page.tsx`.

## Imagery

Every abstract/illustrative asset is generated (no stock); office, team and
event photography is real. The decision log is `design/assets.json`.

1. Put sources in `design/raw/<slot>-v<n>.{png,jpg}` (gitignored).
2. `node scripts/process-images.mjs` → AVIF/WebP at full/half/800w plus an
   LQIP manifest at `public/img/manifest.json`.
3. Pin the winning variant per slot in `lib/images.ts` (`CHOSEN`).

**Two cautions.**
A full `process-images.mjs` run rewrites the whole manifest and will drop
slots whose sources are SVG or otherwise absent from `design/raw` (the
`cs-*` case-study entries) — it has broken the build before. Process new
images additively, or restore the dropped entries afterwards and verify
`pnpm build` before committing.
The original generation step used Krea MCP, an agency-internal tool. The
prompts and settings are recorded in `design/assets.json`, but regenerating
imagery from scratch requires equivalent access — the derivative pipeline
(steps 2–3) is fully reproducible without it.

`public/img` also retains the rejected variants for each slot, so a slot can
be re-pinned via `CHOSEN` without regenerating. They are unreferenced at
runtime and cost nothing to serve.

### Which image component?

- `GlassImage` (`components/GlassImage.tsx`) for pipeline assets — serves the
  pre-built AVIF/WebP pair with an LQIP placeholder. `next/image` would
  re-encode what sharp already produced.
- `next/image` for one-off assets not in the manifest (team portraits,
  partner logos, awards).

## Swapping the palette

Extracted from the logo with `scripts/extract-palette.mjs` (alpha-filtered
k-means). To re-derive: replace the logo PNG in `design/`, run the script,
then update the `@theme` block in `app/globals.css`, the gradients in
`components/Lockup.tsx`, and `app/icon.svg`. Discipline rules in
`design/tokens.css`; motion rules in `design/MOTION.md`.

## Deployment (Vercel)

- Import the repo; the framework auto-detects. The site, including the
  contact form, renders and works with no env vars — the Formspree endpoint
  is hardcoded as a default and only needs overriding to point at a
  different form (see below).
- Copy `.env.example` to `.env.local` for development, and set the same keys
  in the Vercel project (Settings → Environment Variables).
- Security headers, including the Content-Security-Policy, are defined in
  `next.config.ts`. If you add a third-party script, embed or API, its
  origin must be added there or the browser will block it.
- Domain is hardcoded as `SITE` in `app/layout.tsx`, `app/sitemap.ts` and
  `app/robots.ts` — update all three if it changes.

### Contact form

Enquiries POST from the server action to Formspree
(`https://formspree.io/f/xrendqrr` by default, override with
`FORMSPREE_ENDPOINT`), which owns spam filtering and delivers to whatever
inbox the Formspree form is configured with. If the POST fails, the visitor
sees an error asking them to email directly — enquiries are never silently
dropped.

There is no CRM or database, so Formspree's own dashboard/inbox delivery is
the only record of an enquiry, including the marketing opt-in.

## Known gaps before client sign-off

Tracked separately, but noted here so they are not lost:

- Dutch/EU imprint details (KvK number, BTW/VAT number, registered address)
  are not published anywhere. A B.V. is legally required to show them.
- No cookie policy or terms of use; the privacy notice needs a controller
  identity, legal basis, retention periods and the UAE transfer disclosure.
- Content awaiting client verification: open vacancies, leadership titles,
  the academic partner name on `/about/social-responsibility`, award
  currency, the "30 technologies" figure on the homepage, and rights to the
  DIFC footage on `/about/dubai`.
- The `/insights` perspectives list renders headlines that link nowhere.
- Internal naming: the image slot for VBricks is still `tbricks`, and
  `components/wireframe/` holds production markup despite the name.
