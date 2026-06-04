"use client";

import { useState, type FormEvent } from "react";
import { Mail, Phone, MapPin, Clock, CheckCircle2, Loader2, MessageCircle, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";
import { site } from "@/lib/site";
import { openChat } from "@/lib/chat-events";

const services = [
  "Ghostwriting",
  "Editing",
  "Formatting",
  "Cover Design",
  "Publishing",
  "Marketing",
  "Not sure yet",
];

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-50" />
      <div className="container-content relative">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left: pitch + contact details */}
          <Reveal>
            <span className="eyebrow">
              <span className="h-px w-6 bg-gold-400" />
              Get a free quote
            </span>
            <h2 className="heading-serif mt-5 text-3xl leading-tight sm:text-4xl md:text-[2.75rem]">
              Tell us about your book.{" "}
              <span className="text-gilt italic">We&apos;ll take it from here.</span>
            </h2>
            <p className="mt-5 max-w-md text-cream/65">
              Share a few details and we&apos;ll send a tailored proposal within
              one business day. No pressure, no obligation — just a clear plan
              for your book.
            </p>

            <div className="mt-10 space-y-4">
              {[
                { Icon: Mail, label: site.contact.email, href: `mailto:${site.contact.email}` },
                { Icon: Phone, label: site.contact.phone, href: `tel:${site.contact.phone.replace(/[^+\d]/g, "")}` },
                { Icon: MapPin, label: site.contact.location },
                { Icon: Clock, label: site.contact.hours },
              ].map(({ Icon, label, href }) => {
                const inner = (
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold-500/30 bg-ink-800 text-gold-300">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-cream/80">{label}</span>
                  </div>
                );
                return href ? (
                  <a key={label} href={href} className="block transition-opacity hover:opacity-80">
                    {inner}
                  </a>
                ) : (
                  <div key={label}>{inner}</div>
                );
              })}
            </div>

            <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-cream/70">
                Prefer to talk it through first?
              </p>
              <button
                onClick={() => openChat()}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gold-300 hover:text-gold-200"
              >
                <MessageCircle className="h-4 w-4" />
                Chat with our AI concierge now
              </button>
            </div>
          </Reveal>

          {/* Right: form */}
          <Reveal delay={0.1}>
            <form
              onSubmit={onSubmit}
              className="card relative overflow-hidden p-7 md:p-9"
            >
              {status === "done" ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle2 className="h-14 w-14 text-gold-400" />
                  <h3 className="mt-5 font-serif text-2xl text-cream">
                    Thank you — your request is in.
                  </h3>
                  <p className="mt-2 max-w-sm text-cream/60">
                    We&apos;ll review your idea and reply within one business day.
                    Keep an eye on your inbox.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="btn-ghost mt-6"
                  >
                    Send another request
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" name="name" required placeholder="Jane Author" />
                    <Field label="Email" name="email" type="email" required placeholder="jane@email.com" />
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Field label="Phone (optional)" name="phone" placeholder="(555) 000-0000" />
                    <div>
                      <Label>What do you need?</Label>
                      <select
                        name="service"
                        className="w-full rounded-lg border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-cream outline-none transition-colors focus:border-gold-400/60"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select a service
                        </option>
                        {services.map((s) => (
                          <option key={s} value={s} className="bg-ink-900">
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label>Tell us about your book</Label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="Genre, rough word count, where you are in the process, and your goal for the book…"
                      className="w-full resize-none rounded-lg border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-cream placeholder:text-cream/35 outline-none transition-colors focus:border-gold-400/60"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-gold mt-6 w-full text-base disabled:opacity-70"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                      </>
                    ) : (
                      "Request my free quote"
                    )}
                  </button>

                  {status === "error" && (
                    <p className="mt-3 text-center text-sm text-red-300/80">
                      Something went wrong. Email us at {site.contact.email} and
                      we&apos;ll sort it out.
                    </p>
                  )}
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-cream/60">
                    <ShieldCheck className="h-3.5 w-3.5 text-gold-400/80" />
                    Your details and story are protected by NDA.
                  </p>
                  <p className="mt-2 text-center text-xs text-cream/40">
                    By submitting you agree to be contacted about your project.
                    We never share your details.
                  </p>
                </>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-cream/55">
      {children}
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-cream placeholder:text-cream/35 outline-none transition-colors focus:border-gold-400/60"
      />
    </div>
  );
}
