import { LogoCrystal } from "@/components/hero/LogoCrystal";

/*
 * The static lockup — the same live composite as the animated nav
 * version (components/AnimatedLockup.tsx), without the entrance: real
 * "Infinium" text in the logo-matched face with the SVG cube docked
 * behind the letters at the artwork's position (centre-x 36.3%).
 * Scales with font-size: pass a text-[*] class; the cube follows in em.
 */
export function Lockup({ className }: { className?: string }) {
  return (
    <span className={`relative inline-flex items-center ${className ?? "text-[21px]"}`}>
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 -translate-y-1/2"
        style={{ left: "calc(36.3% - 0.62em)", width: "1.24em", height: "1.24em" }}
      >
        <LogoCrystal className="h-full w-full" />
      </span>
      <span className="relative z-10 font-hero font-medium tracking-[0.005em] text-paper">Infinium</span>
    </span>
  );
}
