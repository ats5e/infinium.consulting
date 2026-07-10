import Link from "next/link";
import { Hero } from "@/components/hero/Hero";
import { Differentiators } from "@/components/motion/Differentiators";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { TeamSection } from "@/components/TeamSection";
import { ContactBand } from "@/components/ContactBand";
import { QBricksWord } from "@/components/QBricksWord";
import { siteImage } from "@/lib/images";

const PILLARS = [
  {
    title: "We build, not just advise.",
    body: "Proprietary products in live production. We own the outcome, not the slide deck.",
  },
  {
    title: "DIFC-native.",
    body: "Built inside the world’s leading financial centre — close to the clients and regulators that matter.",
  },
  {
    title: "Financial services only.",
    body: "Deep sector focus, not a generalist shop. Every engagement draws on years of domain expertise.",
  },
];

const DIFFERENTIATORS = [
  {
    n: ".1",
    title: "We speak financial services fluently",
    body: "Most technology firms learn your industry as they go. We don’t. Our team has spent decades inside the banks, regulators, and institutions we now serve. We understand the constraints, the compliance obligations, and the operational realities before the first conversation. You won’t spend time educating us on the basics.",
    image: siteImage("data-science"),
    alt: "Glass spheres connected by filaments of cobalt light, two clusters resolving into one",
  },
  {
    n: ".2",
    title: "We build the technology, not just the blueprint",
    body: "Advice is easy. Delivery is harder. Infinium combines strategic consulting with hands-on engineering, backed by proprietary products already running in production at financial institutions. When we recommend an approach, it’s because we’ve built it ourselves — and we can build it for you.",
    image: siteImage("data-engineering"),
    alt: "Chaotic light resolving through a glass manifold into parallel laminar beams",
  },
  {
    n: ".3",
    title: "We stay until it works",
    body: "Engagements at Infinium don’t end with a handover. We stay close — through implementation, into production, and beyond. Our rolling engagement model means clients draw on our capacity whenever they need it, without restarting from scratch. The relationships we build run for years, not weeks.",
    image: siteImage("governance"),
    alt: "Parallel translucent planes traversed by a single unbroken beam of cobalt light",
  },
];

export default function Home() {
  return (
    <>
      <Hero staticImage={siteImage("hero")} />

      {/* pillars — a set, not a sequence: no numbering */}
      <section aria-label="What defines Infinium">
        <Reveal className="mx-auto grid max-w-(--container-content) gap-px px-(--spacing-gutter) py-20 md:grid-cols-3">
          {PILLARS.map((p) => (
            <article key={p.title} className="border hairline p-8 transition-[border-color,transform] duration-(--duration-fast) ease-(--ease-out-expo) hover:-translate-y-0.5 hover:border-signal/60">
              <h2 className="text-(length:--text-step-1)">{p.title}</h2>
              <p className="mt-4 text-(length:--text-body-sm) leading-relaxed text-ice">{p.body}</p>
            </article>
          ))}
        </Reveal>
      </section>

      {/* why infinium + the two real numbers */}
      <section className="border-t hairline">
        <div className="mx-auto grid max-w-(--container-content) gap-12 px-(--spacing-gutter) py-20 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <p className="eyebrow">why infinium</p>
            <h2 className="mt-6 text-(length:--text-step-3)">
              Most technology consultancies offer the same thing: frameworks,
              recommendations, and a long handover. We work differently.
            </h2>
            <p className="mt-6 max-w-2xl text-ice">
              We combine strategic advisory with hands-on engineering —
              designing solutions and building them ourselves, on proprietary
              technology developed for the challenges financial institutions
              face. Our team has operated inside the world’s leading financial
              hubs. We understand the regulatory landscape, the operational
              constraints, and the pace at which institutions move.
            </p>
          </Reveal>
          <Reveal className="flex gap-12 md:col-span-5 md:flex-col md:justify-center">
            <div>
              <p className="font-display text-(length:--text-step-5) font-medium text-paper">
                <Counter value={40} suffix="+" />
              </p>
              <p className="eyebrow mt-2">specialists</p>
            </div>
            <div>
              <p className="font-display text-(length:--text-step-5) font-medium text-paper">
                <Counter value={17} />
              </p>
              <p className="eyebrow mt-2">nationalities</p>
            </div>
          </Reveal>
        </div>
      </section>

      <Differentiators items={DIFFERENTIATORS} />

      {/* we serve / we build */}
      <section className="border-t hairline">
        <div className="mx-auto grid max-w-(--container-content) gap-16 px-(--spacing-gutter) py-20 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow">we serve</p>
            <h2 className="mt-6 text-(length:--text-step-2)">
              End-to-end technology engagements across the financial services
              value chain — from strategy through production engineering and
              beyond.
            </h2>
            <ul className="mt-8 space-y-3">
              {["Digital transformation", "Data engineering", "Data science", "Governance"].map((s) => (
                <li key={s}>
                  <Link href="/services" className="link-wipe text-ice transition-colors duration-(--duration-fast) hover:text-paper">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <p className="eyebrow">we build</p>
            <h2 className="mt-6 text-(length:--text-step-2)">
              We don’t just consult. Our proprietary product suite is developed
              in-house, deployed with clients, and maintained by the team that
              built it.
            </h2>
            <ul className="mt-8 space-y-3">
              <li>
                <Link href="/products/qbricks" className="link-wipe text-ice transition-colors duration-(--duration-fast) hover:text-paper">
                  <QBricksWord /> — governed, AI-ready data without pipelines
                </Link>
              </li>
              <li>
                <Link href="/products/tbricks" className="link-wipe text-ice transition-colors duration-(--duration-fast) hover:text-paper">
                  TBricks — automated model testing and ESG reporting
                </Link>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* partner stack — certified on every one */}
      <section className="border-t hairline">
        <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <p className="eyebrow max-w-56">
              software partnerships — every consultant certified by the provider
            </p>
            <ul className="grid flex-1 grid-cols-2 gap-px md:grid-cols-4">
              {["Quantexa", "Alteryx", "Microsoft Fabric", "Databricks"].map((p) => (
                <li
                  key={p}
                  className="border hairline p-5 text-center font-mono text-(length:--text-label) uppercase tracking-[0.14em] text-glass"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <TeamSection />
      <ContactBand />
    </>
  );
}
