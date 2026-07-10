# Art direction — Infinium Technology

> **Thesis: "Refraction under pressure — a data estate rendered as optical glass."**

## The visual world

Precision-engineered translucent solids in a black void, lit like product
photography from a physics lab. Every image is an optical event: light
entering disorder and leaving as structure.

**Never:** neon circuit boards, glowing brains, hooded hackers, skylines,
stock-photo composition, gradient meshes, lens-flare cliché, people, faces,
user interfaces, text-in-image.

## Provenance rules (hard)

- No Palantir assets — no lifted CSS, scraped components, downloaded images,
  reused copy, or their licensed typefaces. We reconstruct a design
  *language*, not their artifacts.
- Every visual asset is generated (Krea MCP), authored in code
  (Canvas/WebGL/SVG), or derived from Infinium's own logo file.
- Krea originals → `design/raw/` (gitignored). Optimised AVIF/WebP
  derivatives → `public/img/` (committed).

## Global prompt suffix (append to every Krea generation)

> Shot on a Phase One with a 120mm macro. Pure black seamless background,
> #05070C. Single hard key light from upper-left, cobalt rim light from the
> right. Volumetric haze, visible caustics, chromatic dispersion at the
> edges. Extreme depth of field falloff. Physically accurate glass
> refraction. Cinematic, restrained, editorial. No text, no letters, no
> logos, no watermarks, no people, no faces, no user interfaces, no circuit
> boards, no neon, no lens flare cliché, no stock-photo composition.

## Krea pipeline (Phase 3)

1. Model: `google/imagen-4-ultra` (confirmed available). Fallback:
   `bfl/flux-1.1-pro-ultra`.
2. `get_model_schema` before first call; set aspect ratio explicitly per asset.
3. Max native resolution → `enhance_image` (`topaz/standard-enhance`,
   faithful upscaler) for hero assets only.
4. Post-process with `sharp`: AVIF + WebP, strip metadata, 20px LQIP for
   `placeholder="blur"`.
5. Three variants per slot; contact sheet for review. Hero winner is
   chosen by the client, not by us.

## Asset slots

See the brief (§5) for the ten slots and their prompts. Team photos are NOT
generated — existing headshots of David and Benjamin get a duotone
treatment (`--color-void` → `--color-ice`).
