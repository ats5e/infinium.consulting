import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import {
  ContentSection,
  CTASection,
  HeroSection,
  NumberedCards,
} from "@/components/wireframe/Primitives";

/*
 * THE UNLISTED ESG PAGES, carried over from the csrd.consulting microsite.
 *
 * David (20 Nov 2026): "add them all in, as hidden pages and I'll check
 * after the 24th", so the microsite can lapse at its 24 Nov renewal
 * without losing its copy. Deliberately hidden, the One4One way: routes
 * live outside ALL_PATHS (so not in the nav, sitemap or search index),
 * are marked noindex, and nothing on the public site links to them.
 * Copy is the microsite's own, bar spelling fixes. Held back pending
 * David's review: the ESG leadership names (Jack, 20 Nov).
 *
 * To publish one: link it from the ESG reporting page, add its path to
 * ALL_PATHS and drop the noindex in its app/ route.
 */

const BASE = "/solutions/esg-reporting";
export const ESG_HIDDEN_PAGES = [
  { slug: "reporting-challenges", label: "The reporting challenge", title: "ESG reporting is presenting a global challenge to financial institutions and corporates" },
  { slug: "services", label: "Our services", title: "How we support ESG reporting" },
  { slug: "technology-partners", label: "Our technology partners", title: "Award-winning technology, without the risk of untested software" },
  { slug: "faqs", label: "Common questions", title: "Frequently asked questions about our ESG services" },
] as const;

function Siblings({ current }: { current: string }) {
  return (
    <ContentSection density="compact">
      <p className="eyebrow text-signal">More on ESG reporting</p>
      <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[15px] font-medium">
        <li><Link href={BASE} className="text-paper transition-colors hover:text-cobalt">The ESG reporting platform →</Link></li>
        {ESG_HIDDEN_PAGES.filter((p) => p.slug !== current).map((p) => (
          <li key={p.slug}><Link href={`${BASE}/${p.slug}`} className="text-paper transition-colors hover:text-cobalt">{p.label} →</Link></li>
        ))}
      </ul>
    </ContentSection>
  );
}

const challenges = [
  { title: "Structured and unstructured data", body: "ESG reporting presents challenges with regards to sourcing unstructured data in text format, as well as images, video, photos and even audio files." },
  { title: "Data consolidation and integration", body: "Data needs to be identified and sourced from multiple places, both internal and external to an organisation. Consolidating that data, which is often in a variety of formats to then use for aggregated calculations, poses a challenge." },
  { title: "Data format, normalisation and preparation", body: "Traditional tools, such as Excel, struggle to normalise and prepare data for ESG reporting purposes. A lack of an audit trail results in significant re-work and questions when the process is being reviewed by an auditor." },
  { title: "Lack of flexibility and scalability", body: "Limited scalability of the existing solutions and reporting architecture to comply with new future reporting requirements (sector-specific requirements), comply with changing requirements quickly and for a low cost, and handle an increase in the amount of available data." },
  { title: "Rigid tools and legacy platforms", body: "Legacy platforms that provide challenges when trying to extract data. Over-reliance on spreadsheet-based software, such as Excel, which is unable to handle the volumes and different data formats effectively." },
  { title: "Limited insights into the data", body: "A lot of the data tends to be locked away in spreadsheets, inaccessible to senior management and difficult to use to drive strategy and provide insights. A lack of clarity as to what data is missing, which can lead to incorrect business decisions being taken." },
  { title: "Annual cycle: time, effort and cost", body: "A significant amount of effort, resources and cost are being assigned to ESG reporting, which in the main is heavily labour intensive and lacks automation, draining teams and resulting in a monumental effort to realise any results." },
  { title: "Inefficient and expensive audits", body: "A lack of an audit trail and limited evidence of what has happened to the data once it has been received can result in the need for the whole process to be re-run by expensive audit teams." },
];

