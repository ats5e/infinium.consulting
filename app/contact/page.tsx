import type { Metadata } from "next";
import { ContactWireIntro } from "@/components/wireframe/Pages";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation. We provide a free goals review with one of our industry leaders.",
  alternates: { canonical: "/contact" },
  // per-page og:url (the layout's "/" was being inherited); setting openGraph
  // replaces the inherited object, so the share card is re-attached
  openGraph: { url: "/contact", siteName: "Infinium", type: "website", locale: "en_GB", images: ["/opengraph-image"] },
};

export default function Contact() {
  return <ContactWireIntro form={<ContactForm />} />;
}
