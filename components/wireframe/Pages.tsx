import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassImage } from "@/components/GlassImage";
import { Hero } from "@/components/hero/Hero";
import { PartnerLogos } from "@/components/PartnerLogos";
import { QBricksWord } from "@/components/QBricksWord";
import { Reveal } from "@/components/motion/Reveal";
import {
  CASE_STUDIES,
  SERVICES,
  SECTORS,
  TECHNOLOGIES,
  caseStudy,
  type CaseStudy,
} from "@/lib/content";
import { siteImage } from "@/lib/images";
import { CaseStudyExplorer } from "@/components/wireframe/CaseStudyExplorer";
import {
  CardGrid,
  CaseStudyCard,
  ContentSection,
  CTASection,
  HeroSection,
  NumberedCards,
  PrimaryLink,
  SectionIntro,
  SecondaryLink,
  StatGrid,
} from "@/components/wireframe/Primitives";

type PageMeta = { title: string; description: string };
type Route = { render: () => React.ReactNode; meta: PageMeta };

const imgCycle = ["hero", "data-engineering", "data-science", "digital-transformation", "governance", "about-difc", "careers", "qbricks", "tbricks"] as const;

function PageImage({
  slot = "hero",
  alt,
}: {
  slot?: (typeof imgCycle)[number];
  alt: string;
}) {
  return (
    <div className="overflow-hidden border hairline">
      <GlassImage image={siteImage(slot)} alt={alt} sizes="(min-width: 768px) 45vw, 100vw" />
    </div>
  );
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="grid min-h-64 place-items-center border hairline bg-abyss/35 p-8 text-center">
      <p className="eyebrow text-steel">{label}</p>
    </div>
  );
}

/* ---- Home -------------------------------------------------------------- */

const AWARDS = [
  "Appian FS Partner of the Year 2024",
  "Best Places to Work 2023",
  "EcoVadis rated",
  "Great Place to Work Certified",
  "The Consultancy Awards",
  "NEN 4400-1 certified",
  "Best Workplaces 2024",
  "Alteryx Partner",
  "Quantexa Plus Alliance Partner",
];

