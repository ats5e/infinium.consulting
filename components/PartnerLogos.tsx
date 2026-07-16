/*
 * Certified partner strip. Logos render as a uniform deep-blue row so
 * mixed partner palettes remain calm on the light interface.
 */
export const PARTNERS = [
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
          className={`flex items-center justify-center border hairline bg-white/78 shadow-[0_8px_24px_rgba(23,56,102,0.045)] backdrop-blur-sm ${tileClass}`}
        >
          <Image
            src={p.src}
            alt={p.name}
            width={p.w}
            height={p.h}
            loading="lazy"
            sizes="(min-width: 1024px) 20vw, 42vw"
            className={`partner-logo w-auto opacity-90 ${p.cls}`}
          />
        </li>
      ))}
    </ul>
  );
}
import Image from "next/image";
