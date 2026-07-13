# Infinium Design System

Design system for **Infinium Consulting B.V.** — a professional consultancy serving the **Banking and Financial Services** sectors. Corporate, precise, trustworthy. Light tones of blue and black, drawn from the brand logo (black geometric wordmark + glassy blue 3D cube).

## Sources
- `uploads/Infinium_brand_logo.png` — the only provided brand asset (wordmark + cube, 641×139, transparent PNG).
- No codebase, Figma, decks, or font binaries were provided. Everything beyond the logo is authored from the brand brief ("corporate feel, light tones of blue and black, Banking/FS consultancy").

## Content fundamentals
- **Tone:** assured, measured, advisory. Statements, not exclamations. No hype words ("revolutionary", "game-changing"); prefer "proven", "measurable", "disciplined".
- **Voice:** first-person plural ("We help banks…"), addressing the client as "you/your". Never "I".
- **Casing:** sentence case for headings and buttons ("Talk to our team", not "Talk To Our Team"). Uppercase reserved for small eyebrow labels with wide tracking (e.g. `RISK & COMPLIANCE`).
- **Emoji:** never.
- **Copy examples:**
  - Hero: "Clarity in complex financial systems."
  - Eyebrow + heading: `WHAT WE DO` / "Advisory built for regulated industries"
  - CTA: "Start a conversation" / "Read the briefing"
  - Stat framing: "€2.4B assets under advisory · 40+ engagements · 12 markets"
- **Vibe:** a partner who has done this before. Calm confidence; substance over decoration.

## Visual foundations
- **Color:** white pages with generous light-blue (`--blue-50/100`) tinted panels; near-black ink (`--ink-950`) for headings; a single working accent `--accent` (#275EBF). Deep navy `--surface-dark` (#0A1730) for footers, hero bands, and inverted sections. Status colors are muted (`--green-600`, `--amber-600`, `--red-600`) — used sparingly for data, never decoration.
- **Type:** Poppins (semibold, tight tracking) for display; IBM Plex Sans for body; IBM Plex Mono for figures/data. Headings are `--weight-semibold`, never bold-900. See `tokens/typography.css` for the scale and composite `--style-*` shorthands.
- **Spacing:** 4px base scale (`--space-1…10`); sections breathe at 96px (`--section-pad`); max content width 1200px.
- **Backgrounds:** flat color fields only — white, `--ink-50`, `--blue-50`, or deep navy. **No gradients**, no textures, no patterns, no illustration. Photography (if used) should be cool-toned, architectural/abstract; none is included here — use placeholders and request real imagery.
- **Borders & cards:** cards are white, 1px `--border-subtle`, `--radius-lg` (10px), `--shadow-sm`; hover lifts to `--shadow-md`. Radii are restrained: 4/6/10px, pills only for tags/badges. No colored left-border accent cards.
- **Shadows:** cool-tinted, low elevation (`--shadow-sm/md/lg`). No inner shadows, no glows.
- **Motion:** fast and understated — 120–320ms, `--ease-out`, opacity/translate fades only. No bounces, no infinite loops.
- **Hover states:** darker fills (`--accent-hover`), subtle background tints (`--accent-subtle`), shadow lift on cards. **Press:** darker again (`--accent-active`); no shrink transforms.
- **Focus:** 3px light-blue ring (`--focus-ring`).
- **Transparency/blur:** avoided, except `--border-on-dark` (14% white) on navy surfaces. No glassmorphism — the "glass" belongs to the logo cube only.
- **Layout:** left-aligned text blocks; 12-col grid feel; stat rows use mono figures; dark navy footer.

## Iconography
- No brand icon set was provided. The system uses **Lucide** (CDN, stroke-based, 1.5px stroke, 20px default) — its precise line style suits the corporate tone. Load via `https://unpkg.com/lucide@latest` or inline copies. **Flagged substitution** — replace if a brand set exists.
- No emoji, no unicode-as-icon. Icons always paired with labels in navigation; standalone icons only in `IconButton` with `aria-label`.
- Logo: `assets/infinium-logo.png` (dark wordmark, for light backgrounds). No light/inverse variant was provided — on dark surfaces, render "Infinium" in Poppins SemiBold white rather than recoloring the PNG.

## Index
- `styles.css` — global entry (imports everything under `tokens/`).
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `fonts.css`, `base.css`.
- `assets/` — `infinium-logo.png`.
- `guidelines/` — foundation specimen cards (Design System tab).
- `components/forms/` — Button, IconButton, Input, Select, Checkbox, Radio, Switch.
- `components/display/` — Card, Badge, Tag.
- `components/navigation/` — Tabs.
- `components/feedback/` — Dialog, Toast, Tooltip.
- `ui_kits/website/` — marketing site (interactive homepage).
- `SKILL.md` — agent skill entry point.

## Intentional additions
No source defined a component inventory, so a standard corporate set was authored (listed above), sized to a consultancy website + client-facing collateral.

## Caveats
- **Fonts are Google Fonts substitutions** (Poppins / IBM Plex Sans / IBM Plex Mono) — no brand binaries were provided.
- **Lucide icons are a substitution** — no brand icon set exists.
- The website UI kit is an original design in-brand, not a recreation (no existing product was provided).
