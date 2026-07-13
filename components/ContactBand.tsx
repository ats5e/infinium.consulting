import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export function ContactBand({
  heading = "If you have a challenge worth solving, we’d like to hear about it.",
}: {
  heading?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t hairline">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(115,168,251,0.20),transparent_26rem)]" />
      <Reveal className="relative mx-auto max-w-(--container-content) px-(--spacing-gutter) py-24">
        <div className="overflow-hidden border hairline bg-abyss/45 p-8 backdrop-blur-xl md:p-12">
          <p className="eyebrow text-signal">next move</p>
          <h2 className="mt-5 max-w-4xl text-(length:--text-step-4) leading-[1.03]">{heading}</h2>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xl text-ice">
              We work with financial institutions across the Middle East and
              internationally — from executive diagnosis to production
              engineering and long-term control.
            </p>
            <Link
              href="/contact"
              className="inline-flex min-h-11 shrink-0 items-center bg-cobalt px-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-paper transition-colors duration-(--duration-fast) ease-(--ease-out-expo) hover:bg-signal hover:text-void"
            >
              Start the conversation
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
