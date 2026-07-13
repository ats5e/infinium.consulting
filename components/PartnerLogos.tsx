/*
 * Certified partner strip. Logos render as a uniform monochrome-white
 * row (standard for dark-ground partner bands) via CSS filter, so mixed
 * brand palettes never fight the void background.
 */
const PARTNERS = [
  { name: "Quantexa", src: "/partners/quantexa.png", w: 527, h: 87, cls: "h-5" },
  { name: "Alteryx", src: "/partners/alteryx.png", w: 449, h: 137, cls: "h-7" },
  { name: "Microsoft Fabric", src: "/partners/fabric.png", w: 559, h: 146, cls: "h-8" },
  { name: "Databricks", src: "/partners/databricks.png", w: 531, h: 87, cls: "h-5" },
] as const;

export function PartnerLogos({ tileClass = "p-7" }: { tileClass?: string }) {
  return (
    <ul className="grid grid-cols-2 gap-px lg:grid-cols-4">
      {PARTNERS.map((p) => (
        <li
          key={p.name}
          className={`flex items-center justify-center border hairline bg-abyss/35 backdrop-blur-sm transition-[border-color] duration-(--duration-fast) hover:border-signal/50 ${tileClass}`}
        >
          <img
            src={p.src}
            alt={p.name}
            width={p.w}
            height={p.h}
            loading="lazy"
            decoding="async"
            className={`w-auto opacity-75 transition-opacity duration-(--duration-fast) [filter:brightness(0)_invert(1)] hover:opacity-100 ${p.cls}`}
          />
        </li>
      ))}
    </ul>
  );
}
