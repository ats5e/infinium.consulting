"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Lockup } from "@/components/Lockup";
import { NAV_GROUPS } from "@/lib/content";
import { siteImage } from "@/lib/images";

/* one glass render per group — the dropdown's visual anchor */
const NAV_VISUAL: Record<string, { slot: Parameters<typeof siteImage>[0]; caption: string }> = {
  Services: { slot: "data-engineering", caption: "Strategy to production, engineered" },
  Solutions: { slot: "qbricks", caption: "QBricks & VBricks, disruptive by design" },
  Sectors: { slot: "about-difc", caption: "Regulated finance, across markets" },
  Technologies: { slot: "data-science", caption: "Best-in-class platform partners" },
  Insights: { slot: "governance", caption: "How we have helped our clients" },
  About: { slot: "careers", caption: "Practitioners, from two hubs" },
};

const MOBILE_LINKS = [
  { href: "/", label: "Home" },
  ...NAV_GROUPS.flatMap((group) => [
    { href: group.href, label: group.label },
    ...group.items,
  ]),
  { href: "/contact", label: "Start a conversation" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [panelH, setPanelH] = useState(220);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeIdx = hovered ? NAV_GROUPS.findIndex((g) => g.label === hovered) : -1;
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile menu on navigation. Adjusting state during render (the
  // React-recommended pattern) instead of an effect avoids a cascading
  // re-render on every route change.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    if (activeIdx >= 0) {
      const el = contentRefs.current[activeIdx];
      if (el) setPanelH(el.offsetHeight);
    }
  }, [activeIdx]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Primary"
        onMouseLeave={() => setHovered(null)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovered(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setHovered(null);
        }}
        className={`pointer-events-auto relative z-50 mx-auto mt-4 flex h-[70px] w-[calc(100%-1rem)] max-w-[1124px] items-center justify-between rounded-[10px] border border-paper/5 px-5 shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur-xl transition-[background,border-color,transform] duration-(--duration-base) ease-(--ease-out-expo) md:px-6 ${
          scrolled || open ? "bg-[#1f2225]/92" : "bg-[#1f2225]/78"
        }`}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[10px]">
          <div
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-cobalt via-signal to-transparent shadow-[0_0_20px_var(--color-signal)] transition-transform duration-(--duration-fast)"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
        <div className="relative z-50 flex min-w-0 items-center gap-3">
          <Link href="/" aria-label="Infinium Technology — home" className="shrink-0">
            <Lockup className="h-7" />
          </Link>
        </div>

        <div className="relative z-50 hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className="group/nav relative px-2 py-2 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-steel transition-colors duration-(--duration-fast) hover:text-paper"
          >
            Home
            <span
              aria-hidden
              className={`absolute inset-x-2 bottom-0 h-px origin-left bg-signal shadow-[0_0_12px_var(--color-signal)] transition-transform duration-(--duration-base) ease-(--ease-out-expo) ${
                pathname === "/" ? "scale-x-100" : "scale-x-0 group-hover/nav:scale-x-100"
              }`}
            />
          </Link>
          {NAV_GROUPS.map((group) => (
            <Link
              key={group.label}
              href={group.href}
              aria-current={pathname === group.href ? "page" : undefined}
              aria-expanded={hovered === group.label}
              onMouseEnter={() => setHovered(group.label)}
              onFocus={() => setHovered(group.label)}
              className="group/nav relative flex items-center gap-1 px-2 py-2 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-steel transition-colors duration-(--duration-fast) hover:text-paper"
            >
              {group.label}
              <span aria-hidden className="text-[10px] text-signal">⌄</span>
              <span
                aria-hidden
                className={`absolute inset-x-2 bottom-0 h-px origin-left bg-signal shadow-[0_0_12px_var(--color-signal)] transition-transform duration-(--duration-base) ease-(--ease-out-expo) ${
                  pathname?.startsWith(group.href) || hovered === group.label
                    ? "scale-x-100"
                    : "scale-x-0 group-hover/nav:scale-x-100"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* morphing mega panel — one surface; content slides between
            sections and the panel resizes to fit, Stripe-style */}
        <div
          className={`absolute inset-x-0 top-full hidden pt-3 lg:block ${
            activeIdx >= 0 ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div
            className={`mx-auto w-[36rem] transition-[opacity,transform] duration-(--duration-base) ease-(--ease-out-expo) ${
              activeIdx >= 0 ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
            }`}
          >
            <div
              className="relative overflow-hidden rounded-[10px] border hairline bg-void/95 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-[height] duration-(--duration-base) ease-(--ease-out-expo)"
              style={{ height: panelH }}
            >
              {NAV_GROUPS.map((group, i) => (
                <div
                  key={group.label}
                  ref={(el) => {
                    contentRefs.current[i] = el;
                  }}
                  aria-hidden={i !== activeIdx}
                  className={`absolute inset-x-0 top-0 grid grid-cols-[1fr_14rem] transition-[opacity,transform,visibility] duration-(--duration-base) ease-(--ease-out-expo) ${
                    i === activeIdx
                      ? "visible translate-x-0 opacity-100"
                      : `invisible opacity-0 ${i < activeIdx ? "-translate-x-6" : "translate-x-6"}`
                  }`}
                >
                  <div className="p-2.5">
                    {group.items.map((item) => (
                      <Link
                        key={`${group.label}-${item.label}`}
                        href={item.href}
                        tabIndex={i === activeIdx ? 0 : -1}
                        className="group/item flex items-center justify-between px-3 py-2 text-(length:--text-body-sm) text-ice transition-colors duration-(--duration-fast) hover:bg-abyss/70 hover:text-paper"
                      >
                        {item.label}
                        <span aria-hidden className="text-steel opacity-0 transition-opacity duration-(--duration-fast) group-hover/item:text-signal group-hover/item:opacity-100">→</span>
                      </Link>
                    ))}
                  </div>
                  {NAV_VISUAL[group.label] ? (
                    <Link
                      href={group.href}
                      tabIndex={-1}
                      aria-hidden
                      className="group/visual relative block border-l hairline"
                    >
                      <img
                        src={siteImage(NAV_VISUAL[group.label].slot).webpMob}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover opacity-80 transition-[opacity,transform] duration-(--duration-slow) ease-(--ease-out-expo) group-hover/visual:scale-[1.04] group-hover/visual:opacity-100"
                        style={{ backgroundImage: `url(${siteImage(NAV_VISUAL[group.label].slot).lqip})`, backgroundSize: "cover" }}
                      />
                      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/30 to-transparent" />
                      <span className="relative flex h-full min-h-44 flex-col justify-end p-4">
                        <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-glass">{NAV_VISUAL[group.label].caption}</span>
                        <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-signal">Explore →</span>
                      </span>
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-50 flex items-center">
          <Link
            href="/contact"
            className="btn-sheen hidden min-h-10 items-center border border-paper/70 px-4 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-paper transition-colors hover:border-signal hover:bg-signal hover:text-void lg:inline-flex"
          >
            Start a conversation
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center border border-paper/70 text-paper transition-colors hover:border-signal hover:bg-signal hover:text-void lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="relative block h-4 w-6">
              <span
                className={`absolute left-0 top-[3px] h-px w-full bg-current transition-transform duration-(--duration-base) ease-(--ease-out-expo) ${open ? "translate-y-[5px] rotate-45" : ""}`}
              />
              <span
                className={`absolute bottom-[3px] left-0 h-px w-full bg-current transition-transform duration-(--duration-base) ease-(--ease-out-expo) ${open ? "-translate-y-[5px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`pointer-events-auto fixed inset-0 z-40 bg-void/98 pt-36 backdrop-blur-xl transition-[clip-path] duration-(--duration-slow) ease-(--ease-out-expo) ${
          open ? "[clip-path:inset(0_0_0%_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_74%_24%,rgba(115,168,251,0.16),transparent_30rem)]" />
        <div className="relative mx-auto grid max-w-(--container-content) gap-12 px-(--spacing-gutter) lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ul className="divide-y divide-ice/12 border-y hairline">
              {MOBILE_LINKS.map(({ href, label }, i) => (
                <li key={`${href}-${label}`} className="overflow-hidden">
                  <Link
                    href={href}
                    tabIndex={open ? 0 : -1}
                    aria-current={pathname === href ? "page" : undefined}
                    className={`group flex items-center justify-between py-5 font-display text-(length:--text-step-3) font-medium text-paper transition-[transform,opacity,color] duration-(--duration-slow) ease-(--ease-out-expo) hover:text-signal ${
                      open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
                    style={{ transitionDelay: open ? `${120 + i * 55}ms` : "0ms" }}
                  >
                    {label}
                    <span aria-hidden className="text-steel transition-transform group-hover:translate-x-1 group-hover:text-signal">↘</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-4">
            <Link
              href="/contact"
              tabIndex={open ? 0 : -1}
              className={`btn-sheen inline-flex min-h-11 items-center border border-signal px-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-paper transition-[opacity,background,color] duration-(--duration-slow) hover:bg-signal hover:text-void ${
                open ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: open ? "460ms" : "0ms" }}
            >
              Start a conversation
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
