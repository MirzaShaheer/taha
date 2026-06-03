import { Check, Sparkles, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { packages } from "@/lib/site";

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
      <div className="container-content">
        <SectionHeading
          eyebrow="Packages"
          title={
            <>
              Pick a starting point.{" "}
              <span className="text-gilt italic">We&apos;ll tailor</span> the rest.
            </>
          }
          subtitle="Every book is different, so we quote per project — no rigid price tags. These three tiers are where most authors begin."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {packages.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-8 transition-all duration-300 ${
                  p.featured
                    ? "border-gold-400/50 bg-gradient-to-b from-gold-500/[0.08] to-transparent shadow-glow lg:-translate-y-4"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-b from-gold-300 to-gold-500 px-4 py-1 text-xs font-semibold text-ink-950 shadow-lg">
                    Most popular
                  </span>
                )}

                <div className="flex items-center gap-2">
                  {p.featured && <Sparkles className="h-4 w-4 text-gold-300" />}
                  <h3 className="font-serif text-2xl text-cream">{p.name}</h3>
                </div>
                <p className="mt-1.5 text-sm text-cream/55">{p.idealFor}</p>

                <div className="mt-5 rounded-lg border border-white/10 bg-ink-950/40 px-4 py-3">
                  <span className="text-xs uppercase tracking-[0.18em] text-gold-300/80">
                    Includes
                  </span>
                  <p className="mt-1 text-sm text-cream/80">{p.priceHint}</p>
                </div>

                <ul className="mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-cream/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`mt-8 ${p.featured ? "btn-gold" : "btn-ghost"} w-full`}
                >
                  Get a tailored quote
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-10 text-center text-sm text-cream/50">
            Flexible payment plans available · Free 30-minute strategy call · No
            obligation
          </p>
        </Reveal>
      </div>
    </section>
  );
}
