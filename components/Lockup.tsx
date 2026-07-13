/*
 * Vector recreation of the Infinium lockup — authored, not traced raster.
 * Faceted glass cube in the extracted facet colours + wordmark in the
 * display face. The original PNG overlaps the cube on "fin"; at nav scale
 * that treatment is illegible, so the cleaned lockup sets the cube as a
 * leading mark. Facet gradients: top = glass/ice, left = navy/abyss,
 * right = cobalt→signal (the brand's one permitted blue moment in chrome).
 */

export function CubeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 104"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cube-top" x1="12" y1="8" x2="88" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CDDEF1" />
          <stop offset="0.55" stopColor="#9AC7F8" />
          <stop offset="1" stopColor="#93A9BF" />
        </linearGradient>
        <linearGradient id="cube-left" x1="12" y1="30" x2="50" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22365D" />
          <stop offset="1" stopColor="#0A1020" />
        </linearGradient>
        <linearGradient id="cube-right" x1="50" y1="52" x2="88" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="#365EEE" />
          <stop offset="1" stopColor="#2F55B6" />
        </linearGradient>
      </defs>
      <path d="M50 4 L90 27 L50 50 L10 27 Z" fill="url(#cube-top)" fillOpacity="0.92" />
      <path d="M10 27 L50 50 L50 100 L10 77 Z" fill="url(#cube-left)" fillOpacity="0.95" />
      <path d="M90 27 L50 50 L50 100 L90 77 Z" fill="url(#cube-right)" fillOpacity="0.9" />
      {/* internal refraction planes */}
      <path d="M50 50 L90 27 M50 50 L50 100 M50 50 L10 27" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="0.75" />
      <path d="M30 38.5 L70 61.5 M70 38.5 L50 72" stroke="#FFFFFF" strokeOpacity="0.14" strokeWidth="0.6" />
    </svg>
  );
}

export function Lockup({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <CubeMark className="h-[1.55em] w-auto" />
      <span className="font-display text-[1.3em] font-medium tracking-[-0.02em] text-paper leading-none">
        Infinium
      </span>
    </span>
  );
}
