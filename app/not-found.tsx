import { PrimaryLink, SecondaryLink } from "@/components/wireframe/Primitives";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[78svh] items-center pb-20 pt-36">
      <div className="mx-auto w-full max-w-(--container-content) px-(--spacing-gutter)">
        <p className="eyebrow text-signal">Error 404</p>
        <h1 className="mt-7 max-w-4xl text-[clamp(2.75rem,6vw,5.5rem)] leading-[1] tracking-[-0.03em]">This page could not be found.</h1>
        <p className="mt-9 max-w-2xl text-[clamp(1.125rem,1.45vw,1.3rem)] leading-[1.45] text-ice">
          The address may have changed, or the page may no longer be available.
        </p>
        <div className="mt-11 flex flex-wrap items-center gap-x-7 gap-y-4">
          <PrimaryLink href="/">Return home</PrimaryLink>
          <SecondaryLink href="/contact">Contact us</SecondaryLink>
        </div>
      </div>
    </section>
  );
}