type Step = {
  title: string;
  intro: string[];
  points?: string[];
  supportTitle: string;
  support?: string[];
  supportPoints?: string[];
  after?: string;
  outcome: string;
};
const steps: Step[] = [
  {
    title: "Develop an ESG strategy and roadmap",
    intro: ["An effective ESG strategy and planning exercise involves a structured approach to integrating environmental, social, and governance considerations into an organisation’s overall strategy. Key activities include:"],
    points: [
      "Stakeholder engagement: identifying key stakeholders, conducting stakeholder consultations and incorporating stakeholder feedback",
      "Assessing materiality impact (see step 2)",
      "Baseline assessment: undertaking a baseline assessment of ESG disclosure activities and benchmarking those against peers",
      "KPIs: definition of, and agreement of, key ESG-focused KPIs for the business",
      "ESG integration into business processes: definition of key ESG processes and defining a plan to embed them into core practices and procedures",
      "Detailed plan: production of a detailed plan that supports ESG disclosure as part of a wider ESG initiative within the organisation",
    ],
    supportTitle: "Our approach includes",
    supportPoints: [
      "Supporting the mobilisation of an ESG function within an organisation",
      "Preparing a detailed plan (with a specific focus on ESG disclosures)",
      "Building a stakeholder map (identifying key stakeholders)",
      "Engaging with stakeholders and tracking progress",
      "Planning for (and executing) a materiality assessment (see step 2)",
      "Undertaking a baseline assessment, including a peer review so as to determine “current state”",
      "Definition of industry-standard KPIs that can be used to track progress and drive behaviours within the organisation",
      "Development of an ESG-focused set of tasks and activities, for integration into existing operating models and processes",
      "In addition, the detailed plan will also focus on topics such as policy and framework development, data strategy and required infrastructure, risk management and opportunity assessment, employee engagement and training, ongoing plan management and progress reporting, communication and branding, and ongoing initiatives and suggestions for improvement",
    ],
    outcome: "A mobilised ESG function, supported by assets that include a detailed plan, a stakeholder map, a baseline assessment, ESG-focused KPIs and insight into how ESG processes can be embedded into a business model.",
  },
  {
    title: "(Double) materiality assessment",
    intro: ["The double materiality assessment is at the heart of ESG compliance. This step ensures you identify and prioritise ESG factors that impact your organisation and the broader environment and society."],
    points: [
      "Financial materiality: assessing how sustainability factors influence your company’s financial performance and risk exposure",
      "Impact materiality: evaluating your organisation’s effects on the environment, people, and society",
      "Stakeholder engagement: engaging with internal and external stakeholders to capture diverse perspectives",
    ],
    supportTitle: "How we support a (double) materiality assessment",
    support: ["Our fully configurable solution enables our clients to undertake a comprehensive, workflow-supported materiality exercise across their business. Key features of the solution include:"],
    supportPoints: [
      "Fully configurable questionnaires, mapped to a materiality assessment template",
      "Workflow-supported activities, so you can track who has responded, what they have provided and where individuals or departments still need to contribute",
      "Linkage to the underlying regulation (multiple taxonomies are supported: GRI, ESRS, ISSB) to enable traceability from regulation to report",
    ],
    outcome: "A clear and actionable materiality matrix highlighting key sustainability issues and aligning your strategy with CSRD requirements.",
  },
  {
    title: "Agree on the reporting framework",
    intro: [
      "Reporting frameworks remain a hot topic within the EU and globally. Depending on the size and locations where a business operates, you can be faced with having to comply with one framework, or multiple, either in one or more locations.",
      "As the reporting frameworks develop and requirements become clearer, organisations will require a flexible solution that can quickly adapt to change.",
    ],
    supportTitle: "How we support reporting framework activities",
    support: ["Our fully configurable solution enables our clients to quickly adapt to changes in ESG reporting frameworks. One such example is the proposed changes to the ESRS framework a year after it was introduced in January 2024, known as Omnibus. Key features of our solution include:"],
    supportPoints: [
      "A pre-built suite of macros, mapped to the ESRS, GRI and ISSB reporting standards. All our clients need to do is provide the data; our solution will complete the necessary data population and calculations.",
      "A highly flexible solution that can adapt quickly and with the minimum of cost to changes in regulation. A fully auditable solution identifies when standards have changed and the impact on the end result (what-if scenarios can also be run, in anticipation of a change in requirements, so as to understand impact).",
      "A team of legal and regulatory experts that have extensive exposure to the ESRS, ISSB and GRI. Our team members are experienced and in some cases are advising national governments about standards and the best taxonomies to use when reporting.",
      "An end-to-end solution from regulation, to data sourcing, to data analysis and structuring, to reporting and strategy. Our solution is built on the latest global reporting standards and can be quickly adapted to local and global requirements and reporting needs.",
    ],
    outcome: "A robust, macro-driven, flexible ESG reporting solution, built with an in-depth understanding of the ESRS, ISSB and GRI standards. A team of legal and regulatory experts, who can offer support and guidance as to how to report and what to report when considering the latest ESG taxonomies.",
  },
  {
    title: "Draft an outline ESG report (begin with the end in mind)",
    intro: ["Producing a detailed ESG report for both internal and external stakeholders is a significant challenge. Whilst industry standards and best practices are emerging, drafting “what good looks like” at an early stage of the process will help teams understand the priority and focus when reporting. In addition to the preparation and delivery of an annual report, there will be a requirement to report to regulators (eventually in XBRL format) and drive internal strategy with detailed insights."],
    supportTitle: "How we support report design activities",
    support: ["Our solution has data at its core. It has been designed to produce results that can be used for internal reporting: the solution produces output files that can be interfaced with Alteryx Auto-Insights, Power BI and Qlik. When preparing the annual report, our proprietary large language model consolidates all of the data outputs (structured and unstructured data) into a report at the click of a button, providing users with a head start when preparing the annual report."],
    outcome: "A clear view of what the required reports will look like when reporting to internal and external stakeholders.",
  },
  {
    title: "Define the data collection approach",
    intro: [
      "ESG reporting requires a comprehensive and detailed data strategy. Data collection is a core part of this.",
      "Before collecting data, we help clients assess what is already available and identify gaps that need to be filled to meet the stringent requirements. Key tasks and deliverables include:",
    ],
    points: [
      "Preparing a data inventory: cataloguing your current ESG-related data across all operations",
      "Compliance check: comparing existing data with CSRD/ESRS/ISSB reporting standards",
      "Gap identification: highlighting missing, incomplete, or non-compliant data points",
    ],
    supportTitle: "How we support data collection activities",
    support: ["Once the materiality assessment is completed we provide ESG data experts to complete a comprehensive data mapping and gap exercise."],
    supportPoints: [
      "A detailed list of required data points and specific gaps is logged within our solution",
      "These gaps can then be mapped to the regulatory requirement and the materiality assessment, ensuring complete transparency and end-to-end traceability",
      "Identification of possible data sources (to help fill the gaps)",
      "A documented set of data proxying rules, so that it is clear how the gaps are being filled and an approved methodology is signed off to support the final results",
      "Data can then be used to report, define strategy and for modelling purposes, but with a clear understanding of where data gaps exist and the impact on ESG decisioning",
    ],
    outcome: "A comprehensive data gap report outlining next steps for effective data collection.",
  },
  {
    title: "Undertake the data collection exercise",
    intro: ["Collecting data from both within and from outside the organisation is a complex task. In some cases organisations are tasked with sourcing up to 1200 data points, many of which have either never been sourced before, or that sit deep within a supplier’s or creditor’s system. Undertaking data collection in a coherent and organised manner is key to the success of ESG reporting. Tracking progress and identifying laggards all requires extensive organisation and a workflow-led approach."],
    supportTitle: "How we support the data collection exercise",
    support: ["Our solution is workflow driven and user configurable. Working with our clients we:"],
    supportPoints: [
      "Define data collection questionnaires, mapping the requirements to regulation and the (double) materiality requirements, so as to enable traceability and a clear understanding of why a data element is being requested",
      "Undertake the data collection exercise. Questionnaires can be sent to individuals (both internal and external)",
      "Track and record progress. Report progress on data collection. Identify delays and data gaps. Communicate with the data analytics team so they know when to use a proxy value when reporting",
    ],
    outcome: "A detailed understanding of the data collection exercise, with requirements mapped to regulation and materiality and with progress and gaps clearly understood as part of the end-to-end reporting process.",
  },
  {
    title: "Consolidate, cleanse, prepare, normalise and report the data",
    intro: ["One of the major challenges when preparing data for ESG reporting is the fact that data comes in both structured and unstructured formats. Many organisations are struggling with the data challenge that ESG poses."],
    supportTitle: "How we support data preparation activities",
    support: ["When we built our ESG reporting solution, we identified very early on the data challenges that our clients would face. We recognised that legacy solutions, such as Excel, would not be able to handle the large number of data points and the different data formats. Our solution supports ESG reporting by:"],
    supportPoints: [
      "Providing a world-class data analytics platform (Alteryx) to consolidate, cleanse, prepare and normalise ESG data",
      "Embedding pre-built Alteryx macros in the solution to help our clients quickly produce the required outputs (quantitative and qualitative) for internal and external reporting. Macros can be quickly amended and adjusted as requirements change, and are maintained on a regular basis as part of a release cycle",
      "Defining flexible workflows that enable changing requirements and taxonomies to be quickly and easily incorporated into the reporting cycle",
      "Providing data outputs that are fully integrated into external systems, either into our Reporting Hub or another internal system",
      "Integrated management information outputs, either in Alteryx Auto-Insights format or Power BI",
    ],
    after: "The whole process is fully audited, so users can understand what has happened to each data element at each step of the process.",
    outcome: "A set of ESG data that can be used for both internal and external reporting.",
  },
  {
    title: "Report externally, internally, drive business strategy and manage risk",
    intro: ["Clients are faced with numerous reporting challenges, not least because the reports are impacted by poor data quality and data gaps."],
    supportTitle: "How we support internal and external reporting for ESG",
    support: ["Our solution supports numerous formats. Highlights include:"],
    supportPoints: [
      "(Close to) real-time management information to aid modelling, portfolio management and ESG decisioning",
      "A proprietary large language model (LLM) that pulls together the qualitative and quantitative data points into a pre-built annual report",
      "Data output files in a variety of formats for use with other external or internal reporting solutions",
    ],
    outcome: "A set of management and external reports that help drive ESG strategy, support the annual reporting process and ensure regulatory compliance.",
  },
];

