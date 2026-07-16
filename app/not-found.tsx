import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[78svh] items-center overflow-hidden border-b hairline pb-20 pt-36">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(35,79,189,0.08),transparent_30rem)]" />
      <div className="relative mx-auto w-full max-w-(--container-content) px-(--spacing-gutter)">
        <p className="eyebrow text-signal">Error 404</p>
        <h1 className="mt-6 max-w-4xl text-(length:--text-step-5)">This page could not be found.</h1>
        <p className="mt-7 max-w-2xl text-(length:--text-step-1) leading-normal text-ice">
          The address may have changed, or the page may no longer be available.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="btn-sheen inline-flex min-h-11 items-center bg-cobalt px-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-white shadow-[0_8px_24px_rgba(35,79,189,0.18)] transition-[background-color,box-shadow] duration-(--duration-fast) hover:bg-navy hover:shadow-[0_10px_28px_rgba(23,56,102,0.24)]"
          >
            Return home
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center border hairline bg-white/70 px-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-paper shadow-[0_4px_14px_rgba(23,56,102,0.05)] transition-colors duration-(--duration-fast) hover:border-signal hover:bg-white"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
