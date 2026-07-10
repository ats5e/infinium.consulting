"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
 * Group scroll-reveal: children rise 24px → 0 over 800ms, staggered 80ms,
 * triggered once at 20% into the viewport. The CSS lives in globals.css
 * under [data-reveal]; reduced motion renders the final state immediately.
 * Reveal wraps groups — never every element (MOTION.md).
 */
export function Reveal({
  as = "div",
  className,
  children,
}: {
  as?: "div" | "section" | "article" | "ul";
  className?: string;
  children: ReactNode;
}) {
  // typed as "div" only to satisfy JSX's per-tag ref variance; the actual
  // rendered tag is whatever `as` carries
  const Tag = as as "div";
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Content is visible in the server HTML; hiding happens here, after
    // hydration, and only for groups well below the viewport — so the
    // reveal never delays first paint, and anything near the fold can
    // never be caught hidden.
    if (el.getBoundingClientRect().top < window.innerHeight * 1.4) return;
    el.setAttribute("data-armed", "");
    const show = () => el.removeAttribute("data-armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    // belt and braces: if the group is ever above the viewport (fast
    // scroll, anchor jump), reveal it unconditionally
    const onScroll = () => {
      if (el.getBoundingClientRect().bottom < 0) {
        show();
        removeEventListener("scroll", onScroll);
      }
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Tag ref={ref} data-reveal className={className}>
      {children}
    </Tag>
  );
}
