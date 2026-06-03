"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { faqs } from "@/lib/site";
import { openChat } from "@/lib/chat-events";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative border-t border-white/10 bg-ink-900/40 py-24 md:py-32">
      <div className="container-content">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Left rail */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="Questions"
              title={
                <>
                  Answers, before <br />
                  you even ask
                </>
              }
            />
            <p className="mt-5 max-w-sm text-cream/60">
              Can&apos;t find what you&apos;re looking for? Our AI concierge
              answers instantly, any time.
            </p>
            <button
              onClick={() => openChat("I have a question about your service")}
              className="btn-gold mt-6"
            >
              Ask the concierge
            </button>
          </div>

          {/* Accordion */}
          <div className="divide-y divide-white/10 border-y border-white/10">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span
                      className={`font-serif text-lg transition-colors ${
                        isOpen ? "text-gold-200" : "text-cream"
                      }`}
                    >
                      {f.q}
                    </span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "rotate-45 border-gold-400/60 bg-gold-500/15 text-gold-300"
                          : "border-white/15 text-cream/70"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pr-12 text-cream/65 leading-relaxed">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
