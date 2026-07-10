# Motion — Infinium Technology

One curve. Four durations. No bounce. No spring. Ever.

```
--ease:        cubic-bezier(0.16, 1, 0.3, 1);
--dur-fast:    200ms;
--dur-base:    400ms;
--dur-slow:    800ms;
--dur-grand:   1200ms;
```

## Page load (runs once per session — sessionStorage flag)

1. Hairlines draw in horizontally — 800ms
2. Display type reveals by line via `clip-path` masks — 60ms stagger
3. Hero object fades up from `opacity 0, scale 1.04` — 1200ms
4. Nav
Total under 2s.

## Signature element

The hero polyhedron is a real R3F object.
- Rotation: `0.0008 rad/frame`
- Cursor: damped `lerp` on rotation, max ±8°
- Scroll: internal refraction shifts
- Exit: on scroll past the hero it **compresses to a single vertical line
  of light** that becomes the first hairline divider of the next section.
- Canvas: `dpr [1, 1.75]`, rAF paused when off-screen or `document.hidden`,
  never mounted below 768px — static generated frame instead.

## Scroll reveals

`y: 24px → 0`, `opacity: 0 → 1`, 800ms, trigger at 20% into viewport,
80ms stagger within a group. Reveal *groups*, never every element.

## Hover

- Links: underline wipes in from left (`scaleX`, `transform-origin` swap on exit).
- Cards: lift 2px; hairline border `--color-ice/12` → `--color-signal/60`.
- Nothing scales up. Nothing glows.

## Pinned differentiators (.1 / .2 / .3)

Pin the section, advance through the three on scroll, swap the graphic with
a `clip-path` reveal. Unpin cleanly. Test on trackpad, mouse wheel, touch.

## Numerals

Count up once on entry, 1200ms, ease-out, `tabular-nums` (no reflow).

## Smooth scroll

Lenis, `lerp: 0.08`.

## Reduced motion (hard requirement)

Every scroll trigger, parallax, and WebGL loop has a static fallback that
still looks intentional under `prefers-reduced-motion: reduce`. Load
sequence collapses to instant, fully-composed state. Counters render final
values. Hero serves the static frame.
