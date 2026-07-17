"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatedLockup } from "@/components/AnimatedLockup";
import { CASE_STUDIES, PERSPECTIVES, SERVICES, TECHNOLOGIES } from "@/lib/content";

/*
 * Infinium's floating navigation: a translucent wordmark and region
 * lockup paired with a joined search/menu control and full-screen
 * editorial overlays.
 * The menu runs three editorial columns (NAVIGATION with return-arrow
 * products, LATEST PERSPECTIVES + QUICK LINKS, LATEST CASE STUDY);
 * search filters the whole IA. Escape or any route change closes.
 */

const PRODUCTS = [
  { label: "QBricks", href: "/solutions/qbricks" },
  { label: "VBricks", href: "/solutions/vbricks" },
];

const SECTIONS = [
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Sectors", href: "/sectors" },
  { label: "Technologies", href: "/technologies" },
  { label: "Insights", href: "/insights" },
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

/* everything reachable, for the search overlay */
const SEARCH_INDEX: Array<{ label: string; section: string; href: string }> = [
  ...[...PRODUCTS, ...SECTIONS, ...QUICK_LINKS].map((l) => ({ ...l, section: "Navigation" })),
  ...SERVICES.map((s) => ({ label: s.title, section: "Services", href: `/services/${s.slug}` })),
  ...TECHNOLOGIES.map((t) => ({ label: t.name, section: "Technologies", href: `/technologies/${t.slug}` })),
  ...CASE_STUDIES.map((c) => ({ label: c.title, section: "Case studies", href: `/insights/${c.slug}` })),
];

/* small uppercase column heading with an optional jump link */
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
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);
  const menuFirst = useRef<HTMLAnchorElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const searchButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  const study = CASE_STUDIES[0];
  const studyImage = study.image();

  // Close overlays on navigation. Adjusting state during render (the
  // React-recommended pattern) instead of an effect avoids a cascading
  // re-render on every route change.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setSearching(false);
  }

  const overlayOpen = open || searching;

  useEffect(() => {
    document.documentElement.style.overflow = overlayOpen ? "hidden" : "";
    const main = document.getElementById("main");
    const footer = document.getElementById("site-footer");
    if (main) main.inert = overlayOpen;
    if (footer) footer.inert = overlayOpen;
    return () => {
      document.documentElement.style.overflow = "";
      if (main) main.inert = false;
      if (footer) footer.inert = false;
    };
  }, [overlayOpen]);

  useEffect(() => {
    if (searching) searchInput.current?.focus();
  }, [searching]);

  useEffect(() => {
    if (open) menuFirst.current?.focus();
  }, [open]);

  const q = query.trim().toLowerCase();
  const results = q ? SEARCH_INDEX.filter((e) => e.label.toLowerCase().includes(q)).slice(0, 8) : [];

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      onKeyDown={(e) => {
        if (e.key === "Escape" && overlayOpen) {
          const returnFocus = searching ? searchButton.current : menuButton.current;
          setOpen(false);
          setSearching(false);
          requestAnimationFrame(() => returnFocus?.focus());
        }
      }}
    >
      {/* the floating pill */}
      <nav
        aria-label="Primary"
        className="pointer-events-auto absolute inset-x-3 top-3 z-50 flex h-14 items-center justify-between rounded-[10px] border border-navy/12 bg-white/78 pl-5 pr-2 shadow-[0_10px_34px_rgba(23,56,102,0.09)] backdrop-blur-xl md:inset-x-6 md:top-4 md:h-16 md:pl-6 md:pr-2.5 lg:inset-x-10"
      >
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" aria-label="Infinium Technology — home" className="shrink-0">
            <AnimatedLockup className="h-6" />
          </Link>
          <span aria-hidden className="hidden items-baseline gap-2 text-[15px] text-steel sm:flex">
            <span className="text-ice/35">/</span> Amsterdam · Dubai
          </span>
        </div>

        {/* joined two-cell control: search | menu */}
        <div className="flex overflow-hidden rounded-[6px] border border-navy/18 bg-white/55">
          <button
            ref={searchButton}
            type="button"
            aria-expanded={searching}
            aria-controls="site-search"
            onClick={() => {
              setSearching((v) => !v);
              setOpen(false);
            }}
            className="grid size-11 place-items-center border-r border-navy/18 text-paper transition-colors duration-(--duration-fast) hover:bg-signal/8 hover:text-signal"
          >
            <span className="sr-only">{searching ? "Close search" : "Open search"}</span>
            {searching ? (
              <svg aria-hidden width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M1.5 1.5l12 12m0-12l-12 12" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            ) : (
              <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="6.75" cy="6.75" r="4.75" stroke="currentColor" strokeWidth="1.25" />
                <path d="M10.5 10.5L14.5 14.5" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            )}
          </button>
          <button
            ref={menuButton}
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => {
              setOpen((v) => !v);
              setSearching(false);
            }}
            className="grid size-11 place-items-center text-paper transition-colors duration-(--duration-fast) hover:bg-signal/8 hover:text-signal"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="relative block h-[11px] w-[17px]">
              <span
                className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-(--duration-base) ease-(--ease-out-expo) ${
                  open ? "translate-y-[5px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[5px] h-px w-full bg-current transition-opacity duration-(--duration-fast) ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-(--duration-base) ease-(--ease-out-expo) ${
                  open ? "-translate-y-[5px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* full-screen takeover menu */}
      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 overflow-y-auto bg-void transition-[clip-path] duration-(--duration-slow) ease-(--ease-out-expo) ${
          open ? "[clip-path:inset(0_0_0%_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(35,79,189,0.09),transparent_36rem)]" />
        <div className="relative mx-auto grid max-w-(--container-content) gap-x-14 gap-y-14 px-(--spacing-gutter) pb-20 pt-32 lg:grid-cols-12">
          {/* NAVIGATION — products first, with the return-arrow prefix */}
          <div className="lg:col-span-5">
            <ColumnHead label="Navigation" open={open} tabbable={open} />
            <ul className="mt-4">
              {[...PRODUCTS.map((l) => ({ ...l, product: true })), ...SECTIONS.map((l) => ({ ...l, product: false }))].map(
                ({ label, href, product }, i) => (
                  <li key={`${label}-${href}`} className="overflow-hidden">
                    <Link
                      ref={i === 0 ? menuFirst : undefined}
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
                Case study <span className="text-ice/40">{"//"}</span> {study.sector}
              </p>
              <span className="relative mt-3 block aspect-[16/10] overflow-hidden border hairline">
                <Image
                  src={studyImage.webpMob}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 22vw, 40vw"
                  className="object-cover opacity-92 saturate-[0.94] contrast-[1.03] transition-[transform,opacity,filter] duration-(--duration-slow) ease-(--ease-out-expo) group-hover:scale-[1.015] group-hover:opacity-100 group-hover:saturate-100"
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

      {/* full-screen search */}
      <div
        id="site-search"
        role="dialog"
        aria-modal="true"
        aria-label="Site search"
        aria-hidden={!searching}
        className={`fixed inset-0 z-40 overflow-y-auto bg-void transition-[clip-path] duration-(--duration-slow) ease-(--ease-out-expo) ${
          searching ? "[clip-path:inset(0_0_0%_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(35,79,189,0.08),transparent_34rem)]" />
        <div className="relative mx-auto max-w-(--container-content) px-(--spacing-gutter) pb-20 pt-36">
          <label htmlFor="site-search-input" className="text-[11px] font-medium uppercase tracking-[0.14em] text-steel">
            Search
          </label>
          <input
            ref={searchInput}
            id="site-search-input"
            type="search"
            value={query}
            tabIndex={searching ? 0 : -1}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Services, solutions, technologies, case studies…"
            autoComplete="off"
            spellCheck={false}
            className="mt-4 w-full border-b border-ice/25 bg-transparent pb-5 font-display text-(length:--text-step-3) font-medium tracking-[-0.02em] text-paper outline-none placeholder:text-steel/60 focus:border-signal"
          />
          <div className="mt-8">
            {q && results.length === 0 ? (
              <p className="text-(length:--text-body-sm) text-steel">No matches. Try a service, technology or case-study keyword.</p>
            ) : null}
            <ul className="divide-y divide-ice/10">
              {results.map((r) => (
                <li key={`${r.href}-${r.label}`}>
                  <Link
                    href={r.href}
                    tabIndex={searching ? 0 : -1}
                    className="group flex items-baseline justify-between gap-6 py-4 text-paper transition-colors duration-(--duration-fast) hover:text-signal"
                  >
                    <span className="text-(length:--text-step-1)">{r.label}</span>
                    <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-steel">{r.section}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
