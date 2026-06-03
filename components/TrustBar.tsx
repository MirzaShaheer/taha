"use client";

import { motion } from "framer-motion";
import { stats } from "@/lib/site";
import CountUp from "./CountUp";
import { platforms } from "./PlatformLogos";

const statVariants = {
  hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const logoContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const logoItem = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function TrustBar() {
  return (
    <section className="relative border-y border-white/10 bg-ink-900/40">
      <div className="container-content py-12">
        {/* Stats — numbers run up like a meter when scrolled into view */}
        <div className="grid grid-cols-2 gap-y-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={statVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="text-center"
            >
              <CountUp
                value={s.value}
                className="text-gilt font-serif text-3xl md:text-4xl"
              />
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-cream/55">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="rule-gold my-10" />

        {/* Distribution — logos fade/slide/blur in, one after another */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={logoContainer}
        >
          <p className="mb-6 text-center text-xs uppercase tracking-[0.25em] text-cream/45">
            Your book, live everywhere readers buy
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14">
            {platforms.map((p) => (
              <motion.div
                key={p.name}
                variants={logoItem}
                className="text-cream/45 transition-all duration-300 hover:text-gold-300 hover:[filter:drop-shadow(0_0_15px_rgba(227,168,28,0.65))]"
                aria-label={p.name}
              >
                {p.node}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
