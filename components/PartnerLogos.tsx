import Image from "next/image";

/*
 * One source of truth for technology marks. The source artwork is normalised
 * through a shared tonal treatment so mixed partner palettes remain calm on
 * the light interface, while each mark keeps its native proportions.
 */
export const TECHNOLOGY_LOGOS = [
  { slug: "alteryx", name: "Alteryx", src: "/partners/alteryx.png", w: 449, h: 137, stripClass: "h-7" },
  { slug: "appian", name: "Appian", src: "/partners/appian.webp", w: 1257, h: 484, stripClass: "h-7" },
  { slug: "databricks", name: "Databricks", src: "/partners/databricks.png", w: 531, h: 87, stripClass: "h-5" },
  { slug: "microsoft-fabric", name: "Microsoft", src: "/partners/microsoft.png", w: 1023, h: 220, stripClass: "h-6" },
  { slug: "quantexa", name: "Quantexa", src: "/partners/quantexa.png", w: 527, h: 87, stripClass: "h-5" },
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
    <ul className="grid grid-cols-2 gap-px lg:grid-cols-5">
      {TECHNOLOGY_LOGOS.map((logo) => (
        <li
          key={logo.slug}
          className={`flex min-h-24 items-center justify-center border hairline bg-white/78 shadow-[0_8px_24px_rgba(23,56,102,0.045)] backdrop-blur-sm ${tileClass}`}
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
