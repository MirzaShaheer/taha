"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * A thin gold seam with a center diamond that "draws" open when a section
 * scrolls into view — a quiet, premium cue that you've crossed into a new
 * chapter of the page.
 */
export default function SectionSeam({
  align = "center",
}: {
  align?: "left" | "center";
}) {
  const reduce = useReducedMotion();
  const origin = align === "center" ? "center" : "left";

  return (
    <motion.div
      className={`mb-7 flex items-center gap-3 ${
        align === "center" ? "justify-center" : "justify-start"
      }`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.span
        className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500/70 md:w-24"
        style={{ transformOrigin: origin }}
        variants={{
          hidden: { scaleX: reduce ? 1 : 0, opacity: 0 },
          show: { scaleX: 1, opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
        }}
      />
      <motion.span
        className="h-1.5 w-1.5 rotate-45 bg-gold-300 shadow-[0_0_14px_rgba(227,168,28,0.9)]"
        variants={{
          hidden: { scale: 0, opacity: 0 },
          show: { scale: 1, opacity: 1, transition: { duration: 0.5, delay: 0.25 } },
        }}
      />
      <motion.span
        className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500/70 md:w-24"
        style={{ transformOrigin: align === "center" ? "center" : "left" }}
        variants={{
          hidden: { scaleX: reduce ? 1 : 0, opacity: 0 },
          show: { scaleX: 1, opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
        }}
      />
    </motion.div>
  );
}
