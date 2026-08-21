import { GlassImage } from "@/components/GlassImage";
import { siteImage } from "@/lib/images";

/*
 * An editorial collage of company photography.
 *
 * Replaces the auto-scrolling marquee, which read as clunky: it moved
 * whether or not anyone was looking, showed every photo at one size, and
 * put the reader on its schedule rather than their own.
 *
 * Here the tiles are deliberately unequal — a repeating twelve-column
 * rhythm of wide, tall and small — so the set reads as a designed spread
 * and the best frames get room. Each tile drifts vertically at its own
 * rate as the section passes through the viewport, which gives the grid
 * depth. That is a CSS scroll-driven animation (animation-timeline:
 * view()), so it runs on the compositor with no JavaScript and no
 * scroll listeners; browsers without support simply get the static
 * grid, as does anyone with prefers-reduced-motion.
 *
 * Captions sit under a gradient and lift on hover or keyboard focus.
 */
/* `position` overrides object-position for crops that would otherwise cut
 * heads off — e.g. "50% 22%" biases the visible band toward the top. */
export type CollageShot = { slot: Parameters<typeof siteImage>[0]; alt: string; caption: string; position?: string };

/* Column and row spans, cycled across the set. Tiles fill their grid cell
 * rather than carrying their own aspect ratio — with unequal widths, equal
 * aspects give unequal heights and the short tile leaves a hole.
 * This pattern is hand-tuned for exactly six photos (the only count
 * CULTURE_COLLAGE ever passes in): 7+5 across row 1, 4+4+4 across row 2,
 * a full-width 12 to close row 3. Every row's spans sum to 12, so dense
 * auto-flow has no leftover cell to leave as a gap — unlike a plain
 * repeating cycle, which only tiles cleanly for the count it was tuned to
 * and leaves a dangling hole under the last tile for any other count.
 * Drift alternates sign so neighbours separate rather than moving as a slab. */
const RHYTHM = [
  { span: "md:col-span-7 md:row-span-2", drift: "18px" },
  { span: "md:col-span-5 md:row-span-2", drift: "-26px" },
  { span: "md:col-span-4", drift: "-14px" },
  { span: "md:col-span-4", drift: "22px" },
  { span: "md:col-span-4", drift: "-20px" },
  { span: "md:col-span-12 md:row-span-2", drift: "16px" },
] as const;

export function PhotoCollage({
  shots,
  label,
}: {
  shots: readonly CollageShot[];
  label: string;
}) {
  return (
    <section aria-label={label} className="border-t hairline">
      <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-16 md:py-20">
        <div className="grid grid-cols-1 gap-3 [grid-auto-flow:dense] sm:grid-cols-2 md:auto-rows-[11rem] md:grid-cols-12 md:gap-4">
          {shots.map((shot, i) => {
            const r = RHYTHM[i % RHYTHM.length];
            return (
              <figure
                key={shot.slot}
                style={{ "--drift": r.drift } as React.CSSProperties}
                className={`collage-tile group relative overflow-hidden border hairline bg-abyss/25 md:h-full ${r.span}`}
              >
                <GlassImage
                  image={siteImage(shot.slot)}
                  alt={shot.alt}
                  sizes="(min-width: 768px) 45vw, (min-width: 640px) 50vw, 100vw"
                  className="block md:h-full"
                  imageStyle={shot.position ? { objectPosition: shot.position } : undefined}
                  imageClassName="aspect-[4/3] object-cover transition-transform duration-(--duration-grand) ease-(--ease-out-expo) group-hover:scale-[1.04] md:!aspect-auto md:!h-full"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-overlay/85 to-transparent opacity-0 transition-opacity duration-(--duration-base) group-hover:opacity-100"
                />
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-5 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-on-dark opacity-0 transition-[opacity,transform] duration-(--duration-base) ease-(--ease-out-expo) group-hover:translate-y-0 group-hover:opacity-100">
                  {shot.caption}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
