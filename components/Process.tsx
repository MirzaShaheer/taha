import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { processSteps } from "@/lib/site";
import ProcessCta from "./ProcessCta";

export default function Process() {
  return (
    <section id="process" className="relative border-y border-white/10 bg-ink-900/40 py-24 md:py-32">
      <div className="container-content">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              Four steps. <span className="text-gilt italic">Zero</span> guesswork.
            </>
          }
          subtitle="A calm, transparent process with clear milestones — so you always know exactly where your book is and what happens next."
        />

        <div className="relative mt-16">
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent lg:block" />

          <div className="grid gap-10 lg:grid-cols-4">
            {processSteps.map((p, i) => (
              <Reveal key={p.step} delay={i * 0.1}>
                <div className="relative text-center lg:text-left">
                  <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/40 bg-ink-950 font-serif text-xl text-gold-300 shadow-[0_0_0_6px_rgba(11,19,38,1)] lg:mx-0">
                    {p.step}
                  </div>
                  <h3 className="mt-5 font-serif text-xl text-cream">
                    {p.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-cream/60">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <ProcessCta />
      </div>
    </section>
  );
}
