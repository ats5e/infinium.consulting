import Link from "next/link";
import { Lockup } from "@/components/Lockup";
import { FOOTER_COLUMNS } from "@/lib/content";

/*
 * Footer (homepage mockup, Nov 2026): lockup and offices, the link columns,
 * then the hero line set once more at full width as the sign-off, and a
 * quiet legal row. No panels, no glows — space and type only.
 * The lockup renders exactly as on the live site.
 */
const LEGAL = [
  { label: "Privacy", href: "/privacy" },
  { label: "Cookies", href: "/cookies" },
  { label: "Terms", href: "/terms" },
  { label: "Accessibility", href: "/accessibility" },
];

export function Footer() {
  return (
    <footer id="site-footer" className="relative overflow-hidden">
      <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) pb-10">
        <div className="grid gap-12 border-t border-paper/14 pt-14 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
          <div className="max-w-xs">
            <Lockup className="text-[28px]" />
            <p className="mt-7 text-[15px] leading-relaxed text-steel">
              Engineering with context. Serving the EU, Nordic and Middle East
              (GCC) markets from Amsterdam, The Netherlands and DIFC, Dubai.
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-3 lg:gap-16">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.label}>
                <p className="text-[15px] font-medium text-cobalt first-letter:uppercase">{col.label}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map((l) => (
                    <li key={`${col.label}-${l.label}`}>
                      <Link
                        href={l.href}
                        className="text-[15px] text-paper transition-colors duration-(--duration-fast) hover:text-cobalt"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p
          aria-hidden
          className="mt-24 whitespace-nowrap font-hero text-[clamp(2rem,11.4vw,10.5rem)] font-medium leading-[0.9] tracking-[-0.045em] text-paper md:mt-32"
        >
          Months, <span className="text-cobalt">not years.</span>
        </p>

        <div className="mt-12 flex flex-col gap-4 text-[13px] text-steel md:flex-row md:items-center md:justify-between">
          <p>© 2026 Infinium Consulting B.V. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href="https://www.linkedin.com/company/infinium-consulting/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-(--duration-fast) hover:text-cobalt"
            >
              LinkedIn ↗
            </a>
            {LEGAL.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors duration-(--duration-fast) hover:text-cobalt">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
