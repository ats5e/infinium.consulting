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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.setAttribute("data-inview", "");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute("data-inview", "");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} data-reveal className={className}>
      {children}
    </Tag>
  );
}
