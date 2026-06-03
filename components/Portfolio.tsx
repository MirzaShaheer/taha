"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import BookCover from "./BookCover";
import { books, genres, type Genre } from "@/lib/site";

export default function Portfolio() {
  const [active, setActive] = useState<Genre | "All">("All");

  const filtered =
    active === "All" ? books : books.filter((b) => b.genre === active);

  return (
    <section id="portfolio" className="relative py-24 md:py-32">
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-40" />

      <div className="container-content relative">
        <SectionHeading
          eyebrow="Selected work"
          title={
            <>
              A catalog clients are{" "}
              <span className="text-gilt italic">proud</span> to sign
            </>
          }
          subtitle="Real covers from real projects across genres. Filter to see how we tailor design to the shelf your book will live on."
        />

        {/* Filter pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
          {genres.map((g) => {
            const isActive = active === g;
            return (
              <button
                key={g}
                onClick={() => setActive(g)}
                className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                  isActive
                    ? "border-gold-400/60 bg-gold-500/15 text-gold-200 shadow-[0_0_0_1px_rgba(227,168,28,0.3)]"
                    : "border-white/10 bg-white/[0.02] text-cream/65 hover:border-white/25 hover:text-cream"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((book) => (
              <motion.div
                key={book.title}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="group cursor-pointer"
              >
                <div className="transition-transform duration-500 group-hover:-translate-y-2">
                  <BookCover book={book} />
                </div>
                <div className="mt-3 px-1">
                  <p className="truncate font-serif text-sm text-cream">
                    {book.title}
                  </p>
                  <p className="text-xs text-cream/45">
                    {book.author} · {book.genre}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
