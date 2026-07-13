import type { Metadata } from "next";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation. Level 02, Innovation One, DIFC, Dubai — sales@infinium.technology.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <section className="pt-40 pb-24">
      <div className="mx-auto grid max-w-(--container-content) gap-16 px-(--spacing-gutter) md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow">contact</p>
          <h1 className="mt-6 text-(length:--text-step-4) leading-[1.02]">
            Start a conversation.
          </h1>
          <p className="mt-6 max-w-md text-ice">
            We work with financial institutions across the Middle East and
            internationally. If you have a challenge worth solving, we’d like
            to hear about it.
          </p>

          <dl className="mt-12 space-y-8">
            <div>
              <dt className="eyebrow">e-mail</dt>
              <dd className="mt-2">
                <a href="mailto:sales@infinium.technology" className="link-wipe text-glass">
                  sales@infinium.technology
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">address</dt>
              <dd className="mt-2 text-ice">
                Level 02, Innovation One
                <br />
                Dubai International Financial Centre
                <br />
                Dubai, UAE
              </dd>
            </div>
            <div>
              <dt className="eyebrow">socials</dt>
              <dd className="mt-2">
                <a
                  href="https://www.linkedin.com/company/113267940/"
                  rel="noopener"
                  className="link-wipe text-glass"
                >
                  LinkedIn
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
