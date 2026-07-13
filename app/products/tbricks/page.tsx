import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { GlassImage } from "@/components/GlassImage";
import { ContactBand } from "@/components/ContactBand";
import { QBricksWord } from "@/components/QBricksWord";
import { siteImage } from "@/lib/images";

export const metadata: Metadata = {
  title: "TBricks",
  description:
    "Automated model testing and ESG reporting — every model stressed, every result auditable.",
  alternates: { canonical: "/products/tbricks" },
};

const CAPABILITIES = [
  { label: "automated model testing", body: "Models stressed systematically rather than sampled — regression, drift, and boundary behaviour surfaced before the regulator or the market does it for you." },
  { label: "auditable results", body: "Every test run reproducible and traceable. Evidence, not assertion, for validation teams and internal audit." },
  { label: "esg reporting", body: "ESG reporting built on data you can defend — lineage from disclosure back to source." },
  { label: "one team", body: "Built and maintained by the same engineers who build QBricks — the two platforms share their brick-lattice engineering." },
];

export default function TBricks() {
  return (
    <>
      <section className="pt-40 pb-20">
        <div className="mx-auto grid max-w-(--container-content) items-center gap-12 px-(--spacing-gutter) md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="eyebrow">
              <Link href="/products" className="transition-colors hover:text-glass">we build</Link>
              <span aria-hidden> / </span>
              <span className="text-signal">tbricks</span>
            </p>
            <h1 className="mt-6 text-(length:--text-step-5) leading-[1.02]">
              Prove the model. Defend the number.
            </h1>
            <p className="mt-8 max-w-xl text-(length:--text-step-1) text-glass">
              Automated model testing and ESG reporting for institutions that
              have to show their working.
            </p>
          </div>
          <Reveal className="md:col-span-6">
            <GlassImage
              image={siteImage("tbricks")}
              alt="A lattice of glass bricks under examination, one brick isolated and lit"
              sizes="(min-width: 768px) 45vw, 66vw"
              priority
            />
          </Reveal>
        </div>
      </section>

      <section className="border-t hairline">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-20">
          <p className="eyebrow">what it does</p>
          <Reveal className="mt-10 divide-y divide-ice/12 border-y hairline">
            {CAPABILITIES.map((c) => (
              <article key={c.label} className="grid gap-4 py-8 md:grid-cols-12">
                <h3 className="font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal md:col-span-4">
                  {c.label}
                </h3>
                <p className="text-ice md:col-span-8">{c.body}</p>
              </article>
            ))}
          </Reveal>
          <p className="mt-10">
            <Link href="/products/qbricks" className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">
              Related: <QBricksWord className="text-[11.5px] tracking-[0.08em]" /> →
            </Link>
          </p>
        </div>
      </section>

      <ContactBand heading="Start a conversation about TBricks." />
    </>
  );
}
