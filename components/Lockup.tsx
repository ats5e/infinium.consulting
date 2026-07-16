import { LogoCrystal } from "@/components/hero/LogoCrystal";

/*
 * The static lockup — the same live composite as the animated nav
 * version (components/AnimatedLockup.tsx), without the entrance: real
 * "Infinium" text in the logo-matched face with the SVG cube docked
 * immediately beside it for maximum clarity.
 * Scales with font-size: pass a text-[*] class; the cube follows in em.
 * Its visible facet height matches the revised navigation lockup, while
 * remaining completely static.
 */
export function Lockup({ className }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex items-center ${className ?? "text-[21px]"}`}
      style={{ paddingLeft: "2em" }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 opacity-100 [filter:drop-shadow(0_0_1px_rgba(23,56,102,0.46))_drop-shadow(0_2px_4px_rgba(23,56,102,0.2))_saturate(1.08)_contrast(1.04)]"
        style={{ left: "-0.4em", width: "2.48em", height: "2.48em" }}
      >
        <LogoCrystal className="h-full w-full" />
      </span>
      <span className="relative z-10 font-hero font-medium tracking-[0.005em] text-paper">
        Infinium
      </span>
    </span>
  );
}
