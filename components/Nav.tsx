"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Lockup } from "@/components/Lockup";
import { CASE_STUDIES, PERSPECTIVES } from "@/lib/content";

/*
 * Palantir-pattern navigation: an ultra-minimal flush top bar whose only
 * navigation control is the menu toggle, and a full-screen takeover menu.
 * The takeover runs three editorial columns — NAVIGATION (products with
 * return-arrows, then section pages), LATEST PERSPECTIVES with quick
 * links, and the LATEST CASE STUDY tile. Rows stagger-rise on open;
 * Escape or any route change closes.
 */

const PRODUCTS = [
  { label: "QBricks", href: "/solutions" },
  { label: "VBricks", href: "/solutions" },
];

const SECTIONS = [
  { label: "Services", href: "/services" },
  { label: "Sectors", href: "/sectors" },
  { label: "Technologies", href: "/technologies" },
  { label: "Case studies", href: "/insights" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
];

const QUICK_LINKS = [
  { label: "Our solutions", href: "/solutions" },
  { label: "AI assessment", href: "/solutions/ai-assessment" },
  { label: "Quantexa maturity assessment", href: "/solutions/quantexa-maturity-assessment" },
  { label: "Industry events", href: "/about/industry-events" },
  { label: "Your career", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

/* small uppercase column heading with an optional jump link, Palantir-style */
function ColumnHead({
  label,
  linkLabel,
  href,
  open,
  tabbable,
}: {
  label: string;
  linkLabel?: string;
  href?: string;
  open: boolean;
  tabbable: boolean;
}) {
  return (
    <div>
      <div
        className={`h-px origin-left bg-ice/25 transition-transform duration-(--duration-slow) ease-(--ease-out-expo) ${
          open ? "scale-x-100" : "scale-x-0"
        }`}
        style={{ transitionDelay: open ? "160ms" : "0ms" }}
      />
      <div className="flex items-baseline justify-between pt-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-steel">{label}</p>
        {href && linkLabel ? (
          <Link
            href={href}
            tabIndex={tabbable ? 0 : -1}
            className="group/head text-[11px] font-medium uppercase tracking-[0.14em] text-glass underline decoration-ice/40 underline-offset-4 transition-colors duration-(--duration-fast) hover:text-signal"
          >
            {linkLabel}{" "}
            <span aria-hidden className="inline-block transition-transform duration-(--duration-fast) group-hover/head:-translate-y-px group-hover/head:translate-x-px">
              ↗
            </span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  const study = CASE_STUDIES[0];
  const studyImage = study.image();

  // Close the menu on navigation. Adjusting state during render (the
  // React-recommended pattern) instead of an effect avoids a cascading
  // re-render on every route change.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    toggle.current?.focus();
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) close();
      }}
    >
      <nav
        aria-label="Primary"
        className={`relative z-50 flex h-14 items-center justify-between border-b px-(--spacing-gutter) transition-colors duration-(--duration-base) ${
          open
            ? "border-transparent bg-transparent"
            : scrolled
              ? "hairline bg-void/85 backdrop-blur-md"
              : "border-transparent bg-gradient-to-b from-void/70 to-transparent"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" aria-label="Infinium Technology — home" className="shrink-0">
            <Lockup className="h-6" />
          </Link>
          <span aria-hidden className="hidden items-baseline gap-3 text-[11px] font-medium uppercase tracking-[0.14em] text-steel sm:flex">
            <span className="text-ice/40">/</span> Amsterdam · DIFC Dubai
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="hidden px-3 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-ice transition-colors duration-(--duration-fast) hover:text-signal sm:block"
          >
            Let&rsquo;s meet
          </Link>
          <button
            ref={toggle}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
            className={`grid size-10 place-items-center border transition-colors duration-(--duration-fast) ${
              open
                ? "border-paper/80 text-paper hover:border-signal hover:text-signal"
                : "border-paper/35 text-paper hover:border-paper/80"
            }`}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-[3px] h-px w-full bg-current transition-transform duration-(--duration-base) ease-(--ease-out-expo) ${
                  open ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-px w-full bg-current transition-opacity duration-(--duration-fast) ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute bottom-[3px] left-0 h-px w-full bg-current transition-transform duration-(--duration-base) ease-(--ease-out-expo) ${
                  open ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* full-screen takeover */}
      <div
        id="site-menu"
        aria-hidden={!open}
        data-lenis-prevent
        className={`fixed inset-0 z-40 overflow-y-auto bg-void transition-[clip-path] duration-(--duration-slow) ease-(--ease-out-expo) ${
          open ? "[clip-path:inset(0_0_0%_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(54,94,238,0.14),transparent_36rem)]" />
        <div className="relative mx-auto grid max-w-(--container-content) gap-x-14 gap-y-14 px-(--spacing-gutter) pb-20 pt-28 lg:grid-cols-12">
          {/* NAVIGATION — products first, with the return-arrow prefix */}
          <div className="lg:col-span-5">
            <ColumnHead label="Navigation" open={open} tabbable={open} />
            <ul className="mt-4">
              {[...PRODUCTS.map((l) => ({ ...l, product: true })), ...SECTIONS.map((l) => ({ ...l, product: false }))].map(
                ({ label, href, product }, i) => (
                  <li key={`${label}-${href}`} className="overflow-hidden">
                    <Link
                      href={href}
                      tabIndex={open ? 0 : -1}
                      aria-current={pathname === href ? "page" : undefined}
                      className={`group flex items-baseline gap-4 py-2.5 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-medium leading-tight tracking-[-0.02em] text-paper transition-[transform,opacity,color] duration-(--duration-slow) ease-(--ease-out-expo) hover:text-signal ${
                        open ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                      }`}
                      style={{ transitionDelay: open ? `${140 + i * 45}ms` : "0ms" }}
                    >
                      {product ? (
                        <span aria-hidden className="text-[0.7em] text-signal transition-transform duration-(--duration-fast) group-hover:translate-x-1">
                          ↳
                        </span>
                      ) : null}
                      {label}
                      <span
                        aria-hidden
                        className="ml-auto -translate-x-2 text-[0.55em] text-steel opacity-0 transition-[transform,opacity] duration-(--duration-fast) group-hover:translate-x-0 group-hover:text-signal group-hover:opacity-100"
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* LATEST PERSPECTIVES + QUICK LINKS */}
          <div
            className={`transition-opacity duration-(--duration-slow) lg:col-span-4 ${open ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: open ? "260ms" : "0ms" }}
          >
            <div className="hidden md:block">
              <ColumnHead label="Latest perspectives" linkLabel="All insights" href="/insights" open={open} tabbable={open} />
              <div className="mt-6 grid gap-8 sm:grid-cols-2">
                {PERSPECTIVES.slice(0, 2).map(([tag, title]) => (
                  <Link key={title} href="/insights" tabIndex={open ? 0 : -1} className="group block">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-steel">{tag}</p>
                    <p className="mt-3 text-(length:--text-body) leading-snug text-ice transition-colors duration-(--duration-fast) group-hover:text-paper">
                      {title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
            <div className="md:mt-12">
              <ColumnHead label="Quick links" open={open} tabbable={open} />
              <ul className="mt-4 space-y-2.5">
                {QUICK_LINKS.map(({ label, href }) => (
                  <li key={`${label}-${href}`}>
                    <Link
                      href={href}
                      tabIndex={open ? 0 : -1}
                      className="link-wipe text-(length:--text-body-sm) text-ice transition-colors duration-(--duration-fast) hover:text-paper"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* LATEST CASE STUDY */}
          <div
            className={`hidden transition-opacity duration-(--duration-slow) md:block lg:col-span-3 ${open ? "opacity-100" : "opacity-0"}`}
            style={{ transitionDelay: open ? "340ms" : "0ms" }}
          >
            <ColumnHead label="Latest case study" linkLabel="View all" href="/insights" open={open} tabbable={open} />
            <Link href={`/insights/${study.slug}`} tabIndex={open ? 0 : -1} className="group mt-6 block">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-steel">
                Case study <span className="text-ice/40">//</span> {study.sector}
              </p>
              <span className="relative mt-3 block aspect-[16/10] overflow-hidden border hairline">
                <img
                  src={studyImage.webpMob}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover opacity-85 transition-[transform,opacity] duration-(--duration-slow) ease-(--ease-out-expo) group-hover:scale-[1.04] group-hover:opacity-100"
                  style={{ backgroundImage: `url(${studyImage.lqip})`, backgroundSize: "cover" }}
                />
              </span>
              <p className="mt-4 text-(length:--text-body) leading-snug text-ice transition-colors duration-(--duration-fast) group-hover:text-paper">
                {study.summary}
              </p>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