const faqs: Array<{ q: string; a: string[] }> = [
  { q: "How proven is the underlying technology?", a: ["Our technology partners are multi-award winners, with thousands of clients. Alteryx alone has more than 8,000 clients globally and the software has been proven across hundreds of different use cases."] },
  { q: "How can I schedule a consultation?", a: ["You can schedule a consultation by contacting us through our website’s contact form or by emailing us at sales@infinium.technology."] },
  { q: "What is the typical timeline for a project?", a: ["The timeline varies depending on the project’s scope and the quality and completeness of data, but we generally offer a team of 3-4 individuals for a 12 week sprint, to support with implementation, data sourcing and data pipeline creation. Depending on the size of the organisation and the complexity of the reporting requirements, these teams can be extended."] },
  { q: "What does a typical delivery team look like?", a: ["We offer a combination of legal and regulatory experts specialised in ESG reporting taxonomies and technical experts who support the implementation and configuration of the solution(s), end to end. We aim for our clients to become self-sufficient as quickly as possible and also offer specific Alteryx training so that clients can manage their own data pipelines and ESG reporting process."] },
  { q: "What is your approach to data privacy?", a: ["We prioritise data security and confidentiality, adhering to strict protocols to protect your information at every stage of the process. The underlying technologies that we use are all certified to the highest levels of security and are used today by global financial institutions and corporates. Further detailed information can be provided as part of an introductory meeting or RFP (request for proposal) exercise."] },
  {
    q: "What services do we offer?",
    a: [
      "We specialise primarily in ESG reporting solutions tailored for financial institutions and corporate entities, focusing on analytics-driven insights. Our team are also able to support with double (and single) materiality exercises as well as being able to provide detailed and comprehensive advice on the various global reporting taxonomies such as CSRD, ISSB and GRI.",
      "Where clients (primarily financial institutions) are looking for support in the areas of ESG risk, we are able to provide specific expertise as to how to embed ESG risk within an operating model.",
    ],
  },
  { q: "How do I get a quote for your services?", a: ["To receive a customised quote, we first require an initial meeting so that we can demonstrate our solution to you and you can determine how best we can meet your requirements. In some cases clients want to purchase all three of our hubs, but as our solution is modular, this is not a hard requirement, and we work with clients to integrate our solution(s) into their existing ESG reporting operating model and systems."] },
];

