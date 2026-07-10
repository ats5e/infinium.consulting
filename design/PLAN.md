# Design plan — Infinium Technology rebuild

Status: awaiting client go before any build beyond this document.

---

## 1. Signature element (one line)

**On scroll past the hero, the glass polyhedron compresses into a single
vertical line of cobalt light that lands as the first hairline divider of
the page — the brand object literally becomes the design system.**

## 2. Extracted palette (programmatic, from the logo PNG)

k-means (alpha-filtered) over `design/Infinium-Technology-Introducing-Our-Business-2.png`
via `scripts/extract-palette.mjs`. Raw clusters darkest → lightest:
`#22365D 21.8% · #2F4B83 13.7% · #2F55B6 7.5% · #365EEE 8.3% · #677EA5 3.4% ·
#73A8FB 5.9% · #93A9BF 22.3% · #9AC7F8 13.8% · #CDDEF1 3.3%`

| Token | Value | Source | Role |
|---|---|---|---|
| `--color-void` | `#05070C` | authored (hue-matched ~222°) | page background |
| `--color-abyss` | `#0A1020` | authored | raised surfaces, cards |
| `--color-navy` | `#22365D` | extracted | deep facet |
| `--color-cobalt` | `#365EEE` | extracted | brand core — hero object, data-viz strokes |
| `--color-signal` | `#73A8FB` | extracted | interactive, accent, focus ring |
| `--color-ice` | `#9AC7F8` | extracted | muted body text, hairlines |
| `--color-steel` | `#93A9BF` | extracted | secondary labels (new token — largest single cluster) |
| `--color-glass` | `#CDDEF1` | extracted | refraction highlight |
| `--color-paper` | `#FFFFFF` | wordmark | headings, lockup |

The extraction shifted the brief's fallbacks meaningfully: the logo's
cobalt is more electric (`#365EEE` vs `#1E4FD8`), and a desaturated
steel-grey facet family (`#93A9BF`, 22% of the logo) existed that the
fallback missed — it becomes the secondary-label colour, which helps keep
blue under the 8%-per-viewport budget.

Contrast (checked): ice on void 11.4:1 ✓ · signal on void 8.4:1 ✓ ·
cobalt on void 3.8:1 ✗ → cobalt is never text; text-level interaction
uses signal.

## 3. Typography

Evaluation done as specified: "fin" at 200px against the logo at 1300px on
`#05070C` (scratchpad/typecompare, screenshots reviewed). The logo wordmark
is a soft geometric sans: near-circular `n` shoulder, round tittle set
close to the stem, uniform stroke, rounded terminals.

| Face | `n` shoulder | `i` tittle | Verdict |
|---|---|---|---|
| Aeonik | — | — | not licensed; skipped (flag: happy to revisit if you own a licence) |
| General Sans 500 | squarer, grotesque drop | round, but colder aperture | closest to Palantir, least like the logo — rejected |
| **Outfit 500** | **near-circular, matches the logo's arch** | **round, tight to stem, correct size** | **chosen** |
| Poppins 500 | fully circular but wide-set | oversized, floats high | matches roundness, but too wide, too friendly, and too ubiquitous — rejected |

- **Display/headings: Outfit** (variable, OFL, self-hosted via
  `next/font/local`), weights 400–600. Hero: `clamp(3rem, 7vw, 8.5rem)`,
  line-height 0.95, tracking −0.03em, hung punctuation, optical left align.
- **Body: Inter variable** (opsz on, −0.011em at body sizes).
- **Utility/eyebrows/data: IBM Plex Mono**, uppercase, 0.14em tracking,
  11–12px. Chosen over JetBrains Mono: Plex's editorial coldness fits the
  institutional register; JetBrains Mono is optimised for code editors and
  reads "developer tooling".

Where Outfit risks softness at display sizes, the counterweights are
weight discipline (never above 600), tight tracking, and the mono face
carrying all technical labelling.

## 4. Grid

12 columns · 1440px max · 88px → 20px gutters · 1px hairlines in
`--color-ice` at 12% opacity between every major section. Numbering
appears exactly once on the site: the .1/.2/.3 differentiator argument.

## 5. Wireframe — Home

