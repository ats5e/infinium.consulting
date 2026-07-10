import { Lockup } from "@/components/Lockup";

/*
 * Phase 2 brand specimen — a working surface to verify tokens, type and
 * chrome against the design plan. Replaced by the real Home in Phase 4.
 */

const swatches = [
  ["void", "#05070C"],
  ["abyss", "#0A1020"],
  ["navy", "#22365D"],
  ["cobalt", "#365EEE"],
  ["signal", "#73A8FB"],
  ["ice", "#9AC7F8"],
  ["steel", "#93A9BF"],
  ["glass", "#CDDEF1"],
  ["paper", "#FFFFFF"],
] as const;

export default function Home() {
  return (
    <main className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-16">
      <Lockup className="text-base" />

      <section className="mt-20 border-t hairline pt-10">
        <p className="eyebrow">we build</p>
        <h1 className="mt-6 text-(length:--text-hero) leading-[0.95] tracking-[-0.03em] -ml-[0.06em]">
          Data engineering.
          <br />
          For tomorrow.
        </h1>
        <p className="mt-8 max-w-xl text-lg text-ice">
          We deliver across data engineering, data science, digital
          transformation, and governance — combining certified expertise in
          data with deep domain knowledge in AML, KYC, and credit risk.
        </p>
        <div className="mt-10 flex items-center gap-8">
          <a
            href="#"
            className="inline-flex min-h-11 items-center bg-cobalt px-6 font-mono text-(length:--text-label) uppercase tracking-[0.14em] text-paper transition-colors duration-(--duration-fast) ease-(--ease-out-expo) hover:bg-signal hover:text-void"
          >
            Start a conversation
          </a>
          <a
            href="#"
            className="font-mono text-(length:--text-label) uppercase tracking-[0.14em] text-steel transition-colors hover:text-signal"
          >
            Get in touch
          </a>
        </div>
      </section>

      <section className="mt-20 border-t hairline pt-10">
        <p className="eyebrow">palette — extracted from the logo</p>
        <ul className="mt-8 grid grid-cols-3 gap-px sm:grid-cols-9">
          {swatches.map(([name, hex]) => (
            <li key={name} className="border hairline">
              <div className="aspect-square" style={{ background: hex }} />
              <div className="p-2 font-mono text-[10px] uppercase tracking-[0.14em] text-steel">
                {name}
                <br />
                {hex}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 border-t hairline pt-10">
        <p className="eyebrow">type scale — minor third, fluid</p>
        <div className="mt-8 space-y-6">
          <p className="font-display text-(length:--text-step-5) font-medium text-paper">
            Refraction under pressure
          </p>
          <p className="font-display text-(length:--text-step-3) font-medium text-paper">
            We build, not just advise
          </p>
          <p className="max-w-2xl text-(length:--text-body) text-glass">
            Most technology consultancies offer the same thing: frameworks,
            recommendations, and a long handover. We work differently — body
            face is Inter, optical sizing on, −0.011em tracking.
          </p>
          <p className="font-mono text-(length:--text-label) uppercase tracking-[0.14em] text-steel">
            40+ specialists · 17 nationalities ·{" "}
            <span className="tabular-nums">2026</span> — IBM Plex Mono carries
            the technical register
          </p>
        </div>
      </section>
    </main>
  );
}
