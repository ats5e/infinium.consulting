"use client";

import Image from "next/image";
import { useState } from "react";

type OfficeVideoProps = {
  embedSrc: string;
  playerTitle: string;
  playLabel: string;
  coverSrc: string;
  location: string;
  heading: string;
  description: string;
  coverPosition?: string;
};

function OfficeVideo({
  embedSrc,
  playerTitle,
  playLabel,
  coverSrc,
  location,
  heading,
  description,
  coverPosition = "object-center",
}: OfficeVideoProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="overflow-hidden border hairline bg-white shadow-[0_16px_42px_rgba(23,56,102,0.08)]">
      <div className="relative aspect-video overflow-hidden bg-navy sm:aspect-[181/78]">
        {playing ? (
          <iframe
            src={embedSrc}
            title={playerTitle}
            className="absolute inset-0 size-full border-0"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            aria-label={playLabel}
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 block size-full overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
          >
            <Image
              src={coverSrc}
              alt=""
              fill
              priority={false}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className={`object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.015] ${coverPosition}`}
            />
            <span aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,30,62,0.9)_0%,rgba(11,30,62,0.7)_48%,rgba(11,30,62,0.22)_100%)]" />
            <span aria-hidden className="absolute inset-0 ring-1 ring-inset ring-white/20" />

            <span className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
              <Image
                src="/Infinium-Technology-Logo.png"
                alt=""
                width={326}
                height={138}
                className="h-auto w-36 drop-shadow-[0_4px_14px_rgba(0,0,0,0.28)] sm:w-44"
              />

              <span className="flex items-end justify-between gap-5">
                <span className="max-w-lg">
                  <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-white/70">
                    {location}
                  </span>
                  <span className="mt-2 block font-hero text-xl font-semibold leading-tight tracking-[-0.015em] text-white sm:text-2xl">
                    {heading}
                  </span>
                  <span className="mt-2 hidden max-w-md text-sm leading-relaxed text-white/78 sm:block">
                    {description}
                  </span>
                </span>
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-white/50 bg-white/12 text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] backdrop-blur-md transition-[background-color,transform] duration-(--duration-fast) group-hover:scale-105 group-hover:bg-white/20 sm:size-14">
                  <svg aria-hidden viewBox="0 0 24 24" className="ml-0.5 size-5 fill-current">
                    <path d="M8.25 5.4v13.2L18 12 8.25 5.4Z" />
                  </svg>
                </span>
              </span>
            </span>
          </button>
        )}
      </div>
    </figure>
  );
}

export function NetherlandsOfficeVideo() {
  return (
    <OfficeVideo
      embedSrc="https://player.mux.com/1O8URAIKZwRPiUpa74C02LIjg6AdMMykemKv014YT4Tf4?metadata-video-title=Infinium+-+Netherlands+HQ&video-title=Infinium+-+Netherlands+HQ&autoplay=any"
      playerTitle="Infinium — Netherlands HQ"
      playLabel="Play the Infinium Netherlands headquarters film"
      coverSrc="/img/ams-building-v1.webp"
      location="Amsterdam · The Netherlands"
      heading="Inside Infinium’s Netherlands HQ"
      description="Meet the Amsterdam team and see where our consultants and QBricks R&D engineers work."
    />
  );
}

export function DubaiOfficeVideo() {
  return (
    <OfficeVideo
      embedSrc="https://www.youtube-nocookie.com/embed/kGEchctLQGQ?autoplay=1&rel=0&modestbranding=1"
      playerTitle="Infinium — Dubai HQ"
      playLabel="Play the Infinium Dubai headquarters film"
      coverSrc="/img/dxb-entrance-v1.webp"
      location="DIFC · Dubai"
      heading="DIFC: a world-leading FinTech hub"
      description="See why Dubai is one of the world’s leading financial technology centres—and the strategic home of Infinium’s GCC practice."
      coverPosition="object-[center_48%]"
    />
  );
}
