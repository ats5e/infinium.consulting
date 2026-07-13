/*
 * The real Infinium lockup — the client's logo file, trimmed and served
 * as-is (transparent PNG over the void). Sized by height; width follows
 * the 238:90 intrinsic ratio.
 */
export function Lockup({ className }: { className?: string }) {
  return (
    <img
      src="/img/logo-nav.png"
      alt="Infinium"
      width={238}
      height={90}
      className={`w-auto ${className ?? "h-7"}`}
      decoding="async"
    />
  );
}