```
┌──────────────────────────────────────────────────────────────────────┐
│ [in-cube lockup]                MONO-NAV: ABOUT SERVICES PRODUCTS     │ 64px, transparent
│                                 CAREERS CONTACT   [Start a conv.]    │ → void/80 + blur
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  WE BUILD, NOT JUST ADVISE            ·mono eyebrow·                 │
│                                          ┌────────────────┐          │ 100svh
│  Data engineering.                       │   R3F glass    │          │ hero
│  For tomorrow.                           │   polyhedron   │          │
│                                          │  (cols 8–12)   │          │
│  We deliver across data engineering,    └────────────────┘          │
│  data science, digital transformation…   (display cols 1–7)         │
│  [Start a conversation]   ↓ scroll                                   │
│              ⟨object compresses to a vertical line of light…⟩        │
├──────────────────────────────⟨…which lands as this hairline⟩─────────┤
│   THREE PILLARS (unnumbered set, 3 cols, hairline-separated)         │
│  We build, not     DIFC-native.     Financial services               │
│  just advise.                       only.                            │
├──────────────────────────────────────────────────────────────────────┤
│  WHY INFINIUM  ·mono·                                                │
│  Most technology consultancies offer the same thing…                 │
│  (2-col: narrative left, 40+ / 17 counters right, tabular-nums)      │
├──────────────────────────────────────────────────────────────────────┤
│  A FEW THINGS WE'RE GREAT AT  — PINNED SECTION                       │
│  .1  We speak financial services fluently     ┌──────────────┐       │
│  .2  We build the technology, not just…       │ swapping     │       │
│  .3  We stay until it works                   │ glass asset  │       │
│  (scroll advances .1→.3, clip-path graphic swap, clean unpin)        │
├──────────────────────────────────────────────────────────────────────┤
│  WE SERVE ·mono·          │  WE BUILD ·mono·                         │
│  End-to-end engagements…  │  Proprietary product suite…              │
│  4 service links          │  QBricks → · TBricks →                   │
├──────────────────────────────────────────────────────────────────────┤
│  OUR TEAM — David · Benjamin (duotone void→ice headshots)            │
├──────────────────────────────────────────────────────────────────────┤
│  If you have a challenge worth solving, we'd like to hear about it.  │
│  [Get in touch]                                                      │
├──────────────────────────────────────────────────────────────────────┤
│  footer: lockup · mono sitemap · sales@infinium.technology ·         │
│  Level 02, Innovation One, DIFC · LinkedIn · © 2026 Infinium         │
└──────────────────────────────────────────────────────────────────────┘
```

## 6. Wireframe — /products/qbricks (interior template)

```
┌──────────────────────────────────────────────────────────────────────┐
│ nav (as Home, solid void/80 from load on interior pages)             │
├──────────────────────────────────────────────────────────────────────┤
│  WE BUILD / QBRICKS  ·mono breadcrumb·                               │
│  QBricks                                    ┌───────────────┐        │
│  One-line product thesis set in Outfit      │ 4:3 generated │        │
│  at clamp(2.5–5rem).                        │ brick lattice │        │
│                                             └───────────────┘        │
├──────────────────────────────────────────────────────────────────────┤
│  WHAT IT DOES ·mono·                                                 │
│  capability rows, hairline-separated, mono labels + Inter body       │
│  (claims pending client mapping — defect #7)                         │
├──────────────────────────────────────────────────────────────────────┤
│  IN PRODUCTION ·mono·                                                │
│  "Running in production at tier-1 financial institutions."           │
│  (no client names — confidential; the sentence is the proof)         │
├──────────────────────────────────────────────────────────────────────┤
│  Related: TBricks →   (card, hairline border, 2px lift on hover)     │
├──────────────────────────────────────────────────────────────────────┤
│  Start a conversation about QBricks. [Get in touch]                  │
└──────────────────────────────────────────────────────────────────────┘
```

## 7. Self-critique ("would I do this for any other B2B data company?")

- **Near-black page + hairlines + mono eyebrows** — yes, I would; it's the
  Palantir grammar the brief asked for. What makes it non-generic here is
  the *refraction thesis*: every image is glass optics derived from the
  actual logo object, and the signature hero-to-hairline compression makes
  the brand mark generate the layout language. No other company's logo is
  this cube; kept.
- **Cobalt as accent** — any data company uses blue. Ours is defensible
  only because it is literally extracted from the logo, and the discipline
  (≤8% per viewport, never text) is the differentiator, not the hue. Kept,
  with the steel-grey cluster doing secondary work most blue sites don't have.
- **Outfit** — risk: it's a popular Google font. But it was chosen by
  letterform comparison against the wordmark, not by taste; General Sans
  failed that comparison. Mitigation: weight ceiling 600 + mono utility
  face carries the credibility. If an Aeonik licence exists, I'd re-run
  the comparison.
- **Count-up numerals (40+/17)** — every B2B site does this. Kept only
  because the numbers are real and already in Infinium's copy; constrained
  to one occurrence, once per session, tabular-nums.
- **Full-screen R3F hero object** — genuinely earned here (the logo IS a
  3D glass object), but it's also the most copied award-site move. The
  differentiator is the exit behaviour (compression to hairline), which I
  have not seen elsewhere; if that transition fails review, the object
  should be cut to a static generated frame rather than left as a
  spinning ornament.
- **Changed from the brief's defaults:** added `--color-steel` token
  (evidence-based), picked IBM Plex Mono over JetBrains Mono, unnumbered
  the services page's .1–.4 (the brief's rule: numbering only for genuine
  sequences).

## 8. Open questions for the client (blocking where marked)

1. **BLOCKING (products copy):** map the claims — automated ETL, Automated
   Model Testing, Compute Optimisation, ESG Reporting — to QBricks vs
   TBricks. My guess: QBricks = ETL + compute optimisation,
   TBricks = model testing (+ ESG?), but I won't publish a guess.
2. Phone: omitted entirely (live site has `+971 [REVIEW — add number]`
   over a junk `tel:`). Supply a number if you want the block back.
3. LinkedIn: live site links to your *admin dashboard* URL. I'll use
   `https://www.linkedin.com/company/113267940/` — confirm or give the
   vanity URL.
4. Do you hold an Aeonik (or Söhne) licence? If yes I'll re-run the type
   comparison before Phase 2 lands.
5. PRs per phase need a GitHub remote — none configured. Create
   `infinium-website` (private) or tell me the remote.
6. Brief pins Next.js 15 (scaffolded: 15.5.20). Next 16 is current; happy
   to move if you'd rather launch on the current major.
