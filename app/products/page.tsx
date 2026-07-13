import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { GlassImage } from "@/components/GlassImage";
import { ContactBand } from "@/components/ContactBand";
import { QBricksWord } from "@/components/QBricksWord";
import { siteImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "Products",
  description:
    "QBricks and TBricks — proprietary platforms developed in-house, deployed with clients, maintained by the team that built them.",
  alternates: { canonical: "/products" },
};

const PRODUCTS = [
  {
    href: "/products/qbricks",
    name: "QBricks",
    thesis: "Governed, AI-ready data — without pipelines.",
    body: "A streaming data-management platform that enforces governance at the point of ingestion. Automatic pipeline building, data contracts, lineage, and local compute on the infrastructure you already own.",
    image: siteImage("qbricks"),
    alt: "A monolith of interlocking glass bricks lit in deep crimson",
  },
  {
    href: "/products/tbricks",
    name: "TBricks",
    thesis: "Automated model testing and ESG reporting.",
    body: "The same brick-lattice engineering applied to model assurance — every model stressed, every result auditable, ESG reporting built on data you can defend.",
    image: siteImage("tbricks"),
    alt: "A lattice of glass bricks under examination, one brick isolated and lit",
  },
];

export default function Products() {
  return (
    <>
      <section className="pt-40 pb-20">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter)">
          <p className="eyebrow">we build</p>
          <h1 className="mt-6 max-w-4xl text-(length:--text-step-5) leading-[1.02]">
            Products in production, not proofs of concept.
          </h1>
          <p className="mt-8 max-w-xl text-ice">
            Developed in-house, deployed with clients, and maintained by the
            same team that built them — running today at tier-1 financial
            institutions.
          </p>
        </div>
      </section>

      {PRODUCTS.map((p, i) => (
        <section key={p.name} className="border-t hairline">
          <Reveal
            className={`mx-auto grid max-w-(--container-content) items-center gap-12 px-(--spacing-gutter) py-20 md:grid-cols-2 ${
              i % 2 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div>
              <h2 className="text-(length:--text-step-4)">
                {p.name === "QBricks" ? <QBricksWord /> : p.name}
              </h2>
              <p className="mt-4 text-(length:--text-step-1) text-glass">{p.thesis}</p>
              <p className="mt-6 max-w-xl leading-relaxed text-ice">{p.body}</p>
              <Link
                href={p.href}
                className="link-wipe mt-8 inline-block font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal"
              >
                Explore {p.name} →
              </Link>
            </div>
            <Link href={p.href} aria-label={p.name} className="group block overflow-hidden border hairline transition-[border-color] duration-(--duration-fast) hover:border-signal/60">
              <GlassImage image={p.image} alt={p.alt} sizes="(min-width: 768px) 45vw, 100vw" />
            </Link>
          </Reveal>
        </section>
      ))}

      <ContactBand heading="See either platform against your own data estate." />
    </>
  );
}
