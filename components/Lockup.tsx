import { LogoCrystal } from "@/components/hero/LogoCrystal";

/*
 * The static lockup — the same live composite as the animated nav
 * version (components/AnimatedLockup.tsx), without the entrance: real
 * "Infinium" text in the logo-matched face with the SVG cube behind the
 * letters at the trademarked position (centre-x 36.3%).
 * Scales with font-size: pass a text-[*] class; the cube follows in em.
 * The central highlight is part of the crystal treatment, not a text
 * outline, so the footer lockup stays crisp and completely static.
 */
export function Lockup({ className }: { className?: string }) {
  return (
    <span data-lockup="static" className={`relative isolate inline-flex items-center ${className ?? "text-[21px]"}`}>
      <span
        aria-hidden
        data-logo-layer="crystal"
        className="pointer-events-none absolute z-0 top-1/2 -translate-y-1/2 [filter:drop-shadow(0_3px_7px_rgba(23,56,102,0.24))_saturate(1.16)_contrast(1.08)]"
        style={{ left: "calc(36.3% - 0.95em)", width: "1.9em", height: "1.9em" }}
      >
        <LogoCrystal className="h-full w-full" />
        <span className="absolute inset-[7%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.62)_0%,rgba(220,235,252,0.28)_42%,transparent_72%)]" />
      </span>
      <span data-logo-layer="wordmark" className="relative z-10 font-hero font-medium tracking-[0.005em] text-paper">
        Infinium
      </span>
    </span>
  );
}
