import type { Metadata } from "next";
import { ContactWireIntro } from "@/components/wireframe/Pages";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation. We provide a free goals review with one of our industry leaders.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return <ContactWireIntro form={<ContactForm />} />;
}
