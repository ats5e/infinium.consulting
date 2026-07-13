"use client";

import { useActionState } from "react";
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
  "w-full border hairline bg-abyss/50 px-4 py-3 text-glass placeholder:text-steel/60 transition-[border-color] duration-(--duration-fast) focus:border-signal focus:outline-none";
const labelCls = "eyebrow block";
const errCls = "mt-2 text-(length:--text-body-sm) text-[#FF7A7A]";

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

  if (state.status === "sent") {
    return (
      <div aria-live="polite" className="border hairline p-8">
        <p className="eyebrow text-signal">message sent</p>
        <h2 className="mt-4 text-(length:--text-step-2)">Thank you, we will be in touch shortly.</h2>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-8">
      <div aria-live="assertive">
        {state.status === "error" && state.message ? (
          <p className="border hairline border-[#FF7A7A]/40 p-4 text-(length:--text-body-sm) text-[#FF7A7A]">
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
            autoComplete="name"
            placeholder="Your full name"
            className={`${inputCls} mt-3`}
            aria-invalid={!!(errors.name || state.fieldErrors?.name)}
            {...register("name")}
          />
          {(errors.name?.message ?? state.fieldErrors?.name) && (
            <p className={errCls}>{errors.name?.message ?? state.fieldErrors?.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>
            Work email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className={`${inputCls} mt-3`}
            aria-invalid={!!(errors.email || state.fieldErrors?.email)}
            {...register("email")}
          />
          {(errors.email?.message ?? state.fieldErrors?.email) && (
            <p className={errCls}>{errors.email?.message ?? state.fieldErrors?.email}</p>
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
          placeholder="What would you like to discuss?"
          className={`${inputCls} mt-3 resize-y`}
          aria-invalid={!!(errors.message || state.fieldErrors?.message)}
          {...register("message")}
        />
        {(errors.message?.message ?? state.fieldErrors?.message) && (
          <p className={errCls}>{errors.message?.message ?? state.fieldErrors?.message}</p>
        )}
      </div>

      <label htmlFor="updates" className="flex items-start gap-3 text-(length:--text-body-sm) text-ice">
        <input id="updates" type="checkbox" className="mt-1 size-4 accent-cobalt" {...register("updates")} />
        Send me occasional email updates
      </label>

      {/* honeypot — hidden from real users and screen readers */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center bg-cobalt px-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-paper transition-colors duration-(--duration-fast) ease-(--ease-out-expo) hover:bg-signal hover:text-void disabled:opacity-50"
      >
        {pending ? "Sending…" : "Start a conversation"}
      </button>
    </form>
  );
}