const DISCLOSURE =
  "group rounded-2xl bg-white open:pb-2";
const SUMMARY =
  "flex cursor-pointer list-none items-start justify-between gap-6 rounded-2xl p-6 outline-none focus-visible:ring-2 focus-visible:ring-signal md:p-7 [&::-webkit-details-marker]:hidden";
const PLUS =
  "mt-1 shrink-0 text-xl leading-none text-signal transition-transform duration-(--duration-fast) group-open:rotate-45";
const BULLETS = "mt-4 space-y-2 text-[15px] leading-relaxed text-ice";

export function EsgChallengesPage() {
  return (
    <>
      <HeroSection
        backHref={BASE}
        backLabel="ESG reporting platform"
        eyebrow="The reporting challenge"
        title="ESG reporting is presenting a global challenge to financial institutions and corporates"
        body="Eight problems financial institutions and corporates face when sourcing, preparing and reporting ESG data."
        compactTitle
      />
      <ContentSection tone="tint">
        <NumberedCards columns={4} compact items={challenges} />
      </ContentSection>
      <Siblings current="reporting-challenges" />
      <CTASection
        title="ESG obligations landing on your desk?"
        body="Talk to a practice lead about your reporting obligations and timeline, and we'll show the platform against your own frameworks."
        label="Request a demo"
      />
    </>
  );
}

