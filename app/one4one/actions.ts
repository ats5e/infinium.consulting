"use server";

import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Tell us your name.").max(120),
  email: z.string().trim().email("That email doesn’t look right — check the domain."),
  university: z.string().trim().min(2, "Tell us where you study.").max(160),
  programme: z.string().trim().min(2, "Tell us your degree programme and expected graduation year.").max(200),
  motivation: z.string().trim().min(40, "Give us a little more — a short paragraph on why One4One.").max(5000),
  link: z
    .string()
    .trim()
    .max(300)
    .url("That link doesn’t look right — paste the full URL, including https://.")
    .optional()
    .or(z.literal("")),
  met: z.string().trim().max(200).optional().or(z.literal("")),
  // honeypot: real applicants never see or fill this
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ApplicationState = {
  status: "idle" | "sent" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "university" | "programme" | "motivation" | "link", string>>;
};

/* Same lightweight process-local limiter as the contact form. */
const hits = new Map<string, { count: number; reset: number }>();
function limited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.reset) {
    hits.set(key, { count: 1, reset: now + 10 * 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 3;
}

export async function submitApplication(
  _prev: ApplicationState,
  formData: FormData
): Promise<ApplicationState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const fieldErrors: ApplicationState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ApplicationState["fieldErrors"]>;
      if (key && key !== ("website" as never)) fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "A couple of fields need attention.", fieldErrors };
  }

  // honeypot filled → pretend success, send nothing
  if (parsed.data.website) return { status: "sent" };

  if (limited(parsed.data.email.toLowerCase())) {
    return {
      status: "error",
      message: "You’ve sent several applications in a short window. Give it ten minutes — one application is plenty.",
    };
  }

  const { name, email, university, programme, motivation, link, met } = parsed.data;

  /* Delivery via the same Formspree pattern as the contact form. A dedicated
   * One4One form id can be set via ONE4ONE_FORMSPREE_ENDPOINT so applications
   * land in their own inbox rule without a redeploy. */
  const endpoint =
    process.env.ONE4ONE_FORMSPREE_ENDPOINT ??
    process.env.FORMSPREE_ENDPOINT ??
    "https://formspree.io/f/xrendqrr";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      kind: "One4One application",
      name,
      email,
      university,
      programme,
      motivation,
      link: link || "—",
      met: met || "—",
      _replyto: email,
      _subject: `One4One application — ${name}, ${university}`,
    }),
  });

  if (!res.ok) {
    console.error("formspree failed (one4one)", res.status, await res.text());
    return {
      status: "error",
      message: "The application didn’t send — that’s on our side, not yours. Email sales@infinium.technology and we’ll pick it up.",
    };
  }

  return { status: "sent" };
}