export function HomeWirePage() {
  return (
    <>
      <Hero staticImage={siteImage("hero")} />

      <ContentSection className="overflow-hidden">
        <p className="eyebrow">An award-winning consultancy</p>
        <div className="relative mt-8 overflow-hidden border-y hairline py-5 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <div className="marquee-track flex w-max gap-12">
            {[0, 1].map((copyIdx) => (
              <div key={copyIdx} aria-hidden={copyIdx === 1} className="flex shrink-0 items-center gap-12">
                {AWARDS.map((award) => (
                  <span key={`${copyIdx}-${award}`} className="whitespace-nowrap font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-steel">
                    {award}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </ContentSection>

      <ContentSection>
        <Reveal className="max-w-4xl">
          <p className="eyebrow text-signal">What we do</p>
          <h2 className="mt-6 text-(length:--text-step-5) leading-[1.04]">
            A specialist alternative to the big-brand consultancies
          </h2>
          <p className="mt-6 max-w-2xl leading-relaxed text-ice">
            Financial services firms trust us to provide market-leading
            strategy, specialist transformation and AI-enabled automation
            solutions. We help our clients rapidly deliver business outcomes.
          </p>
          <p className="mt-8"><SecondaryLink href="/services">Learn more →</SecondaryLink></p>
        </Reveal>
      </ContentSection>

      <ContentSection>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              eyebrow: "Who we work with",
              title: "The world's leading firms across regulated finance",
              slot: "about-difc" as const,
              body: "From Amsterdam and Dubai, we serve the EU, Nordic and Middle East (GCC) markets, across capital markets, banking, insurance, wealth and asset management. Our typical clients are C-suite and senior leaders with a transformation agenda, who are looking to accelerate the business with the use of AI and automation.",
              cta: "Read case studies →",
              href: "/insights",
            },
            {
              eyebrow: "How we do it",
              title: "Extreme engineering, applied with industry context",
              slot: "data-engineering" as const,
              body: "Hands-on practitioners pair deep financial services expertise with disciplined, engineering-led delivery. Packaged methodologies, proven patterns and automation mean we start delivering from day one, measurable outcomes, not slideware.",
              cta: "Our services →",
              href: "/services",
            },
            {
              eyebrow: "Our solutions",
              title: "QBricks and VBricks, disruptive by design",
              slot: "qbricks" as const,
              body: "Our extreme-engineered solutions optimise the delivery value chain end to end: pre-built, proven components that compress implementations from years to months and significantly accelerate return on investment.",
              cta: "Explore QBricks & VBricks →",
              href: "/solutions",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="spot group relative block overflow-hidden border hairline transition-[border-color] duration-(--duration-base) ease-(--ease-out-expo) hover:border-signal/60"
            >
              <picture aria-hidden className="absolute inset-0">
                <source
                  type="image/avif"
                  srcSet={`${siteImage(item.slot).avifMob} 800w, ${siteImage(item.slot).avifHalf} ${Math.round(siteImage(item.slot).width / 2)}w`}
                  sizes="(min-width: 768px) 50vw, 66vw"
                />
                <img
                  src={siteImage(item.slot).webpHalf}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-(--duration-grand) ease-(--ease-out-expo) group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url(${siteImage(item.slot).lqip})`, backgroundSize: "cover" }}
                />
              </picture>
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-void/97 via-void/78 to-void/30" />
              <div className="relative flex min-h-[26rem] flex-col justify-end p-7">
                <p className="eyebrow text-signal">{item.eyebrow}</p>
                <h2 className="mt-4 text-(length:--text-step-2) leading-tight">{item.title}</h2>
                <p className="mt-5 max-w-xl leading-relaxed text-glass">{item.body}</p>
                <p className="mt-7 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">{item.cta}</p>
              </div>
            </Link>
          ))}
        </div>
      </ContentSection>

      <ContentSection>
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <p className="eyebrow">Research &amp; development</p>
            <h2 className="mt-6 text-(length:--text-step-3)">Engineered in the Netherlands and the UAE</h2>
            <p className="mt-6 leading-relaxed text-ice">
              Our R&amp;D teams produce disruptive, best-in-class technology solutions, built from real delivery experience, not theory: QBricks is designed and developed in the Netherlands, VBricks in DIFC, Dubai. Every solution is designed to help our clients save cost and operate more efficiently and effectively: fewer manual processes, faster implementations, measurable results.
            </p>
            <p className="mt-8"><SecondaryLink href="/solutions">See what we've built →</SecondaryLink></p>
          </Reveal>
          <PageImage slot="tbricks" alt="Abstract glass engineering structure" />
        </div>
      </ContentSection>

      <ContentSection>
        <SectionIntro eyebrow="Case studies" title="How we have helped our clients" />
        <div className="mb-8"><SecondaryLink href="/insights">View all case studies →</SecondaryLink></div>
        <div className="grid gap-px md:grid-cols-3">
          {CASE_STUDIES.slice(0, 6).map((c) => <CaseStudyCard key={c.slug} c={c} />)}
        </div>
      </ContentSection>

      {/* kinetic type — the service spine, outlined and drifting */}
      <section aria-hidden className="overflow-hidden border-y hairline py-8">
        <div className="marquee-slow flex w-max items-center gap-16">
          {[0, 1].map((copyIdx) => (
            <div key={copyIdx} className="flex shrink-0 items-center gap-16">
              {SERVICES.map((svc) => (
                <span
                  key={`${copyIdx}-${svc.slug}`}
                  className="kinetic-type whitespace-nowrap font-display text-[clamp(3rem,7vw,6.5rem)] font-extrabold uppercase leading-none tracking-[-0.02em]"
                >
                  {svc.title}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <ContentSection>
        <SectionIntro eyebrow="Why Infinium" title="Five reasons to work with us" />
        <NumberedCards
          columns={3}
          items={[
            { title: "Outcome-focused, not PowerPoint-focused", body: "We are measured on delivered business results — working systems, automated processes, realised savings — not decks and recommendations." },
            { title: "Practitioners, not career consultants", body: "Our team has run the functions you are transforming. We have done it ourselves, so we understand your challenges from the inside." },
            { title: "World-beating engineers, on-shore", body: "Highly educated engineering talent that works alongside you and your teams — on-shore, not off-shore — with the quality and pace that proximity brings." },
            { title: "Deep financial markets, services and asset management expertise", body: "More than 30 years operating across the world's financial centres — capital markets, banking, insurance, wealth and asset management." },
            { title: "Our own solutions, designed to improve efficiency", body: "Pre-built, extreme-engineered solutions like QBricks and VBricks that compress implementations from years to months and cut cost of ownership." },
          ]}
        />
      </ContentSection>

      <CTASection
        title="Ready to accelerate your business?"
        body="Start with a free goals review with one of our industry practice leads."
        label="Schedule a discussion"
      />
    </>
  );
}

/* ---- Services ---------------------------------------------------------- */

const SERVICE_IMAGE: Record<string, Parameters<typeof siteImage>[0]> = {
  "data-and-ai": "data-science",
  "digital-and-automation": "data-engineering",
  "regulation-and-compliance": "governance",
  "strategy-and-change": "about-difc",
  "sustainable-finance": "careers",
  transformation: "digital-transformation",
};

const SERVICE_DETAIL: Record<string, {
  deliverTitle: string;
  deliverBody?: string;
  items: Array<{ title: string; body: string }>;
  links: Array<{ href: string; label: string }>;
  ctaTitle: string;
  ctaBody: string;
}> = {
  "data-and-ai": {
    deliverTitle: "From data foundations to production AI",
    items: [
      { title: "Data engineering & governance", body: "Enterprise data sourced, governed and made trustworthy, lineage, contracts and quality controls that stand up to regulatory scrutiny." },
      { title: "AI from pilots to production", body: "Agentic AI and machine learning deployed responsibly, with the governance, controls and human-in-the-loop patterns regulated firms require." },
      { title: "Decision intelligence", body: "Contextual monitoring and entity resolution at bank scale with Quantexa, for CDD, correspondent banking and financial crime." },
    ],
    links: [
      { href: "/solutions", label: "QBricks, governed, A.I.-ready data in hours →" },
      { href: "/insights", label: "Read the case studies →" },
    ],
    ctaTitle: "Is your data ready for AI?",
    ctaBody: "Start with our AI assessment, or a discussion with a practice lead.",
  },
  "digital-and-automation": {
    deliverTitle: "Retire the spreadsheet, keep the control",
    items: [
      { title: "Process automation", body: "Governed, auditable workflows replacing spreadsheet-bound processes, reporting cycles cut from weeks to minutes." },
      { title: "Low-code platforms", body: "Case management and customer-lifecycle solutions built on Appian and similar platforms, deployed in months, not years." },
      { title: "Intelligent workflows", body: "Automation enriched with AI, from data validation workflows to agentic processes with human-in-the-loop control." },
    ],
    links: [
      { href: "/technologies", label: "Our technology partners →" },
      { href: "/insights", label: "Read the case studies →" },
    ],
    ctaTitle: "Which process costs you the most?",
    ctaBody: "Bring it to a discussion, we'll show you what automation can do with it.",
  },
  "regulation-and-compliance": {
    deliverTitle: "Compliance that stands up to scrutiny",
    items: [
      { title: "Regulatory reporting", body: "Automated, transparent reporting, from transaction reporting to prudential returns, with process times cut from weeks to minutes." },
      { title: "Financial crime", body: "AML, KYC and CDD enhanced with decision intelligence, contextual monitoring that reduces false positives and audit burden." },
      { title: "Controls & model risk", body: "Defensible control frameworks and engineered model testing, credit, KYC, fraud and AML models validated with full evidence trails." },
    ],
    links: [
      { href: "/solutions", label: "VBricks, a major change in model testing →" },
      { href: "/insights", label: "Read the case studies →" },
    ],
    ctaTitle: "Facing new regulation?",
    ctaBody: "Talk to a practice lead about your regulatory change portfolio.",
  },
  "strategy-and-change": {
    deliverTitle: "Strategy built by people who have executed it",
    items: [
      { title: "Technology & data strategy", body: "Multi-year technology and data strategies shaped in weeks, grounded in what the market's platforms can actually deliver." },
      { title: "Operating model design", body: "Target operating models for new entities, new markets and new products, designed for regulatory approval and real-world execution." },
      { title: "Change delivery", body: "Change portfolios shaped, sequenced and led, with the governance to keep initiatives honest against their business case." },
    ],
    links: [{ href: "/insights", label: "Read the case studies →" }],
    ctaTitle: "What is your strategy?",
    ctaBody: "Start with a free goals review with one of our industry practice leads.",
  },
  "sustainable-finance": {
    deliverTitle: "ESG obligations, delivered like engineering",
    items: [
      { title: "ESG reporting", body: "Group-level ESG reporting solutions delivered in weeks, scalable across business areas and flexible enough to track progress to target." },
      { title: "Climate & sustainable funding", body: "Climate and sustainable funding & finance solutions, engineered for auditability and regulatory alignment from day one." },
      { title: "Regulatory alignment", body: "CSRD, SFDR and evolving disclosure regimes translated into data requirements, controls and reporting your teams can run." },
    ],
    links: [{ href: "/insights", label: "Read the case studies →" }],
    ctaTitle: "Where is your ESG programme today?",
    ctaBody: "Talk to a practice lead about your reporting obligations and timeline.",
  },
  transformation: {
    deliverTitle: "Complex change, delivered by practitioners",
    items: [
      { title: "Programme leadership", body: "MD-level practitioners leading your most complex initiatives, accountable for outcomes, not just plans." },
      { title: "Entity stand-up & restructuring", body: "New entities stood up and businesses restructured across jurisdictions, including the financial markets business of a major UK bank in the Netherlands." },
      { title: "Platform migration", body: "Vendor selection through cut-over and stabilisation, delivery compressed with packaged methodologies and pre-built patterns." },
    ],
    links: [{ href: "/insights", label: "Read the case studies →" }],
    ctaTitle: "A transformation agenda to deliver?",
    ctaBody: "Talk to a practice lead about your portfolio of change initiatives.",
  },
};

export function ServicesWirePage() {
  return (
    <>
      <HeroSection
        eyebrow="What we do"
        title="Our services"
        body="Market-leading strategy, specialist transformation and AI-enabled automation solutions for regulated financial services."
      />
      <ContentSection>
        <Reveal className="grid gap-4 md:grid-cols-2">
          {SERVICES.map((service, i) => {
            const img = siteImage(SERVICE_IMAGE[service.slug]);
            const priority = i === 0;
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="spot group relative block overflow-hidden border hairline transition-[border-color] duration-(--duration-base) ease-(--ease-out-expo) hover:border-signal/60"
              >
                <picture aria-hidden className="absolute inset-0">
                  <source
                    type="image/avif"
                    srcSet={`${img.avifMob} 800w, ${img.avifHalf} ${Math.round(img.width / 2)}w`}
                    sizes="(min-width: 768px) 50vw, 66vw"
                  />
                  <img
                    src={img.webpHalf}
                    alt=""
                    loading={priority ? "eager" : "lazy"}
                    fetchPriority={priority ? "high" : "auto"}
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-(--duration-grand) ease-(--ease-out-expo) group-hover:scale-[1.03]"
                    style={{ backgroundImage: `url(${img.lqip})`, backgroundSize: "cover" }}
                  />
                </picture>
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-void/97 via-void/78 to-void/30" />
                <div className="relative flex min-h-80 flex-col justify-end p-8">
                  <p className="eyebrow text-signal">{service.eyebrow}</p>
                  <h2 className="mt-4 text-(length:--text-step-2) leading-tight">{service.title}</h2>
                  <p className="mt-4 max-w-xl text-(length:--text-body-sm) leading-relaxed text-glass">{service.navBody}</p>
                  <p className="mt-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">Learn more →</p>
                </div>
              </Link>
            );
          })}
        </Reveal>
      </ContentSection>
      <CTASection
        title="Not sure where to start?"
        body="We shape strategy and solution options around your goals and challenges."
        label="Schedule a discussion"
      />
    </>
  );
}

export function ServiceDetailPage({ slug }: { slug: string }) {
  const service = SERVICES.find((s) => s.slug === slug);
  const detail = SERVICE_DETAIL[slug];
  if (!service || !detail) notFound();
  return (
    <>
      <HeroSection
        eyebrow={`Our services · ${service.category}`}
        title={service.title}
        body={service.lead}
      />
      <ContentSection>
        <div className="mb-14 overflow-hidden border hairline">
          <GlassImage
            image={siteImage(SERVICE_IMAGE[slug])}
            alt={service.title}
            sizes="(min-width: 1024px) 90vw, 100vw"
          />
        </div>
        <SectionIntro eyebrow="What we deliver" title={detail.deliverTitle} />
        <NumberedCards items={detail.items} />
        <div className="mt-10 flex flex-wrap gap-6">
          {detail.links.map((l) => <SecondaryLink key={l.label} href={l.href}>{l.label}</SecondaryLink>)}
        </div>
      </ContentSection>
      <CTASection title={detail.ctaTitle} body={detail.ctaBody} label="Schedule a discussion" />
    </>
  );
}

/* ---- Solutions --------------------------------------------------------- */

export function SolutionsWirePage() {
  return (
    <>
      <HeroSection
        eyebrow="What we do"
        title="Our solutions"
        body="Pre-built solutions and assessment tooling that shorten delivery timelines and de-risk your programmes."
      />
      <ContentSection>
        <div className="grid gap-px lg:grid-cols-2">
          <article className="spot overflow-hidden border hairline bg-abyss/25">
            <div className="border-b hairline"><GlassImage image={siteImage("qbricks")} alt="QBricks — governed data products" sizes="(min-width: 1024px) 45vw, 66vw" priority /></div>
            <div className="p-8">
            <p className="eyebrow text-signal">Solution</p>
            <h2 className="mt-6 text-(length:--text-step-4)"><QBricksWord /> </h2>
            <p className="mt-4 text-(length:--text-step-1) text-glass">No more data pipelines.</p>
            <p className="mt-6 leading-relaxed text-ice">QBricks turns your systems of record into governed, A.I.-ready data products, in hours, not months or years. Governance is enforced by contract (ODCS) at the point of ingestion, agentic metadata works with a human in the loop, and everything runs on local compute in open, portable formats.</p>
            <p className="mt-5 text-ice">Built for financial-crime use cases like AML and KYC. Works with Databricks, Microsoft Fabric, Snowflake or your own database.</p>
            <p className="mt-5 text-ice">Designed and developed by our R&amp;D team in the Netherlands.</p>
            <div className="mt-8 flex flex-wrap gap-6">
              <a href="https://qbricks.vercel.app/" className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">Visit the QBricks site</a>
              <SecondaryLink href="/contact">Request a demo →</SecondaryLink>
            </div>
            </div>
          </article>
          <article className="spot overflow-hidden border hairline bg-abyss/25">
            <div className="border-b hairline"><GlassImage image={siteImage("tbricks")} alt="VBricks — engineered model testing" sizes="(min-width: 1024px) 45vw, 66vw" /></div>
            <div className="p-8">
            <p className="eyebrow text-signal">Solution</p>
            <h2 className="mt-6 text-(length:--text-step-4)">VBricks</h2>
            <p className="mt-4 text-(length:--text-step-1) text-glass">A major change in model testing.</p>
            <p className="mt-6 leading-relaxed text-ice">VBricks transforms how financial institutions test and validate their models, credit models, KYC models, fraud and AML models and more. Validation that took weeks of manual effort becomes a repeatable, engineered process: automated test packs, challenger comparisons and full evidence trails, run on demand.</p>
            <p className="mt-5 text-ice">Every run is auditable and defensible, built for model risk management and regulatory scrutiny.</p>
            <p className="mt-5 text-ice">Designed and developed by our R&amp;D team in DIFC, Dubai (UAE).</p>
            <div className="mt-8 flex flex-wrap gap-6">
              <a href="https://vbricks.vercel.app/" className="link-wipe font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">Visit the VBricks site</a>
              <SecondaryLink href="/contact">Request a demo →</SecondaryLink>
            </div>
            </div>
          </article>
        </div>
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="Tooling" title="Assessment tooling" />
        <CardGrid
          columns={2}
          items={[
            { title: "AI assessment", body: "A measured view of your AI readiness, data foundations, governance, use-case portfolio and the path from pilots to production, with clear recommendations.", href: "/solutions/ai-assessment", cta: "Learn more →" },
            { title: "Quantexa maturity assessment", body: "A structured review of your Quantexa estate, implementation quality, self-sufficiency, delivery practice and resource capability, with scored findings and a prioritised roadmap.", href: "/solutions/quantexa-maturity-assessment", cta: "Learn more →" },
          ]}
        />
      </ContentSection>
      <CTASection title="See a solution in action" body="We'll walk you through the solutions against your own use cases." label="Request a demo" />
    </>
  );
}

export function AssessmentPage({ kind }: { kind: "ai" | "quantexa" }) {
  const ai = kind === "ai";
  return (
    <>
      <HeroSection
        backHref="/solutions"
        backLabel="Our solutions"
        eyebrow="Assessment tooling"
        title={ai ? "AI assessment" : "Quantexa maturity assessment"}
        body={
          ai
            ? "A measured, practitioner-built view of your AI readiness, from data foundations to governance, so you can move from pilots to production with confidence."
            : "A structured, evidence-based review of your Quantexa estate: 750 questions built by industry practitioners, with defined outcomes and a roadmap to enable self-sustainability."
        }
        stats={!ai ? [
          { value: "750", label: "Assessment questions" },
          { value: "4", label: "Assessment dimensions" },
          { value: "20+", label: "Quantexa projects behind it" },
        ] : undefined}
      />
      {ai ? (
        <>
          <ContentSection>
            <SectionIntro eyebrow="What we assess" title="AI readiness, end to end" />
            <NumberedCards
              columns={4}
              items={[
                { title: "Data foundations", body: "Whether your data estate can feed AI reliably: quality, lineage, governance and access." },
                { title: "Use-case portfolio", body: "Which AI use cases will genuinely move the business, prioritised by value, feasibility and risk." },
                { title: "Governance & risk", body: "Model governance, regulatory alignment and controls fit for supervised financial services." },
                { title: "Pilots to production", body: "The operating model, skills and engineering practice needed to industrialise AI, not just demo it." },
              ]}
            />
            <div className="mt-14 border hairline bg-abyss/25 p-8">
              <p className="eyebrow text-signal">The outcome</p>
              <h3 className="mt-4 text-(length:--text-step-2)">Clear recommendations, sequenced for delivery</h3>
              <p className="mt-5 max-w-3xl leading-relaxed text-ice">You receive a scored readiness profile across the four dimensions, a prioritised use-case portfolio and a sequenced set of recommendations, what to fix, build and govern first, grounded in what we see delivering agentic AI into production for financial services firms.</p>
            </div>
          </ContentSection>
          <CTASection title="Is your business ready for AI?" body="Talk to our practice leads about running the assessment." />
        </>
      ) : (
        <>
          <ContentSection>
            <SectionIntro eyebrow="What we assess" title="Four dimensions, one score" />
            <NumberedCards
              columns={4}
              items={[
                { title: "Implementation", body: "Entity resolution quality, scoring configuration, data ingestion and platform architecture, measured against best practice." },
                { title: "Project delivery", body: "Delivery practice, governance and ways of working across your Quantexa programme." },
                { title: "Resource capability", body: "Team skills, roles and learning pathways, benchmarked against what a self-sufficient organisation needs." },
                { title: "Testing practice", body: "Test coverage, automation and controls across the estate, so change lands safely." },
              ]}
            />
          </ContentSection>
          <ContentSection>
            <SectionIntro eyebrow="How it works" title="Defined outcomes, not opinions" />
            <NumberedCards
              columns={4}
              items={[
                { title: "Evidence gathering", body: "750 practitioner-built questions across the four dimensions, answered through workshops, documentation review and hands-on inspection of the estate." },
                { title: "Scored findings", body: "Every dimension scored against defined maturity levels, so you know exactly where you stand and can benchmark progress over time." },
                { title: "Prioritised roadmap", body: "Findings translate into a sequenced roadmap of recommendations, with defined outcomes for each step." },
                { title: "Self-sustainability", body: "The end goal: a self-reliant Quantexa organisation, reduced dependence on external providers, with the capability plan to keep it that way." },
              ]}
            />
          </ContentSection>
          <CTASection title="Benchmark your Quantexa estate" body="Talk to our Quantexa practice about running the assessment." />
        </>
      )}
    </>
  );
}

/* ---- Sectors, technologies, insights ---------------------------------- */

export function SectorsWirePage() {
  return (
    <>
      <HeroSection
        eyebrow="Where we work"
        title="Sectors"
        body="Deep, current experience across the regulated financial landscape, capital markets, banking, insurance, wealth and the fintech community."
      />
      <ContentSection>
        <NumberedCards items={SECTORS.map((s) => ({ ...s, num: s.num }))} />
      </ContentSection>
      <CTASection title="Talk to us →" />
    </>
  );
}

export function TechnologiesWirePage() {
  return (
    <>
      <HeroSection
        eyebrow="Technology partners"
        title="Technologies"
        body="Best-in-class fintech and platform technology partners across data, process automation, risk, regulation and control."
      />
      <ContentSection>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionIntro eyebrow="Our partnerships" title="Best-in-class partners, long-standing relationships" />
          </div>
          <Reveal className="space-y-5 leading-relaxed text-ice md:col-span-7">
            <p>We work with a deliberately small set of best-in-class platform partners, relationships built over years of joint delivery, not badge-collecting. Our teams hold deep, certified expertise in each platform and have delivered complex programmes on them for the world's leading financial services firms: decision intelligence at bank scale, enterprise data engineering, and automation that takes core processes from weeks to minutes.</p>
            <p>That combination, proven platforms, practitioners who know them inside out, and packaged delivery patterns, is how we de-risk implementations and compress time to value.</p>
            <SecondaryLink href="/insights">Read the case studies →</SecondaryLink>
          </Reveal>
        </div>
        <div className="mt-14">
          <PartnerLogos tileClass="px-6 py-7" />
        </div>
      </ContentSection>
      <ContentSection>
        <CardGrid
          items={TECHNOLOGIES.map((p) => ({
            title: p.name,
            body: p.tagline,
            href: `/technologies/${p.slug}`,
            cta: `How we work with ${p.name} →`,
          }))}
        />
      </ContentSection>
      <CTASection title="Which platform fits your challenge?" body="We navigate the fintech landscape so you don't have to." label="Schedule a discussion" />
    </>
  );
}

const TECHNOLOGY_DETAIL: Record<string, {
  eyebrow: string;
  title: string;
  body: string;
  cards: Array<{ title: string; body: string }>;
  sections?: Array<{ title: string; items: Array<{ title: string; body: string }> }>;
  note?: string;
  links: Array<{ href: string; label: string }>;
  cta: string;
}> = {
  alteryx: {
    eyebrow: "Technologies · Partner",
    title: "How we work with Alteryx",
    body: "Self-service, unified, enterprise-grade analytics automation. As an Authorised Professional Services Partner and Authorised Training Partner, we deliver expert implementation and train your teams to become truly self-sufficient.",
    cards: [
      { title: "Retire the spreadsheet", body: "We replace end-user spreadsheet processes in finance, risk and operations with automated data workflows and full audit trails." },
      { title: "Reporting at pace", body: "Clients have cut core reporting processes from 18 hours to 5 minutes and moved from monthly to weekly cycles with Alteryx automation." },
      { title: "Enablement & training", body: "As an Authorised Training Partner we teach your analysts to streamline financial data processing, automate workflows and enhance analysis, without coding." },
    ],
    sections: [
      { title: "Alteryx projects", items: [
        { title: "Finance EUC elimination", body: "understanding and migrating Excel-based processes onto Alteryx for a FTSE250 insurance company" },
        { title: "IFRS17 cost allocation", body: "analysis and build of a cost allocation engine with sub-1-minute execution time" },
        { title: "Bordereau processing", body: "automation of manual reconciliations and approvals to cut effort and operational errors" },
        { title: "Faster close", body: "automating FX rate generation to remove half a day from month-end close" },
      ] },
      { title: "Our own developed assets", items: [
        { title: "Design pattern best practice", body: "common Excel problems catalogued to accelerate outcomes" },
        { title: "Release pipeline", body: "practical best practice for controlling deployment between environments" },
        { title: "Alteryx adoption", body: "a hands-on approach to technical and skills adoption" },
      ] },
    ],
    note: "We have not only delivered Alteryx projects, we have been buyers, sponsors and implementers of the platform inside major financial institutions.",
    links: [
      { href: "/technologies/alteryx-bootcamps", label: "Spotlight on Alteryx Bootcamps →" },
      { href: "/technologies", label: "← All technologies" },
      { href: "/insights", label: "Read the case studies →" },
    ],
    cta: "Which process should Alteryx take off your hands?",
  },
  appian: {
    eyebrow: "Technologies · FS Partner of the Year 2024",
    title: "How we work with Appian",
    body: "Appian is the only recognised triple crown leader in automation, low-code and case management. We build more powerful apps, dramatically increase productivity and significantly reduce costs on the platform, as partners since 2019.",
    cards: [
      { title: "Case management", body: "We consolidate fragmented processes into governed case-management frameworks, one client went from 15+ processes to a set of 7." },
      { title: "Customer lifecycle", body: "Onboarding, credit-risk and servicing workflows built on Appian, embedded into your existing architecture and data." },
      { title: "Recognised partnership", body: "FS Partner of the Year 2024 and Innovation Partner of the Year in both 2020 and 2021, with certified lead developers and long-standing relationships with Appian's senior leadership." },
    ],
    sections: [
      { title: "Appian projects", items: [
        { title: "Regulation mapping", body: "identification, triage and linking of regulatory obligations to the enterprise risk framework for a top-tier bank" },
        { title: "Private equity deal pipeline", body: "digitising and automating investment committee approval processes" },
        { title: "Transaction monitoring case management", body: "implementation of a financial-crime case management tool" },
        { title: "Insurance BPM", body: "front-to-back automation of legacy and manual processes at a leading London insurer" },
        { title: "Credit & lending", body: "commercial bank loan origination and credit system implementation" },
      ] },
      { title: "Our own developed assets", items: [
        { title: "Quantexa / Appian integration", body: "contextual search embedded within an Appian KYC workflow with risk-based decisioning" },
        { title: "Model Risk Manager", body: "model lifecycle management for the model oversight committee, available on the Appian App Market" },
        { title: "Process workbench", body: "execution and maintenance of process run-books for large-scale outcomes such as month end" },
        { title: "New business process", body: "tracking the creation, analysis, approval and execution of new business initiatives" },
      ] },
    ],
    links: [
      { href: "/technologies", label: "← All technologies" },
      { href: "/insights", label: "Read the case studies →" },
    ],
    cta: "Have a process that needs a platform?",
  },
  databricks: {
    eyebrow: "Technologies · Partner",
    title: "How we work with Databricks",
    body: "Every decision in financial services depends on data, managing risk, complying with regulation, creating exceptional client experiences. We help you transform your data estate with the Databricks Lakehouse Platform and accelerate your A.I. journey.",
    cards: [
      { title: "Unified data management", body: "Data contracts in the Databricks Unity Catalog, all of your data, its lineage and its governance in one place, ready for regulatory reporting." },
      { title: "Scalability", body: "Petabytes of transaction, market and client data, structured and unstructured, handled with ease on a single lakehouse platform." },
      { title: "Advanced analytics & AI", body: "Once you are in control of your data, we help you build on it, from credit risk modelling and fraud detection to information-led intelligence." },
    ],
    sections: [
      { title: "Our Databricks services", items: [
        { title: "Data strategy & architecture", body: "certified Databricks architects aligning the platform with your business priorities, secure, compliant and future-ready" },
        { title: "Lakehouse implementation", body: "building and optimising environments that unify fragmented data systems for real-time, actionable insight" },
        { title: "AI & machine learning", body: "from credit risk modelling to fraud detection and operational efficiency" },
        { title: "Regulatory & ESG reporting", body: "including our CSRD reporting solution combining Databricks and Alteryx" },
        { title: "Capability building", body: "training your teams for self-sufficiency and lasting benefit from the investment" },
      ] },
      { title: "Engineered solutions", items: [
        { title: "QBricks", body: "streams governed, contract-enforced data products straight into your lakehouse, A.I.-ready in hours, not years" },
        { title: "DataVeritas", body: "our data quality validation solution that significantly improves data quality and reduces the need for large cleansing teams" },
      ] },
    ],
    note: "We aim to make the best (Databricks)... better: certified experts focused where they add most value, with engineered solutions doing the generic work.",
    links: [
      { href: "/technologies", label: "← All technologies" },
      { href: "/solutions", label: "Explore QBricks →" },
    ],
    cta: "Is your lakehouse working as hard as it should?",
  },
  "microsoft-fabric": {
    eyebrow: "Technologies · Partner",
    title: "How we work with Microsoft Fabric & Azure",
    body: "Data should do more than sit in silos, it should fuel smarter decisions and support your A.I. agenda. All of our engineers are DP700 certified; we were an early adopter of Fabric and run our entire business on it.",
    cards: [
      { title: "Strategy, architecture & planning", body: "Clear strategies for data governance, migrations and integrations, with guidance on scalable architectures. We know what works, and what doesn't, so plans are realistic and deliver the benefits promised." },
      { title: "Fabric implementation", body: "A generic \"get it done\" deployment results in longer-term pain: costly, non-performant, unable to scale. We use deep Fabric knowledge to make deployments scalable and effective for the use cases that matter to you." },
      { title: "Azure data solutions", body: "Certified Azure engineers designing and building cloud-native data architectures, secure, scalable and cost-effective, with extra leverage where Dynamics 365 F&O or CE is already deployed." },
    ],
    sections: [
      { title: "Bespoke solutions", items: [
        { title: "Not your average Fabric partner", body: "We combine deep engineering expertise with first-hand Fabric experience, delivering bespoke solutions for specific client problems. Once Fabric is deployed, we tackle data quality head-on, for example deploying Quantexa Unify as a workload package so data is entity-resolved across the Fabric estate, and streaming governed, A.I.-ready data products into Fabric with QBricks via SQL push-down." },
      ] },
    ],
    links: [
      { href: "/technologies", label: "← All technologies" },
      { href: "/solutions", label: "Explore QBricks →" },
    ],
    cta: "Planning a Fabric or Azure move?",
  },
  quantexa: {
    eyebrow: "Technologies · Plus Alliance Partner",
    title: "How we work with Quantexa",
    body: "Transform your business with decision intelligence, reimagine how you drive your business, reduce risk and serve customers. Our Quantexa Centre of Excellence supports three core, integrated services.",
    cards: [
      { title: "Platform delivery", body: "Engineers, tech leads and architects implementing out-of-the-box features and tailored solutions, a structured approach from proof of concept through full use-case implementation, with co-delivery that creates a culture of acceleration." },
      { title: "Sustained support", body: "Empowering your transition to a self-sustaining Centre of Excellence: tuning assessments, optimisation strategy and remediation (entity resolution, scoring tuning), plus timely adoption of new platform features." },
      { title: "Upskilling", body: "A masterclass library of SME knowledge, active 1-to-1 and team coaching tailored to your maturity strategy, and continuous assessment to cultivate a highly skilled Quantexa team." },
    ],
    sections: [
      { title: "Achieving self-sufficiency", items: [
        { title: "Four steps to a self-reliant Quantexa team", body: "20+ Projects · 20 Solution experts" },
        { title: "Maturity evaluation", body: "Our maturity assessment framework evaluates your organisation against extensive technical and business criteria, whether you are new to Quantexa or established." },
        { title: "Capability planning", body: "A strategic approach to resource allocation, with tailored experience and learning pathways for critical areas." },
        { title: "Capability building", body: "Clear objectives, an activity roadmap and continuous monitoring to track progress, achievements and milestones." },
        { title: "Self-sufficiency", body: "Greater self-reliance and reduced dependence on external service providers, with better and faster outcomes." },
      ] },
    ],
    links: [
      { href: "/technologies", label: "← All technologies" },
      { href: "/solutions/quantexa-maturity-assessment", label: "Quantexa maturity assessment →" },
    ],
    cta: "How mature is your Quantexa estate?",
  },
};

export function TechnologyDetailPage({ slug }: { slug: string }) {
  const t = TECHNOLOGY_DETAIL[slug];
  if (!t) notFound();
  return (
    <>
      <HeroSection eyebrow={t.eyebrow} title={t.title} body={t.body} />
      <ContentSection>
        <NumberedCards items={t.cards} />
        <div className="mt-10 flex flex-wrap gap-6">
          {t.links.filter((l) => l.label.includes("Spotlight")).map((l) => <SecondaryLink key={l.label} href={l.href}>{l.label}</SecondaryLink>)}
        </div>
        {t.sections?.map((s) => (
          <div key={s.title} className="mt-14">
            <h2 className="text-(length:--text-step-2)">{s.title}</h2>
            <div className="mt-6 divide-y divide-ice/12 border-y hairline">
              {s.items.map((item) => (
                <article key={`${s.title}-${item.title}`} className="grid gap-3 py-5 md:grid-cols-12">
                  <h3 className="text-(length:--text-step-1) md:col-span-4">{item.title}</h3>
                  <p className="text-ice md:col-span-8">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        ))}
        {t.note ? <p className="mt-10 max-w-3xl text-(length:--text-step-1) text-glass">{t.note}</p> : null}
        <div className="mt-10 flex flex-wrap gap-6">
          {t.links.filter((l) => !l.label.includes("Spotlight")).map((l) => <SecondaryLink key={l.label} href={l.href}>{l.label}</SecondaryLink>)}
        </div>
      </ContentSection>
      <CTASection title={t.cta} label="Schedule a discussion" />
    </>
  );
}

export function AlteryxBootcampsPage() {
  return (
    <>
      <HeroSection
        backHref="/technologies/alteryx"
        backLabel="Alteryx"
        eyebrow="Spotlight"
        title="Alteryx Bootcamps"
        body="Intensive, hands-on training that takes your analysts from spreadsheet dependence to governed, self-service analytics, delivered by an Alteryx Authorised Training Partner."
      />
      <ContentSection>
        <SectionIntro eyebrow="The format" title="Learn by building, on your own data" />
        <NumberedCards items={[
          { title: "Foundation Bootcamp", body: "Five days. Workflow fundamentals through advanced preparation, macros, apps and governed deployment patterns, building towards Alteryx certification, participants leave having automated a real process from their own desk." },
          { title: "Finance bootcamp", body: "Tailored for finance functions: month-end automation, reconciliations and regulatory reporting patterns drawn from our real engagements." },
          { title: "Risk bootcamp", body: "Tailored for risk functions: risk data aggregation, control testing, monitoring and model input preparation, built on real engagement patterns." },
        ]} />
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="Why it works" title="Built for self-sufficiency" />
        <NumberedCards columns={4} items={[
          { title: "Your data, not sample data.", body: "Exercises are built on your own processes, so the bootcamp ends with working automations, not just certificates." },
          { title: "Practitioners as trainers.", body: "Led by consultants who deliver Alteryx engagements in financial services every week, drawing on our design-pattern playbooks." },
          { title: "Governance from day one.", body: "Release pipelines, documentation standards and controls are built into every exercise, so what your team builds is auditable." },
          { title: "Post-bootcamp coaching.", body: "Structured follow-up sessions embed the skills and keep momentum after the classroom ends." },
        ]} />
      </ContentSection>
      <CTASection title="Book a bootcamp for your team" body="Delivered on site or remotely, tailored to your processes and data." />
    </>
  );
}

export function InsightsWirePage() {
  const testimonials = [
    { headline: "From 18 hours to 5 minutes", quote: "One of our core processes was reduced from 18 hours to 5 minutes through Alteryx automation and the fantastic support the team provided.", who: "Cost Management Team", org: "Global universal bank" },
    { headline: "12 hours of savings per month", quote: "A successful rollout of Alteryx in finance has saved around 12 hours a month for our operational reporting, moving us from monthly to weekly reporting.", who: "Global Sales Effectiveness Manager", org: "Global universal bank" },
    { headline: "4 weeks to 5 minutes", quote: "Key regulatory reporting process times went from 4 weeks down to just 5 minutes, with a single source of trading data now leveraged for further reporting.", who: "EMEA Process Owner", org: "Tier-1 global bank" },
    { headline: "An ESG solution in under 3 months", quote: "An enterprise-viable ESG reporting solution delivered in just over 8 weeks, engineered to scale across 12 business areas.", who: "Transformation Lead, Finance & Risk", org: "Leading bank" },
    { headline: "A digital platform in 8 weeks", quote: "Our alternatives investment process was digitised in less than 3 months, creating an end-to-end deal platform we now show to our clients.", who: "CTO", org: "Leading PE firm" },
    { headline: "A 5-year strategy in 3 months", quote: "The specialist team hit the ground running and delivered our 5-year technology strategy in less than 3 months.", who: "Group CIO", org: "Leading digital insurer" },
  ];
  const posts = [
    ["Insurance & tech", "The agentic bank: insights from Banking Transformation Summit 2026"],
    ["Insurance & tech", "From AI pilots to production: agentic AI in FS and insurance"],
    ["Digital & automation", "Transaction reporting transparency: steps to eradicating the black box"],
    ["Digital & automation", "Is your business ready for agentic AI?"],
    ["Data", "Integrating CDD controls into transaction monitoring with Quantexa"],
    ["Data", "Bridging the gaps to self-sufficiency in Quantexa deployments"],
  ];
  return (
    <>
      <HeroSection
        eyebrow="Insights"
        title="Case studies"
        body="We leverage industry expertise together with the world's leading decision intelligence, data and automation technologies to deliver enterprise business solutions and transformation faster, cheaper and more effectively."
      />
      <ContentSection>
        <SectionIntro
          title="How have we helped our clients?"
          body="Our clients have implemented AI and data-driven decisioning, automated processes from weeks to minutes, accelerated solution development by 8–10 times and saved months from transformation timelines."
        />
        <CaseStudyExplorer />
      </ContentSection>
      <CTASection title="Focus your strategy, set your plan and modernise your financial services business." href="/services" label="Our services" />
      <ContentSection>
        <SectionIntro eyebrow="Testimonials" title="What do our clients say?" />
        <div className="grid gap-px md:grid-cols-3">
          {testimonials.map((t) => (
            <article key={t.headline} className="border hairline bg-abyss/25 p-7">
              <p className="font-display text-(length:--text-step-4) text-signal">“</p>
              <h3 className="mt-2 text-(length:--text-step-1)">{t.headline}</h3>
              <p className="mt-4 text-(length:--text-body-sm) leading-relaxed text-ice">{t.quote}</p>
              <div className="mt-6 border-t hairline pt-4">
                <p className="text-(length:--text-body-sm) text-paper">{t.who}</p>
                <p className="eyebrow mt-1">{t.org}</p>
              </div>
            </article>
          ))}
        </div>
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="News & perspectives" title="Latest perspectives" />
        <div className="divide-y divide-ice/12 border-y hairline">
          {posts.map(([tag, title]) => (
            <div key={title} className="grid gap-4 py-5 md:grid-cols-[200px_1fr_auto] md:items-baseline">
              <p className="eyebrow">{tag}</p>
              <h3 className="text-(length:--text-step-1)">{title}</h3>
              <span className="font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-signal">Read →</span>
            </div>
          ))}
        </div>
      </ContentSection>
    </>
  );
}

export function CaseStudyWirePage({ slug }: { slug: string }) {
  const c = caseStudy(slug);
  if (!c) notFound();
  return (
    <>
      <HeroSection
        backHref="/insights"
        backLabel="All case studies"
        eyebrow={`Case study — ${c.service}`}
        title={c.title}
        body={c.summary}
        stats={[
          { value: c.sector, label: "Sector" },
          { value: c.location, label: "Location" },
        ]}
      />
      <ContentSection>
        <StatGrid stats={c.stats} />
      </ContentSection>
      <ContentSection>
        <div className="overflow-hidden border hairline">
          <GlassImage image={c.image()} alt={c.title} sizes="(min-width: 1024px) 90vw, 100vw" />
        </div>
      </ContentSection>
      <ContentSection>
        <div className="grid gap-px md:grid-cols-3">
          {[
            ["The challenge", c.challenge],
            ["Our approach", c.approach],
            ["The outcome", c.outcome],
          ].map(([title, list]) => (
            <article key={title as string} className="border hairline bg-abyss/25 p-7">
              <h2 className="text-(length:--text-step-2)">{title as string}</h2>
              <ul className="mt-6 space-y-4">
                {(list as string[]).map((item) => (
                  <li key={item} className="flex gap-4 text-(length:--text-body-sm) leading-relaxed text-ice">
                    <span aria-hidden className="mt-2 h-px w-5 shrink-0 bg-signal" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="Related" title="More case studies" />
        <div className="mb-8"><SecondaryLink href="/insights">View all case studies →</SecondaryLink></div>
        <div className="grid gap-px md:grid-cols-3">
          {c.related.map((slug) => {
            const r = caseStudy(slug)!;
            return <CaseStudyCard key={slug} c={r} />;
          })}
        </div>
      </ContentSection>
      <CTASection title="Facing a similar challenge? Talk to the team that has done this before." />
    </>
  );
}

/* ---- About and adjacent pages ----------------------------------------- */

export function AboutWirePage() {
  return (
    <>
      <HeroSection
        eyebrow="Who we are"
        title="It's all about business outcomes"
        body="We have stood in the same shoes as our clients. Everything we do is about helping our clients succeed."
      />
      <ContentSection>
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <p className="eyebrow text-signal">Our firm</p>
            <h2 className="mt-6 text-(length:--text-step-3)">Industry practitioners, not career consultants</h2>
            <p className="mt-6 leading-relaxed text-ice">Our leadership team are hands-on MD-level practitioners from major global financial services firms, with deep experience of the same challenges our clients face. Delivery teams pair seasoned industry specialists with dynamic new talent.</p>
            <p className="mt-5 leading-relaxed text-ice">Together with best-in-class fintech and platform partners, we deliver unique business solutions with the latest enabling technologies, helping our clients go faster.</p>
          </Reveal>
          <Placeholder label="Image needed: Team photo" />
        </div>
      </ContentSection>
      <ContentSection>
        <div className="grid gap-12 md:grid-cols-[380px_1fr]">
          <Placeholder label="Image needed: Portrait, David Aston" />
          <Reveal>
            <p className="eyebrow text-signal">Founder</p>
            <h2 className="mt-6 text-(length:--text-step-3)">David Aston, Chief Executive Officer</h2>
            <p className="mt-6 leading-relaxed text-ice">David founded Infinium after more than 30 years operating in financial markets, across all of the world's financial centres.</p>
            <p className="mt-5 leading-relaxed text-ice">Having led complex transformation from inside major global financial services firms, he built Infinium on a simple conviction: clients are best served by practitioners who have stood in their shoes, paired with disciplined, engineering-led delivery. That conviction, engineering with context, shapes everything the firm does, from the QBricks and VBricks solutions to how every engagement is staffed and run. When you meet with David or any of our team, you won't be buried in theory or PowerPoint presentations. Instead you'll have a deep, detailed discussion about how Infinium can help you with your toughest issues.</p>
            <p className="mt-8"><PrimaryLink href="/contact">Start a conversation</PrimaryLink></p>
          </Reveal>
        </div>
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="Management team" title="Leadership" body="Hands-on practitioners from major global financial services firms, leading from Amsterdam and Dubai." />
        <CardGrid columns={3} items={[
          { eyebrow: "Placeholder role", title: "Placeholder: leader name", body: "Delivery and operations across both hubs." },
          { eyebrow: "Placeholder role", title: "Placeholder: leader name", body: "Leads the Netherlands and Dubai R&D teams." },
          { eyebrow: "Placeholder role", title: "Placeholder: leader name", body: "Client relationships across the GCC, from the DIFC." },
        ]} />
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="Locations" title="Where you'll find us" body="We serve clients across the EU, Nordic and Middle East (GCC) markets from our two hubs." />
        <CardGrid columns={2} items={[
          { title: "Amsterdam, The Netherlands", body: "Infinium Consulting B.V., head office", href: "/about/amsterdam", cta: "Visit this office →" },
          { title: "DIFC, Dubai", body: "Infinium Technology Ltd, Middle East", href: "/about/dubai", cta: "Visit this office →" },
        ]} />
      </ContentSection>
      <CTASection title="Join the team" body="We are a values-led firm built from seasoned professionals and dynamic new talent." href="/careers" label="Your career" />
    </>
  );
}

export function CulturePage() {
  return (
    <>
      <HeroSection
        eyebrow="Who we are"
        title="Our culture"
        body="An international firm by design. Our people come from across Europe, the Middle East and beyond, working in multiple languages across two hubs, and bringing the perspective of the world's financial centres to every engagement."
        stats={[
          { value: "15+", label: "Nationalities" },
          { value: "10+", label: "Languages spoken" },
          { value: "2", label: "Hubs, Amsterdam & Dubai" },
          { value: "3", label: "Regions served, EU, Nordics, GCC" },
        ]}
      />
      <ContentSection>
        <SectionIntro eyebrow="International by design" title="Local language, local context, global standards" />
        <Reveal className="max-w-3xl space-y-5 leading-relaxed text-ice">
          <p>Our clients operate across borders, so do we. Engagement teams work in the client's language wherever we can, Dutch, English, Hindi, Spanish, Italian, French, German and more, and always with an understanding of the local regulatory and business context.</p>
          <p>Serving the EU, Nordic and GCC markets from Amsterdam and Dubai means our people move between cultures daily. That fluency is a professional skill we hire for and develop, not an afterthought.</p>
        </Reveal>
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="What shapes us" title="The values behind the work" />
        <NumberedCards items={[
          { title: "One team, two hubs", body: "Amsterdam and Dubai operate as a single practice: shared playbooks, shared R&D, one quality bar. People move between hubs and engagements freely." },
          { title: "Seniors alongside new talent", body: "MD-level practitioners work directly with graduates, interns and One4One participants, apprenticeship in the real sense, on live engagements." },
          { title: "Difference is the advantage", body: "Different nationalities, languages and career backgrounds make our teams sharper. We recruit for diverse perspectives and build engagement teams around them." },
        ]} />
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="Life at Infinium" title="How it feels day to day" />
        <NumberedCards columns={4} items={[
          { title: "Small teams, real responsibility.", body: "No bench, no shadowing rotations, everyone contributes to client outcomes from their first week." },
          { title: "Engineering culture.", body: "R&D time is protected. Ideas from any level become products, QBricks and VBricks both started as internal builds." },
          { title: "Travel with purpose.", body: "Cross-hub working and client sites across the EU, Nordics and GCC, international exposure early in your career." },
          { title: "Giving back is structural.", body: "One4One internships and our university partnerships are part of how the firm runs, not a side programme." },
        ]} />
      </ContentSection>
      <CTASection title="Sound like your kind of firm?" body="See open roles or start a conversation with the team." href="/careers" label="Your career" />
    </>
  );
}

export function SocialResponsibilityPage() {
  return (
    <>
      <HeroSection
        eyebrow="Social responsibility"
        title="One4One"
        body="Established in 2020 with our partner NextWave Consulting in London, One4One is our social enterprise internship programme. The principle is simple: for every new client engagement we win, we create a paid internship for a young adult taking their first step into a professional career, so our growth directly creates opportunity for the next generation."
      />
      <ContentSection>
        <SectionIntro eyebrow="The programme" title="Opportunities for the next generation" />
        <Reveal className="max-w-3xl space-y-5 leading-relaxed text-ice">
          <p>Some of the most powerful initiatives we have been involved in are those that create opportunities for the next generation. One4One helps young adults take their first step in a professional career through a unique, immersive internship experience, with each year's positions created in tandem with each new client engagement.</p>
          <p>Interns learn about the financial services industry, its biggest challenges and opportunities, and how these can be addressed with technology, learning directly from key players in the industry, including our clients and alliance partners, who generously share their knowledge throughout the programme.</p>
        </Reveal>
      </ContentSection>
      <ContentSection>
        <NumberedCards items={[
          { title: "One engagement, one internship", body: "Every new client engagement funds a paid internship position, so our growth directly creates opportunity." },
          { title: "Immersive, real work", body: "Interns work inside live engagements and our R&D teams, not on the sidelines, building skills in data, AI and financial services." },
          { title: "Learning from the industry", body: "Clients and alliance partners share their knowledge and insights with each cohort throughout the programme." },
        ]} />
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="Academic partnerships" title="Investing in the next generation of talent" />
        <StatGrid stats={[
          { value: "50+", label: "Students mentored & guided" },
          { value: "6", label: "Years, since 2020" },
        ]} />
        <p className="mt-10 max-w-3xl leading-relaxed text-ice">We hold long-standing partnerships with the University of Groningen and the Erasmus School of Business Management. Since 2020 we have mentored and guided more than 50 students through internships, thesis supervision and hands-on project work, bringing academic rigour into our engagements and real financial services experience into their careers.</p>
        <CardGrid columns={2} items={[
          { title: "University of Groningen", body: "Long-standing partnership, student mentoring, internships and thesis supervision." },
          { title: "Erasmus School of Business Management", body: "Long-standing partnership, guiding students from business school into financial services careers." },
        ]} />
      </ContentSection>
      <CTASection title="Interested in joining One4One?" body="Tell us about yourself, we review applications for every new cohort." label="Get in touch" />
    </>
  );
}

export function IndustryEventsPage() {
  return (
    <>
      <HeroSection eyebrow="Who we are" title="Industry events" body="Where you'll find us. We speak, sponsor and share our thinking at the industry's leading events across the EU, Nordics and GCC, come and meet the team." />
      <ContentSection>
        <CardGrid columns={3} items={[
          { eyebrow: "Speaking", title: "TEDx", body: "Sharing our perspective on engineering, AI and the future of financial services with audiences beyond the industry." },
          { eyebrow: "Copenhagen", title: "Nordic Fintech Week", body: "Meeting the Nordic fintech community, where we serve banks, insurers and fintechs across the region." },
          { eyebrow: "Amsterdam", title: "Money20/20", body: "The world's biggest fintech gathering, on our home ground. Find us on the floor, or book time with the team in advance." },
        ]} />
      </ContentSection>
      <CTASection title="Meet us at an event" body="Book time with our practice leads ahead of any event we attend." />
    </>
  );
}

export function ConsultingPartnersPage() {
  return (
    <>
      <HeroSection eyebrow="Who we are" title="Our business consulting partners" body="Alongside our technology partnerships, we work with established business consultancies who share our conviction: real industry experience at the heart of consulting." />
      <ContentSection>
        <div className="space-y-px">
          {[
            {
              eyebrow: "Partner · GCC",
              title: "Aspiro Management Consultants",
              facts: ["Region — Middle East (GCC), based in Dubai", "Focus — Business transformation for financial services", "Website — aspiro.me"],
              ps: [
                "Aspiro are business transformation management consultants who help ambitious financial services companies transform, grow and thrive in the regional and global marketplace.",
                "Based in the GCC with global reach to source talent, Aspiro puts real industry experience at the heart of consultancy, its team includes former bank COOs, CEOs and heads of operations from major regional and international institutions. Their extensive network of associates and partners allows engagements to scale up and down rapidly.",
                "Together, Infinium and Aspiro pair engineering-led delivery, QBricks, VBricks and our assessment tooling, with deep, on-the-ground business transformation expertise across the GCC's banks and financial institutions.",
              ],
              cta: "Talk to us about working in the GCC →",
            },
            {
              eyebrow: "Partner · UK",
              title: "NextWave Consulting",
              facts: ["Region — United Kingdom, 100 Bishopsgate, City of London", "Focus — Digital acceleration for financial services", "Website — nxwave.com"],
              ps: [
                "NextWave is an award-winning digital acceleration consultancy based in the heart of the City, London's financial hub, a specialist alternative to the big-brand consultancies.",
                "Established in 2019, NextWave's leadership team has a 30-year track record supporting Global Tier 1 clients with complex change delivery, from specialised advisory to enterprise-scale programmes. The team is composed of senior C-level executives focused on large-scale transformation, data and digitally focused initiatives, everything done agile, at pace, and supported by best-in-class technology partners.",
                "Infinium and NextWave work in long-standing partnership, helping global clients with digital transformation initiatives and large-scale transformation across the UK and Europe.",
              ],
              cta: "Talk to us about working in the UK →",
            },
          ].map((p) => (
            <article key={p.title} className="grid gap-8 border hairline bg-abyss/25 p-8 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="eyebrow text-signal">{p.eyebrow}</p>
                <h2 className="mt-4 text-(length:--text-step-2)">{p.title}</h2>
                <ul className="mt-6 space-y-2 text-(length:--text-body-sm) text-steel">{p.facts.map((f) => <li key={f}>{f}</li>)}</ul>
              </div>
              <div className="space-y-5 leading-relaxed text-ice md:col-span-8">
                {p.ps.map((x) => <p key={x}>{x}</p>)}
                <SecondaryLink href="/contact">{p.cta}</SecondaryLink>
              </div>
            </article>
          ))}
        </div>
      </ContentSection>
      <CTASection title="Interested in partnering with Infinium?" body="We partner selectively, where industry depth meets engineering discipline." />
    </>
  );
}

export function CareersWirePage() {
  return (
    <>
      <HeroSection eyebrow="Who we are" title="Your career" body="We are a values-led firm built from seasoned professionals and dynamic new talent, working on the hardest problems in financial services, from Amsterdam and Dubai." />
      <ContentSection>
        <div className="mb-14 grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <SectionIntro eyebrow="Why Infinium" title="Work that would take a decade elsewhere" />
          </div>
          <div className="overflow-hidden border hairline md:col-span-5">
            <GlassImage image={siteImage("careers")} alt="An immaculate glass-walled workspace at dawn" sizes="(min-width: 768px) 40vw, 100vw" />
          </div>
        </div>
        <NumberedCards items={[
          { title: "Learn from practitioners", body: "Work directly with MD-level leaders who have run these programmes inside the world's largest financial institutions." },
          { title: "Real responsibility, early", body: "Small teams and client-facing delivery from day one, your work ships to leading banks and financial institutions, not a slide library." },
          { title: "Engineering with context", body: "Build disruptive products — QBricks in our Netherlands R&D team, VBricks in DIFC, Dubai — or deliver them with clients." },
        ]} />
      </ContentSection>
      <ContentSection>
        <SectionIntro eyebrow="Open roles" title="Current openings" />
        <div className="divide-y divide-ice/12 border-y hairline">
          {[
            ["Senior Consultant", "Data & AI", "Amsterdam"],
            ["Consultant", "Model validation (VBricks)", "Dubai (DIFC)"],
            ["Data Engineer", "R&D, QBricks", "Amsterdam"],
            ["Engagement Manager", "Transformation", "Dubai (DIFC)"],
          ].map(([title, practice, location]) => (
            <div key={title} className="grid gap-3 py-5 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center">
              <h3 className="text-(length:--text-step-1)">{title}</h3>
              <p className="text-ice">{practice}</p>
              <p className="text-steel">{location}</p>
              <SecondaryLink href="/contact">Apply →</SecondaryLink>
            </div>
          ))}
        </div>
        <p className="mt-8 text-ice">Don't see your role? We are always interested in exceptional people, <Link href="/contact" className="link-wipe text-signal">start a conversation</Link>.</p>
      </ContentSection>
      <CTASection title="Ready to do the best work of your career?" body="Tell us about yourself and the work you want to do." label="Get in touch" />
    </>
  );
}

export function LocationPage({ city }: { city: "amsterdam" | "dubai" }) {
  const dubai = city === "dubai";
  return (
    <>
      <HeroSection
        eyebrow="Locations"
        title={dubai ? "DIFC, Dubai" : "Amsterdam, The Netherlands"}
        body={dubai ? "Our Middle East hub in the Dubai International Financial Centre, home of our second R&D team, serving the GCC markets." : "Our headquarters, home of Infinium Consulting B.V. and one of our two R&D teams, serving the EU and Nordic markets."}
      />
      <ContentSection>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionIntro eyebrow="From this office" title={dubai ? "Middle East (GCC) markets" : "EU & Nordic markets"} />
            <p className="leading-relaxed text-ice">
              {dubai
                ? "From the DIFC we serve banks, financial markets firms and fintechs across the GCC. Supported by the UAE government to design, develop and deliver AI-focused solutions, our teams are based in the state-of-the-art InnovationOne innovation centre in DIFC, Dubai. The office houses our second R&D team, where VBricks — our model testing and validation solution — is designed and developed."
                : "From Amsterdam we serve banks, financial markets firms, insurers and fintechs across the EU and the Nordics. The office also houses our Netherlands R&D team, where QBricks — our governed, AI-ready data products solution — is designed and developed."}
            </p>
            <p className="mt-8"><SecondaryLink href="/solutions">Explore our solutions →</SecondaryLink></p>
            <div className="mt-12">
              <Placeholder label={dubai ? "Video needed: Inside our DIFC office — assets/video/dubai-office.mp4" : "Video needed: Inside our Amsterdam office — assets/video/amsterdam-office.mp4"} />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {(dubai
                ? [
                    ["dxb-innovationone", "InnovationOne, DIFC"],
                    ["dxb-workspace", "The workspace"],
                    ["dxb-ai-campus", "Dubai AI Campus"],
                    ["dxb-entrance", "InnovationOne entrance"],
                  ]
                : [
                    ["ams-office", "Inside our Amsterdam office"],
                    ["ams-building", "Our Amsterdam building"],
                    ["ams-workspace", "The workspace"],
                    ["ams-atrium", "The atrium"],
                  ]
              ).map(([slot, caption]) => (
                <figure key={slot} className="overflow-hidden border hairline">
                  <GlassImage
                    image={siteImage(slot as Parameters<typeof siteImage>[0])}
                    alt={caption}
                    sizes="(min-width: 640px) 30vw, 100vw"
                  />
                  <figcaption className="eyebrow p-4">{caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
          <aside className="border hairline bg-abyss/25 p-7 lg:col-span-5">
            <p className="eyebrow text-signal">{dubai ? "Office details" : "Head office"}</p>
            <dl className="mt-6 space-y-6">
              {(dubai ? [
                ["Entity", "Infinium Technology Ltd"],
                ["Location", "Dubai International Financial Centre"],
                ["Address", "InnovationOne, DIFC, Dubai"],
                ["Email", "sales@infinium-technology.com"],
              ] : [
                ["Entity", "Infinium Consulting B.V."],
                ["Address", "Fred Roeskestraat 115, Amsterdam, The Netherlands"],
                ["Email", "sales@infinium.consulting"],
              ]).map(([k, v]) => (
                <div key={k}>
                  <dt className="eyebrow">{k}</dt>
                  <dd className="mt-2 text-ice">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8"><PrimaryLink href="/contact">Start a conversation</PrimaryLink></p>
          </aside>
        </div>
      </ContentSection>
    </>
  );
}

/* ---- Contact ----------------------------------------------------------- */

export function ContactWireIntro({ form }: { form: React.ReactNode }) {
  return (
    <>
      <HeroSection
        eyebrow="Contact"
        title="Start a conversation"
        body="We provide a free goals review with one of our industry leaders to understand your ambitions and explore the options to accelerate your business."
      />
      <ContentSection>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionIntro eyebrow="How it works" title="Working with Infinium" />
            <NumberedCards columns={3} items={[
              { num: "1", title: "Schedule a discussion", body: "With one of our industry practice leads to review your goals and challenges." },
              { num: "2", title: "Get a customised approach", body: "We shape strategy and solution options around your business." },
              { num: "3", title: "Deliver together", body: "We work with you to deliver your strategic initiatives." },
            ]} />
            <div className="mt-10 grid gap-px sm:grid-cols-2">
              {[
                {
                  city: "Amsterdam, The Netherlands",
                  entity: "Infinium Consulting B.V.",
                  address: ["Edge Olympic", "Fred. Roeskestraat 115", "Amsterdam, NL"],
                  email: "sales@infinium.consulting",
                  href: "/about/amsterdam",
                },
                {
                  city: "DIFC, Dubai",
                  entity: "Infinium Technology Ltd",
                  address: ["InnovationOne", "Dubai International Financial Centre", "Dubai, UAE"],
                  email: "sales@infinium-technology.com",
                  href: "/about/dubai",
                },
              ].map((office) => (
                <article key={office.city} className="border hairline bg-abyss/25 p-6">
                  <p className="eyebrow text-signal">{office.city}</p>
                  <p className="mt-4 text-(length:--text-body-sm) text-paper">{office.entity}</p>
                  <p className="mt-2 text-(length:--text-body-sm) leading-relaxed text-ice">
                    {office.address.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </p>
                  <a href={`mailto:${office.email}`} className="link-wipe mt-4 inline-block text-(length:--text-body-sm) text-signal">
                    {office.email}
                  </a>
                  <p className="mt-3">
                    <Link href={office.href} className="link-wipe font-mono text-[10px] uppercase tracking-[0.08em] text-steel hover:text-paper">
                      Visit this office →
                    </Link>
                  </p>
                </article>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <h2 className="mb-8 text-(length:--text-step-2)">Tell us about your goals</h2>
            {form}
          </div>
        </div>
      </ContentSection>
    </>
  );
}

/* ---- Route table ------------------------------------------------------- */

export function routeFor(slug: string[]): Route {
  const path = `/${slug.join("/")}`;
  const routes: Record<string, Route> = {
    "/": { render: () => <HomeWirePage />, meta: { title: "Engineering with context.", description: "Banking & financial services consultancy." } },
    "/services": { render: () => <ServicesWirePage />, meta: { title: "Our services", description: "Market-leading strategy, specialist transformation and AI-enabled automation solutions for regulated financial services." } },
    "/solutions": { render: () => <SolutionsWirePage />, meta: { title: "Our solutions", description: "Pre-built solutions and assessment tooling that shorten delivery timelines and de-risk your programmes." } },
    "/solutions/ai-assessment": { render: () => <AssessmentPage kind="ai" />, meta: { title: "AI assessment", description: "A measured, practitioner-built view of your AI readiness." } },
    "/solutions/quantexa-maturity-assessment": { render: () => <AssessmentPage kind="quantexa" />, meta: { title: "Quantexa maturity assessment", description: "A structured, evidence-based review of your Quantexa estate." } },
    "/sectors": { render: () => <SectorsWirePage />, meta: { title: "Sectors", description: "Deep, current experience across the regulated financial landscape." } },
    "/technologies": { render: () => <TechnologiesWirePage />, meta: { title: "Technologies", description: "Best-in-class fintech and platform technology partners." } },
    "/technologies/alteryx-bootcamps": { render: () => <AlteryxBootcampsPage />, meta: { title: "Alteryx Bootcamps", description: "Intensive, hands-on Alteryx training." } },
    "/insights": { render: () => <InsightsWirePage />, meta: { title: "Case studies", description: "How we have helped our clients." } },
    "/about": { render: () => <AboutWirePage />, meta: { title: "About us", description: "It's all about business outcomes." } },
    "/about/culture": { render: () => <CulturePage />, meta: { title: "Our culture", description: "An international firm by design." } },
    "/about/social-responsibility": { render: () => <SocialResponsibilityPage />, meta: { title: "Social responsibility", description: "One4One social enterprise internship programme." } },
    "/about/industry-events": { render: () => <IndustryEventsPage />, meta: { title: "Industry events", description: "Where you'll find us." } },
    "/about/consulting-partners": { render: () => <ConsultingPartnersPage />, meta: { title: "Business consulting partners", description: "Established business consultancies who share our conviction." } },
    "/about/amsterdam": { render: () => <LocationPage city="amsterdam" />, meta: { title: "Amsterdam, The Netherlands", description: "Our headquarters, home of Infinium Consulting B.V." } },
    "/about/dubai": { render: () => <LocationPage city="dubai" />, meta: { title: "DIFC, Dubai", description: "Our Middle East hub in the Dubai International Financial Centre." } },
    "/careers": { render: () => <CareersWirePage />, meta: { title: "Your career", description: "We are a values-led firm built from seasoned professionals and dynamic new talent." } },
  };

  for (const s of SERVICES) routes[`/services/${s.slug}`] = {
    render: () => <ServiceDetailPage slug={s.slug} />,
    meta: { title: s.title, description: s.lead },
  };
  for (const t of Object.keys(TECHNOLOGY_DETAIL)) routes[`/technologies/${t}`] = {
    render: () => <TechnologyDetailPage slug={t} />,
    meta: { title: TECHNOLOGY_DETAIL[t].title, description: TECHNOLOGY_DETAIL[t].body },
  };
  for (const c of CASE_STUDIES) routes[`/insights/${c.slug}`] = {
    render: () => <CaseStudyWirePage slug={c.slug} />,
    meta: { title: c.title, description: c.summary },
  };

  const route = routes[path];
  if (!route) notFound();
  return route;
}

export const ALL_PATHS = [
  "",
  "services",
  ...SERVICES.map((s) => `services/${s.slug}`),
  "solutions",
  "solutions/ai-assessment",
  "solutions/quantexa-maturity-assessment",
  "sectors",
  "technologies",
  ...Object.keys(TECHNOLOGY_DETAIL).map((t) => `technologies/${t}`),
  "technologies/alteryx-bootcamps",
  "insights",
  ...CASE_STUDIES.map((c) => `insights/${c.slug}`),
  "about",
  "about/culture",
  "about/social-responsibility",
  "about/industry-events",
  "about/consulting-partners",
  "about/amsterdam",
  "about/dubai",
  "careers",
  "contact",
];
