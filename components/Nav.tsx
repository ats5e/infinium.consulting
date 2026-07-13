"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Lockup } from "@/components/Lockup";
import { NAV_GROUPS } from "@/lib/content";

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
        className={`pointer-events-auto relative z-50 mx-auto mt-4 flex h-[70px] w-[calc(100%-1rem)] max-w-[1124px] items-center justify-between overflow-hidden rounded-[10px] border border-paper/5 px-5 shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur-xl transition-[background,border-color,transform] duration-(--duration-base) ease-(--ease-out-expo) md:px-6 ${
          scrolled || open ? "bg-[#1f2225]/92" : "bg-[#1f2225]/78"
        }`}
      >
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-cobalt via-signal to-transparent shadow-[0_0_20px_var(--color-signal)] transition-transform duration-(--duration-fast)"
          style={{ transform: `scaleX(${progress})` }}
        />
        <div className="relative z-50 flex min-w-0 items-center gap-3">
          <Link href="/" aria-label="Infinium Technology — home" className="shrink-0">
            <Lockup className="h-7" />
          </Link>
        </div>

        <div className="relative z-50 hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className="link-wipe px-2 py-2 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-steel transition-colors duration-(--duration-fast) hover:text-paper"
          >
            Home
          </Link>
          {NAV_GROUPS.map((group) => (
            <span
              key={group.label}
              className="relative"
              onMouseEnter={() => setHovered(group.label)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(group.label)}
              onBlur={(e) => {
                // close only when focus leaves the whole group (keyboard access)
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setHovered(null);
              }}
            >
              <Link
                href={group.href}
                aria-current={pathname === group.href ? "page" : undefined}
                className="flex items-center gap-1 px-2 py-2 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-steel transition-colors duration-(--duration-fast) hover:text-paper"
              >
                {group.label}
                <span aria-hidden className="text-[10px] text-signal">⌄</span>
              </Link>
              <span
                className={`absolute left-0 top-full min-w-64 pt-3 transition-[opacity,transform] duration-(--duration-fast) ease-(--ease-out-expo) ${
                  hovered === group.label
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0"
                }`}
              >
                <span className="block border hairline bg-void/95 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.36)] backdrop-blur-xl">
                  {group.items.map((item) => (
                    <Link
                      key={`${group.label}-${item.label}`}
                      href={item.href}
                      className="block px-3 py-2 text-(length:--text-body-sm) text-ice transition-colors duration-(--duration-fast) hover:bg-abyss/70 hover:text-paper"
                    >
                      {item.label}
                    </Link>
                  ))}
                </span>
              </span>
            </span>
          ))}
        </div>

        <div className="relative z-50 flex items-center">
          <Link
            href="/contact"
            className="hidden min-h-10 items-center border border-paper/70 px-4 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-paper transition-colors hover:border-signal hover:bg-signal hover:text-void lg:inline-flex"
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
              className={`inline-flex min-h-11 items-center border border-signal px-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-paper transition-[opacity,background,color] duration-(--duration-slow) hover:bg-signal hover:text-void ${
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
