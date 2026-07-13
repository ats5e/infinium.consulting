import { Reveal } from "@/components/motion/Reveal";

const STAGES = [
  {
    k: "Diagnose",
    t: "Find the economic fault line",
    b: "Pinpoint the data, risk or operating-model constraint that is stopping the institution from moving.",
  },
  {
    k: "Design",
    t: "Turn ambiguity into a system",
    b: "Shape the target architecture, governance path and first production release around the controls required by financial services.",
  },
  {
    k: "Build",
    t: "Ship with the people who advised",
    b: "Engineer the data products, pipelines, applications and evidence layer instead of throwing the plan over the wall.",
  },
  {
    k: "Scale",
    t: "Stay until it compounds",
    b: "Operationalise the platform, tune the control plane and keep improving with the client team after go-live.",
  },
] as const;

const OUTCOMES = [
  ["AI-ready data estate", "Contracts, lineage and governance built before model acceleration."],
  ["Regulatory confidence", "Evidence generated as part of delivery, not assembled after the fact."],
  ["Lower execution drag", "A specialist team that understands banking, risk and data from day one."],
] as const;

export function SignalArchitecture() {
  return (
    <section className="relative overflow-hidden border-t hairline" aria-labelledby="signal-architecture-title">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/70 to-transparent" />
      <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">the infinium architecture</p>
            <h2 id="signal-architecture-title" className="mt-6 text-(length:--text-step-4) leading-[1.02]">
              From institutional complexity to audited production.
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-5">
            <p className="max-w-xl text-ice">
              The visual system mirrors the operating model: a clear signal
              path through ambiguity. Every section of the site now reinforces
              the promise — strategy and engineering moving as one controlled
              flow.
            </p>
          </Reveal>
        </div>

        <Reveal as="ol" className="timeline-rail mt-14 grid gap-px lg:grid-cols-4">
          {STAGES.map((stage, i) => (
            <li key={stage.k} className="group relative border hairline bg-abyss/35 p-7 transition-[border-color,transform,background] duration-(--duration-base) ease-(--ease-out-expo) hover:-translate-y-1 hover:border-signal/60 hover:bg-abyss/60">
              <span aria-hidden className="absolute -top-px left-7 h-px w-14 bg-signal shadow-[0_0_18px_var(--color-signal)] transition-transform duration-(--duration-base) group-hover:scale-x-150" />
              <div className="flex items-center justify-between gap-4">
                <p className="eyebrow text-signal">{stage.k}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-steel">
                  0{i + 1}
                </p>
              </div>
              <h3 className="mt-8 text-(length:--text-step-1) leading-tight">{stage.t}</h3>
              <p className="mt-4 text-(length:--text-body-sm) leading-relaxed text-ice">{stage.b}</p>
            </li>
          ))}
        </Reveal>

        <div className="mt-16 grid overflow-hidden border hairline bg-void/40 lg:grid-cols-12">
          <div className="relative min-h-80 overflow-hidden border-b hairline p-8 lg:col-span-7 lg:border-b-0 lg:border-r">
            <div aria-hidden className="absolute inset-0 [background-image:radial-gradient(circle_at_20%_50%,rgba(115,168,251,0.28),transparent_18rem),linear-gradient(110deg,transparent_0%,transparent_40%,rgba(115,168,251,0.16)_49%,rgba(115,168,251,0.42)_50%,rgba(54,94,238,0.16)_51%,transparent_60%,transparent_100%)]" />
            <div aria-hidden className="absolute left-[12%] top-1/2 h-px w-[76%] -translate-y-1/2 bg-gradient-to-r from-transparent via-signal to-transparent shadow-[0_0_32px_var(--color-signal)]" />
            <div aria-hidden className="absolute inset-8 grid grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map((node) => (
                <span key={node} className="data-node self-center justify-self-center" />
              ))}
            </div>
            <div className="relative z-10 flex h-full flex-col justify-between">
              <p className="eyebrow">signal path</p>
              <div>
                <h3 className="max-w-md text-(length:--text-step-3)">
                  Strategy becomes a controllable production system.
                </h3>
                <p className="mt-4 max-w-md text-ice">
                  The same design language now runs through the brand,
                  messaging and interface — sharp enough for executives,
                  technical enough for practitioners.
                </p>
              </div>
            </div>
          </div>
          <Reveal className="grid gap-px lg:col-span-5">
            {OUTCOMES.map(([title, body]) => (
              <article key={title} className="border-b hairline p-7 last:border-b-0">
                <p className="eyebrow text-signal">outcome</p>
                <h3 className="mt-3 text-(length:--text-step-1)">{title}</h3>
                <p className="mt-3 text-(length:--text-body-sm) leading-relaxed text-ice">{body}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
