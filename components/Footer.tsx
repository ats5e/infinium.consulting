import Link from "next/link";
import { Lockup } from "@/components/Lockup";
import { QBricksWord } from "@/components/QBricksWord";

const COLUMNS = [
  {
    label: "firm",
    links: [
      { href: "/about", text: "About" },
      { href: "/services", text: "Services" },
      { href: "/careers", text: "Careers" },
      { href: "/contact", text: "Contact" },
    ],
  },
  {
    label: "products",
    links: [
      { href: "/products/qbricks", text: "QBricks" },
      { href: "/products/tbricks", text: "TBricks" },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-16">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <div className="max-w-xs">
            <Lockup className="text-[15px]" />
            <p className="eyebrow mt-6">
              Level 02, Innovation One
              <br />
              Dubai International Financial Centre
              <br />
              Dubai, UAE
            </p>
          </div>
          <div className="flex gap-16">
            {COLUMNS.map((col) => (
              <div key={col.label}>
                <p className="eyebrow">{col.label}</p>
                <ul className="mt-4 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="link-wipe text-(length:--text-body-sm) text-ice transition-colors duration-(--duration-fast) hover:text-paper"
                      >
                        {l.text === "QBricks" ? <QBricksWord className="text-[0.875rem]" /> : l.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="eyebrow">reach us</p>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href="mailto:sales@infinium.technology"
                    className="link-wipe text-(length:--text-body-sm) text-ice transition-colors duration-(--duration-fast) hover:text-paper"
                  >
                    sales@infinium.technology
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/113267940/"
                    rel="noopener"
                    className="link-wipe text-(length:--text-body-sm) text-ice transition-colors duration-(--duration-fast) hover:text-paper"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="eyebrow mt-16 border-t hairline pt-6">
          © {new Date().getFullYear()} Infinium Technology · DIFC, Dubai
        </p>
      </div>
    </footer>
  );
}
