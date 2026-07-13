import { Reveal } from "@/components/motion/Reveal";

const TEAM = [
  {
    name: "David Aston",
    role: "Chief Executive Officer",
    img: "/img/team-david",
    bio: "30+ years in financial markets. Founder of Infinium Technology, with a track record of delivering complex, high-profile transformation programmes for tier-1 banks and scaling niche consultancies past 150 people across multiple locations. An active mentor to tech start-ups. Speaks English, French and Italian.",
  },
  {
    name: "Benjamin Aston",
    role: "Manager",
    img: "/img/team-benjamin",
    bio: "Data engineering and financial services technology, from ING's wholesale banking division — QA engineering and business analysis across credit risk models — to product lead for Infinium's internal platforms. Works in Microsoft Fabric, SAS Viya, PySpark, Python, R and SQL; currently deepening Quantexa entity resolution and network analytics.",
  },
];

export function TeamSection({ intro }: { intro?: string }) {
  return (
    <section className="border-t hairline">
      <div className="mx-auto max-w-(--container-content) px-(--spacing-gutter) py-16">
        <p className="eyebrow">our team</p>
        {intro ? <p className="mt-5 max-w-2xl text-(length:--text-step-1) text-glass">{intro}</p> : null}
        <Reveal className="mt-10 grid gap-px md:grid-cols-2">
          {TEAM.map((m) => (
            <article
              key={m.name}
              className="group relative flex gap-6 overflow-hidden border hairline bg-abyss/25 p-6 transition-[border-color,transform,background] duration-(--duration-base) ease-(--ease-out-expo) hover:-translate-y-1 hover:border-signal/60 hover:bg-abyss/50"
            >
              <span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-signal shadow-[0_0_20px_var(--color-signal)] transition-transform duration-(--duration-base) group-hover:scale-x-100" />
              <picture className="shrink-0">
                <source type="image/avif" srcSet={`${m.img}.avif`} />
                <img
                  src={`${m.img}.webp`}
                  alt={`${m.name}, ${m.role}`}
                  width={800}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="block size-28 object-cover grayscale transition-[filter,transform] duration-(--duration-base) ease-(--ease-out-expo) group-hover:scale-[1.02] group-hover:grayscale-0 sm:size-36"
                />
              </picture>
              <div className="min-w-0">
                <h3 className="text-(length:--text-step-1)">{m.name}</h3>
                <p className="eyebrow mt-1">{m.role}</p>
                <p className="mt-3 text-(length:--text-body-sm) leading-relaxed text-ice">{m.bio}</p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
