import Link from "next/link";
import { Lockup } from "@/components/Lockup";
import { FOOTER_COLUMNS } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t hairline">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(54,94,238,0.16),transparent_28rem)]" />
      <div className="relative mx-auto max-w-(--container-content) px-(--spacing-gutter) py-16">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div className="max-w-xs">
            <Lockup className="text-[28px]" />
            <p className="mt-6 text-(length:--text-body-sm) leading-relaxed text-steel">
              Engineering with context. Serving the EU, Nordic and Middle East
              (GCC) markets from Amsterdam, The Netherlands and DIFC, Dubai.
            </p>
          </div>
          <div className="grid gap-10 sm:grid-cols-3 lg:gap-16">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.label}>
                <p className="eyebrow">{col.label}</p>
                <ul className="mt-4 space-y-2">
                  {col.items.map((l) => (
                    <li key={`${col.label}-${l.label}`}>
                      <Link
                        href={l.href}
                        className="link-wipe text-(length:--text-body-sm) text-ice transition-colors duration-(--duration-fast) hover:text-paper"
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
        <div className="mt-16 flex flex-col gap-4 border-t hairline pt-6 md:flex-row md:items-center md:justify-between">
          <p className="eyebrow">© 2026 Infinium Consulting B.V. All rights reserved.</p>
          <p className="eyebrow text-steel">Cookies &amp; privacy policy</p>
        </div>
      </div>
    </footer>
  );
}
