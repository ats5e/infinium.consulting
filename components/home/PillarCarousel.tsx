"use client";

import Link from "next/link";
import { useState } from "react";
import type { SiteImage } from "@/lib/images";

/*
 * The homepage set piece: four pillars in one row. The active card widens
 * (flex-grow on the editorial curve) and reveals its copy; the others hold
 * only their eyebrow. All copy and imagery are the client-approved cards.
 *
 * - Wide screens (xl+): hover or keyboard focus expands a card. On a touch
 *   screen with no hover, the first tap on a collapsed card expands it and
 *   the second tap follows the link — so its copy is always seen first.
 * - Below xl the row stacks and every card shows its full copy in normal
 *   flow, so the card grows with its text (zoom, text spacing) and nothing
 *   is hidden behind an interaction. Collapsed cards in a row narrower than
 *   xl clipped or crowded their titles (1024 and 1280), which is why the
 *   row starts at xl.
 */
export type Pillar = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  image: SiteImage;
};

export function PillarCarousel({ pillars }: { pillars: Pillar[] }) {
  const [active, setActive] = useState(0);

  return (
    <ul className="flex flex-col gap-3 xl:h-[37.5rem] xl:flex-row">
      {pillars.map((p, i) => {
        const isActive = i === active;
        return (
          <li
            key={p.title}
            onMouseEnter={() => setActive(i)}
            className={`group relative isolate overflow-hidden rounded-2xl bg-deep transition-[flex-grow] duration-[700ms] ease-(--ease-editorial) has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-cobalt has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-void motion-reduce:transition-none xl:min-w-0 xl:basis-0 ${
              isActive ? "xl:grow-[2.8]" : "xl:grow"
            }`}
          >
            <picture className="absolute inset-0 -z-10">
              <source
                type="image/avif"
                srcSet={`${p.image.avifMob} 800w, ${p.image.avifHalf} ${Math.round(p.image.width / 2)}w`}
                /* real rendered widths: ~55vw open, ~15vw collapsed, full on a phone */
                sizes={isActive ? "(min-width: 1280px) 55vw, 92vw" : "(min-width: 1280px) 15vw, 92vw"}
              />
              <img
                src={p.image.webpHalf}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-(--duration-grand) ease-(--ease-editorial) group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                style={{ backgroundImage: `url(${p.image.lqip})`, backgroundSize: "cover" }}
              />
            </picture>
            {/* deeper scrim on phones, where the full copy sits high on the photo */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-gradient-to-t from-overlay/96 via-overlay/72 to-overlay/20"
            />
            <Link
              href={p.href}
              onFocus={() => setActive(i)}
              onClick={(e) => {
                // touch, no hover: the first tap opens the card, the second follows it
                if (!isActive && window.matchMedia("(min-width: 1280px) and (hover: none)").matches) {
                  e.preventDefault();
                  setActive(i);
                }
              }}
              className="relative flex min-h-[26rem] flex-col justify-end rounded-2xl p-7 outline-none xl:absolute xl:inset-0 xl:min-h-0 xl:p-9"
            >
              {/* collapsed (wide screens): the eyebrow alone, set large */}
              <span
                className={
                  isActive
                    ? "eyebrow text-on-dark-accent"
                    : "eyebrow text-on-dark-accent xl:font-hero xl:text-[22px] xl:font-normal xl:normal-case xl:tracking-[-0.01em] xl:leading-[1.15] xl:text-white"
                }
              >
                {p.eyebrow}
              </span>
              {/* expanded: always on phones and tablets, the active card on wide screens */}
              <span className={`mt-4 max-w-xl flex-col gap-4 ${isActive ? "flex" : "flex xl:hidden"}`}>
                <span className="font-hero text-[clamp(1.75rem,2.4vw,2.25rem)] leading-[1.08] tracking-[-0.02em] text-white">
                  {p.title}
                </span>
                <span className="leading-relaxed text-white/85">{p.body}</span>
                <span className="mt-2 text-[15px] font-medium text-on-dark-accent">{p.cta}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
