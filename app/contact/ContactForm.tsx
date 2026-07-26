"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendMessage, type ContactState } from "./actions";

const schema = z.object({
  name: z.string().trim().min(2, "Tell us your name."),
  email: z.string().trim().email("That email doesn’t look right — check the domain."),
  topic: z.string().optional(),
  message: z.string().trim().min(20, "Give us a little more — two or three sentences is plenty."),
  updates: z.string().optional(),
  website: z.string().optional(),
});

type Fields = z.infer<typeof schema>;

const inputCls =
  "w-full border hairline bg-white px-4 py-3 text-glass shadow-[inset_0_1px_2px_rgba(23,56,102,0.04),0_4px_14px_rgba(23,56,102,0.035)] placeholder:text-steel transition-[border-color,box-shadow] duration-(--duration-fast) focus:border-signal focus:shadow-[0_0_0_3px_rgba(27,87,200,0.32)] focus:outline-none";
const labelCls = "eyebrow block";
const errCls = "mt-2 text-(length:--text-body-sm) text-error";

const TOPICS = [
  "Strategy and Change",
  "Transformation",
  "Digital & automation",
  "Data & AI",
  "Regulation & compliance",
  "Sustainable finance",
  "Other",
];

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(
    sendMessage,
    { status: "idle" }
  );
  const {
    register,
    formState: { errors },
  } = useForm<Fields>({ resolver: zodResolver(schema), mode: "onBlur" });

  const sent = state.status === "sent";
  const confirmation = useRef<HTMLHeadingElement>(null);

  /* On success the form unmounts, so focus would fall to <body>; anchor it on
   * the confirmation instead. On failure, send focus to the first bad field. */
  useEffect(() => {
    if (sent) {
      confirmation.current?.focus();
      return;
    }
    if (state.status === "error" && state.fieldErrors) {
      const first = (["name", "email", "topic", "message"] as const).find((k) => state.fieldErrors?.[k]);
      if (first) document.getElementById(first)?.focus();
    }
  }, [sent, state]);

  return (
    <div>
      {/* A live region has to be in the DOM before its text changes, or nothing
          is announced — so it is rendered in both states, never swapped in. */}
      <p role="status" aria-live="polite" className="sr-only">
        {sent ? "Message sent. Thank you, we will be in touch shortly." : ""}
      </p>

      {sent ? (
        <div className="border hairline p-8">
          <p className="eyebrow text-signal">message sent</p>
          <h2 ref={confirmation} tabIndex={-1} className="mt-4 text-(length:--text-step-2) focus:outline-none">
            Thank you, we will be in touch shortly.
          </h2>
        </div>
      ) : (
    <form action={formAction} noValidate className="space-y-8">
      <div aria-live="assertive">
        {state.status === "error" && state.message ? (
          <p role="alert" className="border border-error/30 bg-error/5 p-4 text-(length:--text-body-sm) text-error">
            {state.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-8">
        <div>
          <label htmlFor="name" className={labelCls}>
            Name
          </label>
          <input
            id="name"
            required
            aria-required="true"
            autoComplete="name"
            placeholder="Your full name"
            className={`${inputCls} mt-3`}
            aria-invalid={!!(errors.name || state.fieldErrors?.name)}
            aria-describedby={(errors.name || state.fieldErrors?.name) ? "name-error" : undefined}
            {...register("name")}
          />
          {(errors.name?.message ?? state.fieldErrors?.name) && (
            <p id="name-error" role="alert" className={errCls}>{errors.name?.message ?? state.fieldErrors?.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>
            Work email
          </label>
          <input
            id="email"
            type="email"
            required
            aria-required="true"
            autoComplete="email"
            placeholder="you@company.com"
            className={`${inputCls} mt-3`}
            aria-invalid={!!(errors.email || state.fieldErrors?.email)}
            aria-describedby={(errors.email || state.fieldErrors?.email) ? "email-error" : undefined}
            {...register("email")}
          />
          {(errors.email?.message ?? state.fieldErrors?.email) && (
            <p id="email-error" role="alert" className={errCls}>{errors.email?.message ?? state.fieldErrors?.email}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="topic" className={labelCls}>
          Topic
        </label>
        <select id="topic" className={`${inputCls} mt-3`} defaultValue="" {...register("topic")}>
          <option value="" disabled>
            Choose a topic
          </option>
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className={labelCls}>
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          required
          aria-required="true"
          placeholder="What would you like to discuss?"
          className={`${inputCls} mt-3 resize-y`}
          aria-invalid={!!(errors.message || state.fieldErrors?.message)}
          aria-describedby={(errors.message || state.fieldErrors?.message) ? "message-error" : undefined}
          {...register("message")}
        />
        {(errors.message?.message ?? state.fieldErrors?.message) && (
          <p id="message-error" role="alert" className={errCls}>{errors.message?.message ?? state.fieldErrors?.message}</p>
        )}
      </div>

      <label htmlFor="updates" className="flex items-start gap-3 text-(length:--text-body-sm) text-ice">
        <input id="updates" type="checkbox" className="mt-1 size-4 accent-cobalt" {...register("updates")} />
        Send me occasional email updates
      </label>

      <p className="max-w-2xl text-(length:--text-body-sm) leading-relaxed text-steel">
        We use your details only to respond to this enquiry and, if selected,
        send occasional updates. See our{" "}
        <Link href="/privacy" className="underline decoration-navy/25 underline-offset-4 transition-colors hover:text-signal">
          privacy notice
        </Link>
        .
      </p>

      {/* honeypot — hidden from real users and screen readers */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-sheen inline-flex min-h-11 items-center bg-cobalt px-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-white shadow-[0_8px_24px_rgba(35,79,189,0.18)] transition-[background-color,box-shadow] duration-(--duration-fast) ease-(--ease-out-expo) hover:bg-navy hover:shadow-[0_10px_28px_rgba(23,56,102,0.24)] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
      >
        {pending ? "Sending…" : "Start a conversation"}
      </button>
    </form>
      )}
    </div>
  );
}
