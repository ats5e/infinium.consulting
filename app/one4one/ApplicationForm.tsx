"use client";

import { useActionState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitApplication, type ApplicationState } from "./actions";

const schema = z.object({
  name: z.string().trim().min(2, "Tell us your name."),
  email: z.string().trim().email("That email doesn’t look right — check the domain."),
  university: z.string().trim().min(2, "Tell us where you study."),
  programme: z.string().trim().min(2, "Tell us your degree programme and expected graduation year."),
  motivation: z.string().trim().min(40, "Give us a little more — a short paragraph on why One4One."),
  link: z.string().optional(),
  met: z.string().optional(),
  website: z.string().optional(),
});

type Fields = z.infer<typeof schema>;

const inputCls =
  "w-full border hairline bg-white px-4 py-3 text-glass shadow-[inset_0_1px_2px_rgba(23,56,102,0.04),0_4px_14px_rgba(23,56,102,0.035)] placeholder:text-steel transition-[border-color,box-shadow] duration-(--duration-fast) focus:border-signal focus:shadow-[0_0_0_3px_rgba(27,87,200,0.32)] focus:outline-none";
const labelCls = "eyebrow block";
const errCls = "mt-2 text-(length:--text-body-sm) text-error";

const FIELD_ORDER = ["name", "email", "university", "programme", "motivation", "link"] as const;

export function ApplicationForm() {
  const [state, formAction, pending] = useActionState<ApplicationState, FormData>(
    submitApplication,
    { status: "idle" }
  );
  const {
    register,
    formState: { errors },
  } = useForm<Fields>({ resolver: zodResolver(schema), mode: "onBlur" });

  const sent = state.status === "sent";
  const confirmation = useRef<HTMLHeadingElement>(null);

  /* Mirrors the contact form: focus the confirmation on success, the first
   * failing field on error. */
  useEffect(() => {
    if (sent) {
      confirmation.current?.focus();
      return;
    }
    if (state.status === "error" && state.fieldErrors) {
      const first = FIELD_ORDER.find((k) => state.fieldErrors?.[k]);
      if (first) document.getElementById(first)?.focus();
    }
  }, [sent, state]);

  const fieldError = (key: (typeof FIELD_ORDER)[number]) =>
    errors[key]?.message ?? state.fieldErrors?.[key];

  return (
    <div>
      <p role="status" aria-live="polite" className="sr-only">
        {sent ? "Application sent. Thank you — we review applications with each new cohort." : ""}
      </p>

      {sent ? (
        <div className="border hairline p-8">
          <p className="eyebrow text-signal">application received</p>
          <h3 ref={confirmation} tabIndex={-1} className="mt-4 text-(length:--text-step-2) focus:outline-none">
            Thank you — we review applications as each new cohort forms.
          </h3>
          <p className="mt-4 leading-relaxed text-ice">
            If your profile fits an upcoming engagement, we&rsquo;ll be in touch to arrange a conversation.
          </p>
        </div>
      ) : (
        <form action={formAction} noValidate className="space-y-8" data-testid="one4one-form">
          <div aria-live="assertive">
            {state.status === "error" && state.message ? (
              <p role="alert" className="border border-error/30 bg-error/5 p-4 text-(length:--text-body-sm) text-error">
                {state.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <label htmlFor="name" className={labelCls}>Name</label>
              <input
                id="name"
                required
                aria-required="true"
                autoComplete="name"
                placeholder="Your full name"
                className={`${inputCls} mt-3`}
                aria-invalid={!!fieldError("name")}
                aria-describedby={fieldError("name") ? "name-error" : undefined}
                {...register("name")}
              />
              {fieldError("name") && <p id="name-error" role="alert" className={errCls}>{fieldError("name")}</p>}
            </div>
            <div>
              <label htmlFor="email" className={labelCls}>University email</label>
              <input
                id="email"
                type="email"
                required
                aria-required="true"
                autoComplete="email"
                placeholder="you@student.university.nl"
                className={`${inputCls} mt-3`}
                aria-invalid={!!fieldError("email")}
                aria-describedby={fieldError("email") ? "email-error" : undefined}
                {...register("email")}
              />
              {fieldError("email") && <p id="email-error" role="alert" className={errCls}>{fieldError("email")}</p>}
            </div>
            <div>
              <label htmlFor="university" className={labelCls}>University</label>
              <input
                id="university"
                required
                aria-required="true"
                autoComplete="organization"
                placeholder="e.g. University of Groningen"
                className={`${inputCls} mt-3`}
                aria-invalid={!!fieldError("university")}
                aria-describedby={fieldError("university") ? "university-error" : undefined}
                {...register("university")}
              />
              {fieldError("university") && <p id="university-error" role="alert" className={errCls}>{fieldError("university")}</p>}
            </div>
            <div>
              <label htmlFor="programme" className={labelCls}>Degree programme &amp; graduation year</label>
              <input
                id="programme"
                required
                aria-required="true"
                placeholder="e.g. MSc Econometrics, 2027"
                className={`${inputCls} mt-3`}
                aria-invalid={!!fieldError("programme")}
                aria-describedby={fieldError("programme") ? "programme-error" : undefined}
                {...register("programme")}
              />
              {fieldError("programme") && <p id="programme-error" role="alert" className={errCls}>{fieldError("programme")}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="met" className={labelCls}>Where did we meet? <span className="normal-case tracking-normal text-steel">(optional)</span></label>
            <input
              id="met"
              placeholder="e.g. Groningen in-house day, March 2026"
              className={`${inputCls} mt-3`}
              {...register("met")}
            />
          </div>

          <div>
            <label htmlFor="motivation" className={labelCls}>Why One4One?</label>
            <textarea
              id="motivation"
              required
              aria-required="true"
              rows={6}
              placeholder="A short paragraph: what draws you to financial services and data engineering, and what you want from your first professional role."
              className={`${inputCls} mt-3 resize-y`}
              aria-invalid={!!fieldError("motivation")}
              aria-describedby={fieldError("motivation") ? "motivation-error" : undefined}
              {...register("motivation")}
            />
            {fieldError("motivation") && <p id="motivation-error" role="alert" className={errCls}>{fieldError("motivation")}</p>}
          </div>

          <div>
            <label htmlFor="link" className={labelCls}>LinkedIn or CV link <span className="normal-case tracking-normal text-steel">(optional)</span></label>
            <input
              id="link"
              type="url"
              autoComplete="url"
              placeholder="https://www.linkedin.com/in/you"
              className={`${inputCls} mt-3`}
              aria-invalid={!!fieldError("link")}
              aria-describedby={fieldError("link") ? "link-error" : undefined}
              {...register("link")}
            />
            {fieldError("link") && <p id="link-error" role="alert" className={errCls}>{fieldError("link")}</p>}
          </div>

          {/* honeypot — hidden from real users, tempting to bots */}
          <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="website">Website</label>
            <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="btn-sheen inline-flex min-h-11 items-center bg-cobalt px-6 font-mono text-(length:--text-label) uppercase tracking-[0.08em] text-white shadow-[0_8px_24px_rgba(35,79,189,0.18)] transition-[background-color,color,transform,box-shadow] duration-(--duration-fast) ease-(--ease-out-expo) hover:bg-navy hover:shadow-[0_10px_28px_rgba(23,56,102,0.24)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Sending…" : "Submit application"}
          </button>
        </form>
      )}
    </div>
  );
}
