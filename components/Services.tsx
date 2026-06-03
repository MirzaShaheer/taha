"use client";

import {
  PenLine,
  SpellCheck,
  AlignLeft,
  Palette,
  Rocket,
  Megaphone,
  Globe,
  Check,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { services } from "@/lib/site";
import { openChat } from "@/lib/chat-events";

const icons: Record<string, LucideIcon> = {
  PenLine,
  SpellCheck,
  AlignLeft,
  Palette,
  Rocket,
  Megaphone,
  Globe,
};

export default function Services() {
  return (
    <section id="services" className="relative py-24 md:py-32">
      {/* faint gold wash to lift the section off the black */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <div className="container-content">
        <SectionHeading
          eyebrow="What we do"
          title={
            <>
              Everything between <span className="text-gilt italic">idea</span>{" "}
              and bookshelf
            </>
          }
          subtitle="One team for the whole journey — or just the part you need. No hand-offs, no chaos, no middlemen taking a cut of your royalties."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = icons[s.icon] ?? PenLine;
            return (
              <Reveal key={s.id} delay={(i % 3) * 0.08}>
                <div className="group gilt-border card relative h-full overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/[0.045] hover:shadow-luxe">
                  {/* specular sweep on hover */}
                  <span className="sheen-layer" aria-hidden />

                  {/* hover glow */}
                  <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold-500/0 blur-2xl transition-all duration-500 group-hover:bg-gold-500/20" />

                  {/* faint index numeral */}
                  <span className="pointer-events-none absolute right-5 top-4 font-serif text-5xl leading-none text-white/[0.04] transition-colors duration-300 group-hover:text-gold-500/10">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="relative mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gold-500/30 bg-gradient-to-br from-ink-700 to-ink-900 text-gold-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 group-hover:border-gold-400/60 group-hover:text-gold-200">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </div>

                  <h3 className="relative font-serif text-xl text-cream">
                    {s.title}
                  </h3>
                  <p className="relative mt-2.5 text-sm leading-relaxed text-cream/60">
                    {s.blurb}
                  </p>

                  <ul className="relative mt-5 space-y-2">
                    {s.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-center gap-2 text-sm text-cream/75"
                      >
                        <Check className="h-3.5 w-3.5 text-gold-400" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() =>
                      openChat(
                        `Tell me more about your ${s.title.toLowerCase()} service.`
                      )
                    }
                    className="relative mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-300/70 transition-colors hover:text-gold-200"
                  >
                    Ask the concierge
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
