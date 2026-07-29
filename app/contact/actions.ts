"use server";

import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Tell us your name.").max(120),
  email: z.string().trim().email("That email doesn’t look right — check the domain."),
  topic: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(20, "Give us a little more — two or three sentences is plenty.").max(5000),
  updates: z.string().optional().or(z.literal("")),
  // honeypot: real users never see or fill this
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactState = {
  status: "idle" | "sent" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "topic" | "message", string>>;
};

/* This lightweight process-local limiter reduces accidental repeat sends.
 * Production infrastructure should add a shared edge/KV limit as traffic grows. */
const hits = new Map<string, { count: number; reset: number }>();
function limited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.reset) {
    hits.set(key, { count: 1, reset: now + 10 * 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 5;
}

export async function sendMessage(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ContactState["fieldErrors"]>;
      if (key && key !== ("website" as never)) fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "A couple of fields need attention.", fieldErrors };
  }

  // honeypot filled → pretend success, send nothing
  if (parsed.data.website) return { status: "sent" };

  if (limited(parsed.data.email.toLowerCase())) {
    return {
      status: "error",
      message: "You’ve sent several messages in a short window. Give it ten minutes, or email sales@infinium.technology directly.",
    };
  }

  const { name, email, topic, message, updates } = parsed.data;
  /* The privacy notice states we record this preference, so it has to travel
   * with the enquiry — it is the only record of the opt-in. */
  const optedIn = Boolean(updates);

  /* Delivery via Formspree (https://formspree.io/f/xrendqrr) rather than a
   * transactional-email API: Formspree owns spam filtering and inbox
   * delivery, so this endpoint is the only moving part on our side. The
   * env var lets the endpoint rotate without a redeploy; the literal is a
   * safe default, not a secret — Formspree's protection is server-side. */
  const endpoint = process.env.FORMSPREE_ENDPOINT ?? "https://formspree.io/f/xrendqrr";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name,
      email,
      topic,
      message,
      updates: optedIn ? "yes" : "no",
      _replyto: email,
      _subject: `Website enquiry — ${name}${topic ? `, ${topic}` : ""}`,
    }),
  });

  if (!res.ok) {
    console.error("formspree failed", res.status, await res.text());
    return {
      status: "error",
      message: "The message didn’t send — that’s on our side, not yours. Email sales@infinium.technology and we’ll pick it up.",
    };
  }

  return { status: "sent" };
}
