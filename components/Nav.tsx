"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Lockup } from "@/components/Lockup";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
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

        <div className="relative z-50 flex items-center">
          <Link
            href="/contact"
            aria-label="Search"
            className="grid size-10 place-items-center border border-paper/70 text-paper transition-colors hover:border-signal hover:bg-signal hover:text-void"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.35">
              <circle cx="10.5" cy="10.5" r="6.3" />
              <path d="m15.3 15.3 5 5" />
            </svg>
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center border-y border-r border-paper/70 text-paper transition-colors hover:border-signal hover:bg-signal hover:text-void"
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
              {LINKS.map(({ href, label }, i) => (
                <li key={href} className="overflow-hidden">
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
