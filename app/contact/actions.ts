"use server";

import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Tell us your name.").max(120),
  email: z.string().trim().email("That email doesn’t look right — check the domain."),
  organisation: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(20, "Give us a little more — two or three sentences is plenty.").max(5000),
  // honeypot: real users never see or fill this
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactState = {
  status: "idle" | "sent" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "organisation" | "message", string>>;
};

/* Naive in-memory rate limit — enough for a marketing site behind one
 * Vercel instance; swap for KV if traffic ever warrants it. */
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

  const { name, email, organisation, message } = parsed.data;
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "website@infinium.technology",
        to: process.env.CONTACT_TO ?? "sales@infinium.technology",
        reply_to: email,
        subject: `Website enquiry — ${name}${organisation ? `, ${organisation}` : ""}`,
        text: `${message}\n\n— ${name} <${email}>${organisation ? ` · ${organisation}` : ""}`,
      }),
    });
    if (!res.ok) {
      console.error("resend failed", res.status, await res.text());
      return {
        status: "error",
        message: "The message didn’t send — that’s on our side, not yours. Email sales@infinium.technology and we’ll pick it up.",
      };
    }
  } else {
    // no provider configured (local dev): log so the submission isn't lost
    console.log("[contact] no RESEND_API_KEY —", { name, email, organisation, message });
  }

  return { status: "sent" };
}
