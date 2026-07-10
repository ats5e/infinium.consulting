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
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-(--duration-base) ease-(--ease-out-expo) ${
        scrolled || open
          ? "bg-void/80 backdrop-blur-md border-b hairline"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-full max-w-(--container-content) items-center justify-between px-(--spacing-gutter)"
      >
        <Link href="/" aria-label="Infinium Technology — home" className="relative z-50">
          <Lockup className="text-[15px]" />
        </Link>

        {/* desktop */}
        <div className="hidden items-center gap-8 lg:flex">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={`link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.14em] transition-colors duration-(--duration-fast) ${
                pathname?.startsWith(href) ? "text-paper" : "text-steel hover:text-glass"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="inline-flex h-10 items-center whitespace-nowrap bg-cobalt px-5 font-mono text-(length:--text-label) uppercase tracking-[0.14em] text-paper transition-colors duration-(--duration-fast) ease-(--ease-out-expo) hover:bg-signal hover:text-void"
          >
            Start a conversation
          </Link>
        </div>

        {/* mobile trigger */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span aria-hidden className="relative block h-3 w-5">
            <span
              className={`absolute left-0 top-0 h-px w-full bg-paper transition-transform duration-(--duration-base) ease-(--ease-out-expo) ${open ? "translate-y-[5.5px] rotate-45" : ""}`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-full bg-paper transition-transform duration-(--duration-base) ease-(--ease-out-expo) ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </nav>

      {/* mobile overlay — clip-path wipe, staggered items */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`fixed inset-0 -z-10 bg-void transition-[clip-path] duration-(--duration-slow) ease-(--ease-out-expo) lg:hidden ${
          open ? "[clip-path:inset(0_0_0%_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <ul className="flex h-full flex-col justify-center gap-2 px-(--spacing-gutter)">
          {LINKS.map(({ href, label }, i) => (
            <li
              key={href}
              className="overflow-hidden"
              style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
            >
              <Link
                href={href}
                tabIndex={open ? 0 : -1}
                className={`block py-2 font-display text-(length:--text-step-4) font-medium text-paper transition-[transform,opacity] duration-(--duration-slow) ease-(--ease-out-expo) ${
                  open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${150 + i * 60}ms` : "0ms" }}
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="mt-8">
            <Link
              href="/contact"
              tabIndex={open ? 0 : -1}
              className={`font-mono text-(length:--text-label) uppercase tracking-[0.14em] text-signal transition-opacity duration-(--duration-slow) ${open ? "opacity-100" : "opacity-0"}`}
              style={{ transitionDelay: open ? "500ms" : "0ms" }}
            >
              Start a conversation →
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
