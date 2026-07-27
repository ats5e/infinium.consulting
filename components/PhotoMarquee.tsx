import { GlassImage } from "@/components/GlassImage";
import { siteImage } from "@/lib/images";

/*
 * A full-bleed ribbon of photography that drifts slowly sideways.
 *
 * It carries a lot of pictures without spending much vertical space, which
 * is what a culture story needs — the alternative is another tall grid.
 *
 * The track holds the set twice and animates to -50%, so the loop is
 * seamless; the second copy is aria-hidden so screen readers hear each
 * caption once. Motion parks on hover and under prefers-reduced-motion
 * (see .marquee-track in globals.css), where the strip becomes a normal
 * horizontally scrollable row instead.
 */
export type MarqueeShot = { slot: Parameters<typeof siteImage>[0]; alt: string };

export function PhotoMarquee({
  shots,
  label,
}: {
  shots: readonly MarqueeShot[];
  label: string;
}) {
  const run = (duplicate: boolean) =>
    shots.map((shot) => (
      <figure
        key={`${duplicate ? "b" : "a"}-${shot.slot}`}
        className="relative h-44 w-64 shrink-0 overflow-hidden border hairline bg-abyss/25 sm:h-56 sm:w-80"
      >
        {/* eager: the track is far wider than the viewport, so tiles to the
            right never intersect and native lazy loading never fires — they
            would drift into view still showing their LQIP. sizes keeps this
            to the 800w variant. */}
        <GlassImage
          image={siteImage(shot.slot)}
          alt={duplicate ? "" : shot.alt}
          sizes="320px"
          priority
          className="block h-full w-full"
          imageClassName="!h-full !w-full object-cover"
        />
      </figure>
    ));

  return (
    <section aria-label={label} className="overflow-hidden border-t hairline py-14 md:py-16">
      <div className="marquee-viewport overflow-x-auto">
        <div className="marquee-track flex w-max gap-4 px-4">
          {run(false)}
          <div aria-hidden className="marquee-dupe">
            {run(true)}
          </div>
        </div>
      </div>
    </section>
  );
}
