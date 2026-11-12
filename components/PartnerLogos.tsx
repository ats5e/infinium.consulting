import Image from "next/image";

/*
 * One source of truth for technology marks. The source artwork is normalised
 * through a shared tonal treatment so mixed partner palettes remain calm on
 * the light interface, while each mark keeps its native proportions.
 */
/* 480px-wide WebP renditions (2x for the largest slot the marks appear
 * in); the full-size originals stay beside them as sources. */
export const TECHNOLOGY_LOGOS = [
  { slug: "alteryx", name: "Alteryx", src: "/partners/alteryx-480.webp", w: 449, h: 137, stripClass: "h-7" },
  { slug: "appian", name: "Appian", src: "/partners/appian-480.webp", w: 480, h: 185, stripClass: "h-7" },
  { slug: "databricks", name: "Databricks", src: "/partners/databricks-480.webp", w: 480, h: 79, stripClass: "h-5" },
  { slug: "microsoft-fabric", name: "Microsoft", src: "/partners/microsoft-480.webp", w: 480, h: 103, stripClass: "h-6" },
  { slug: "quantexa", name: "Quantexa", src: "/partners/quantexa-480.webp", w: 480, h: 79, stripClass: "h-5" },
] as const;

export function TechnologyLogo({
  slug,
  className = "h-8",
  decorative = false,
  sizes = "(min-width: 768px) 24vw, 70vw",
}: {
  slug: string;
  className?: string;
  decorative?: boolean;
  sizes?: string;
}) {
  const logo = TECHNOLOGY_LOGOS.find((item) => item.slug === slug);
  if (!logo) return null;

  return (
    <Image
      src={logo.src}
      alt={decorative ? "" : logo.name}
      width={logo.w}
      height={logo.h}
      loading="lazy"
      sizes={sizes}
      className={`partner-logo w-auto max-w-full object-contain opacity-95 ${className}`}
    />
  );
}

export function PartnerLogos({ tileClass = "p-7" }: { tileClass?: string }) {
  return (
    <ul className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {TECHNOLOGY_LOGOS.map((logo) => (
        <li
          key={logo.slug}
          className={`flex min-h-24 items-center justify-center rounded-2xl bg-white ${tileClass}`}
        >
          <TechnologyLogo
            slug={logo.slug}
            className={logo.stripClass}
            sizes="(min-width: 1024px) 16vw, 42vw"
          />
        </li>
      ))}
    </ul>
  );
}
