import type { Metadata } from "next";
import { GlassImage } from "@/components/GlassImage";
import { Reveal } from "@/components/motion/Reveal";
import {
  ContentSection,
  HeroSection,
  NumberedCards,
  SectionIntro,
} from "@/components/wireframe/Primitives";
import { siteImage } from "@/lib/images";
import { ApplicationForm } from "./ApplicationForm";

/*
 * THE UNLISTED ONE4ONE APPLICATION PAGE.
 *
 * Deliberately hidden: not in the nav, the search index, the footer or
 * the sitemap (this route lives outside ALL_PATHS), and marked noindex.
 * The URL is shared only in person — at university in-house days with
 * the institutions we already partner with — so applications arrive
 * through the relationships the programme is built on, not a public
 * careers funnel.
 */

export const metadata: Metadata = {
  title: "One4One — apply",
  description: "Application page for the One4One internship programme, shared at our university events.",
  robots: { index: false, follow: false },
};

export default function One4OneApplyPage() {
  return (
    <>
      <HeroSection
        eyebrow="One4One · By invitation"
        title="Your first professional role, funded by real work."
        body="One4One is our social enterprise internship: for every new client engagement we win, we create one paid internship for someone taking their first step into financial services. You're here because we met — at your university's in-house day, or through your programme."
        stats={[
          { value: "1 for 1", label: "One internship per new client engagement" },
          { value: "50+", label: "Students mentored & guided since 2020" },
          { value: "2", label: "Hubs — Amsterdam & DIFC, Dubai" },
        ]}
      />

      <ContentSection>
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <SectionIntro eyebrow="The programme" title="Real engagements, real mentors — not the sidelines" />
            <Reveal className="space-y-5 leading-relaxed text-ice">
              <p>Interns work inside live client engagements and our R&amp;D teams, learning the financial services industry from the people delivering in it — our consultants, our clients and our alliance partners, who share their knowledge with every cohort.</p>
              <p>You&rsquo;ll build practical skills in data, AI and financial services delivery, with MD-level practitioners working alongside you — apprenticeship in the real sense.</p>
            </Reveal>
          </div>
          <Reveal>
            <figure className="overflow-hidden border hairline bg-surface/82 shadow-[0_8px_24px_rgba(23,56,102,0.04)]">
              <GlassImage
                image={siteImage("one4one-cohort")}
                alt="A One4One cohort with the team at our Amsterdam hub"
                sizes="(min-width: 768px) 45vw, 100vw"
                imageClassName="aspect-[6/5] object-cover"
              />
              <figcaption className="eyebrow border-t hairline p-4">A cohort with the team in Amsterdam</figcaption>
            </figure>
          </Reveal>
        </div>
      </ContentSection>

      <ContentSection className="bg-abyss/20">
        <SectionIntro eyebrow="How it works" title="A place is created before it is filled" />
        <NumberedCards
          items={[
            { title: "One engagement, one internship", body: "Every new client engagement funds one paid position — so cohorts stay small, funded and real. We never recruit to a pipeline." },
            { title: "Through our universities", body: "We recruit through the institutions we partner with — the University of Groningen and Rotterdam School of Management, Erasmus University — and the students we meet at university events. This page isn't public; it travels with us." },
            { title: "Reviewed with your programme", body: "Applications are reviewed alongside our university partners as each cohort forms, so your candidacy is considered in context — not against an open inbox." },
          ]}
        />
      </ContentSection>

      <ContentSection>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionIntro
              eyebrow="Apply"
              title="Tell us who you are"
              body="A few minutes, no CV upload required — a LinkedIn or CV link is enough. We review applications as each new cohort forms."
            />
            <Reveal className="border-l-2 border-cobalt pl-6">
              <p className="leading-relaxed text-glass">
                <strong className="text-paper">An unlisted page.</strong>{" "}
                This address is shared in person at our university events. It isn&rsquo;t linked from the site or indexed by search engines — if you&rsquo;re here, we&rsquo;re already looking forward to reading your application.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <ApplicationForm />
            </Reveal>
          </div>
        </div>
      </ContentSection>
    </>
  );
}
