import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export function ContactBand({
  heading = "If you have a challenge worth solving, we’d like to hear about it.",
}: {
  heading?: string;
}) {
  return (
    <section className="border-t hairline">
      <Reveal className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-24">
        <h2 className="max-w-3xl text-(length:--text-step-4)">{heading}</h2>
        <p className="mt-4 max-w-xl text-ice">
          We work with financial institutions across the Middle East and
          internationally.
        </p>
        <Link
          href="/contact"
          className="mt-10 inline-flex min-h-11 items-center bg-cobalt px-6 font-mono text-(length:--text-label) uppercase tracking-[0.14em] text-paper transition-colors duration-(--duration-fast) ease-(--ease-out-expo) hover:bg-signal hover:text-void"
        >
          Get in touch
        </Link>
      </Reveal>
    </section>
  );
}
