/*
 * Static fallback for the hero object: the Infinium icon — the faceted
 * glass cube from the logo — drawn as SVG for touch, small viewports and
 * reduced motion. Face mapping follows the logo artwork:
 * ice-glass top, deep-navy left, bright-cobalt right, white refraction
 * edges, tilted in the logo's pose.
 */
export function LogoCrystal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 420"
      role="img"
      aria-label="Infinium faceted glass cube mark"
      className={className}
    >
      <defs>
        <linearGradient id="cube-top" x1="14%" y1="10%" x2="86%" y2="70%">
          <stop offset="0%" stopColor="#f7fbff" />
          <stop offset="46%" stopColor="#cddef1" />
          <stop offset="100%" stopColor="#9ac7f8" />
        </linearGradient>
        <linearGradient id="cube-left" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#22365d" />
          <stop offset="100%" stopColor="#0a1020" />
        </linearGradient>
        <linearGradient id="cube-right" x1="0%" y1="8%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#73a8fb" />
          <stop offset="42%" stopColor="#365eee" />
          <stop offset="100%" stopColor="#1e3f9e" />
        </linearGradient>
        <filter id="cube-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0.22 0 0 0 0 0.48 0 0 0 0 1 0 0 0 .7 0"
          />
          <feBlend in="SourceGraphic" />
        </filter>
      </defs>

      {/* the logo's slight tilt */}
      <g filter="url(#cube-glow)" transform="rotate(-8 210 224)">
        {/* top face */}
        <path d="M210 78 L336 150 L210 222 L84 150 Z" fill="url(#cube-top)" fillOpacity="0.94" />
        {/* left face — deep facet */}
        <path d="M84 150 L210 222 L210 366 L84 294 Z" fill="url(#cube-left)" fillOpacity="0.96" />
        {/* right face — cobalt core */}
        <path d="M336 150 L210 222 L210 366 L336 294 Z" fill="url(#cube-right)" fillOpacity="0.92" />
        {/* internal refraction planes */}
        <path d="M210 222 L156 190 L210 130 L262 192 Z" fill="#e6f0fd" fillOpacity="0.2" />
        <path d="M210 222 L262 254 L210 330 L158 252 Z" fill="#73a8fb" fillOpacity="0.16" />
        {/* white refraction edges */}
        <path
          d="M210 78 L336 150 L336 294 L210 366 L84 294 L84 150 Z"
          fill="none"
          stroke="#e9f6ff"
          strokeOpacity="0.85"
          strokeWidth="2.5"
        />
        <path
          d="M84 150 L210 222 L336 150 M210 222 L210 366"
          fill="none"
          stroke="#e9f6ff"
          strokeOpacity="0.6"
          strokeWidth="2"
        />
        {/* specular kisses, as on the mark */}
        <path d="M116 136 L172 106 M300 122 L330 146 M96 260 L96 288" fill="none" stroke="#ffffff" strokeLinecap="round" strokeOpacity="0.9" strokeWidth="4" />
      </g>
    </svg>
  );
}