export function EsgServicesPage() {
  return (
    <>
      <HeroSection
        backHref={BASE}
        backLabel="ESG reporting platform"
        eyebrow="Our services"
        title="How we support ESG reporting"
        body="Our ESG services are aligned with the need to effectively and efficiently define and deliver ESG reports and insight. The model we use to support our clients is closely aligned with our experts and our ESG reporting solution."
        compactTitle
      />
      <ContentSection tone="tint">
        <Reveal className="grid gap-3">
          {steps.map((step, i) => (
            <details key={step.title} className={DISCLOSURE}>
              <summary className={SUMMARY}>
                <span className="flex items-baseline gap-5">
                  <span className="text-sm tabular-nums text-steel">0{i + 1}</span>
                  <h3 className="text-[clamp(1.125rem,1.4vw,1.375rem)] leading-[1.25]">{step.title}</h3>
                </span>
                <span aria-hidden className={PLUS}>+</span>
              </summary>
              <div className="grid gap-x-12 gap-y-8 px-6 pb-6 md:px-7 lg:grid-cols-2">
                <div>
                  {step.intro.map((p) => (
                    <p key={p} className="mt-3 text-[15px] leading-relaxed text-ice first:mt-0">{p}</p>
                  ))}
                  {step.points ? (
                    <ul className={BULLETS}>
                      {step.points.map((p) => (
                        <li key={p} className="flex gap-3"><span aria-hidden className="text-signal">↳</span><span>{p}</span></li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div>
                  <p className="eyebrow text-signal">{step.supportTitle}</p>
                  {step.support?.map((p) => (
                    <p key={p} className="mt-4 text-[15px] leading-relaxed text-ice">{p}</p>
                  ))}
                  {step.supportPoints ? (
                    <ul className={BULLETS}>
                      {step.supportPoints.map((p) => (
                        <li key={p} className="flex gap-3"><span aria-hidden className="text-signal">↳</span><span>{p}</span></li>
                      ))}
                    </ul>
                  ) : null}
                  {step.after ? <p className="mt-4 text-[15px] leading-relaxed text-ice">{step.after}</p> : null}
                </div>
                <p className="rounded-xl bg-tint p-5 text-[15px] leading-relaxed text-paper lg:col-span-2">
                  <span className="eyebrow mr-3 text-signal">Outcome</span>
                  {step.outcome}
                </p>
              </div>
            </details>
          ))}
        </Reveal>
      </ContentSection>
      <Siblings current="services" />
      <CTASection
        title="ESG obligations landing on your desk?"
        body="Talk to a practice lead about your reporting obligations and timeline, and we'll show the platform against your own frameworks."
        label="Request a demo"
      />
    </>
  );
}

export function EsgPartnersPage() {
  return (
    <>
      <HeroSection
        backHref={BASE}
        backLabel="ESG reporting platform"
        eyebrow="Our technology partners"
        title="Award-winning technology, without the risk of untested software"
        body="We carefully select our technology partners, and our engagement and relationships stretch back many years and include multiple successful projects. The solutions we build with our partners are laser focused on business issues and challenges our clients are facing. The combination of our team of business, legal and technical experts, along with these award-winning technology solutions, means we are able to offer our clients innovative solutions, without the risk of building on untested software."
        compactTitle
      />
      <ContentSection tone="tint">
        <Reveal className="grid gap-3 lg:grid-cols-3">
          <article className="rounded-2xl bg-white p-7">
            <h3 className="text-[clamp(1.25rem,1.6vw,1.5rem)] leading-[1.2]">Alteryx</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-ice">Simplify, automate and accelerate analytics. The intuitive, AI-guided solution that automates data and analytics tasks for fast, reliable insights. With more than 8,000 clients globally, Alteryx is a world leader in data analytics.</p>
            <Link href="/technologies/alteryx" className="mt-6 inline-block text-[15px] font-medium text-paper transition-colors hover:text-cobalt">Our Alteryx practice →</Link>
          </article>
          <article className="rounded-2xl bg-white p-7">
            <h3 className="text-[clamp(1.25rem,1.6vw,1.5rem)] leading-[1.2]">RequirementOne</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-ice">RequirementOne help companies action regulatory change. With RequirementOne you unlock a comprehensive platform equipped with everything you need to effectively manage regulatory change and to digitise your business processes with confidence.</p>
          </article>
          <article className="rounded-2xl bg-white p-7">
            <p className="eyebrow text-signal">Recognition</p>
            <p className="mt-4 text-[15px] leading-relaxed text-ice">In 2023 we set out to transform how our clients deliver sustainability. Our mission in the ESG space is to provide comprehensive, analytics-driven solutions that empower businesses to meet their ESG obligations with confidence.</p>
            <p className="mt-3 text-[15px] leading-relaxed text-ice">Our efforts have been rewarded and in 2024 we won the Alteryx solution of the year for our ESG reporting solution. Our partner, RequirementOne, was also recognised for the work they have been undertaking in partnership with us and was listed in the RegTech100 awards as a business focusing on ESG and sustainability.</p>
          </article>
        </Reveal>
      </ContentSection>
      <Siblings current="technology-partners" />
      <CTASection
        title="ESG obligations landing on your desk?"
        body="Talk to a practice lead about your reporting obligations and timeline, and we'll show the platform against your own frameworks."
        label="Request a demo"
      />
    </>
  );
}

export function EsgFaqsPage() {
  return (
    <>
      <HeroSection
        backHref={BASE}
        backLabel="ESG reporting platform"
        eyebrow="Common questions"
        title="Frequently asked questions about our ESG services"
        body="Answers to some of the most frequently asked questions about our ESG services and how to connect with us."
        compactTitle
      />
      <ContentSection>
        <Reveal className="grid max-w-4xl gap-3">
          {faqs.map((faq) => (
            <details key={faq.q} className={DISCLOSURE}>
              <summary className={SUMMARY}>
                <h3 className="text-[clamp(1.125rem,1.4vw,1.375rem)] leading-[1.25]">{faq.q}</h3>
                <span aria-hidden className={PLUS}>+</span>
              </summary>
              <div className="px-6 pb-5 md:px-7">
                {faq.a.map((p) => (
                  <p key={p} className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ice first:mt-0">{p}</p>
                ))}
              </div>
            </details>
          ))}
        </Reveal>
      </ContentSection>
      <Siblings current="faqs" />
      <CTASection
        title="ESG obligations landing on your desk?"
        body="Talk to a practice lead about your reporting obligations and timeline, and we'll show the platform against your own frameworks."
        label="Request a demo"
      />
    </>
  );
}

