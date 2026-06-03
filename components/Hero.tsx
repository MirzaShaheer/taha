"use client";

import { motion } from "framer-motion";
import { MessageCircle, Star, ArrowRight, ChevronDown } from "lucide-react";
import BookCover from "./BookCover";
import Magnetic from "./Magnetic";
import { books } from "@/lib/site";
import { openChat } from "@/lib/chat-events";

const heroBooks = [books[2], books[0], books[4]]; // fantasy, business, romance

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-24 md:pt-40">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.45]" />
      <div className="pointer-events-none absolute inset-0 bg-radial-gold" />
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-gold-700/10 blur-[120px] animate-glow-breathe" />
      <div className="pointer-events-none absolute -right-32 top-40 h-80 w-80 rounded-full bg-gold-600/10 blur-[120px] animate-glow-breathe [animation-delay:2s]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-full -translate-x-1/2 bg-gradient-to-t from-ink-950 to-transparent" />

      <div className="container-content relative grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow"
          >
            <span className="h-px w-6 bg-gold-400" />
            Ghostwriting · Editing · Publishing
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="heading-serif mt-6 text-4xl leading-[1.05] sm:text-5xl md:text-6xl"
          >
            Your story deserves a{" "}
            <span className="text-gilt-anim italic">beautifully made</span> book.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-cream/70"
          >
            We ghostwrite, edit, design, and publish books for founders,
            experts, and storytellers across the US — and we make them look like
            they belong on a bestseller shelf, because they will.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Magnetic>
              <a href="#contact" className="btn-gold text-base">
                Get a Free Quote
                <ArrowRight className="h-4 w-4" />
              </a>
            </Magnetic>
            <Magnetic>
              <button onClick={() => openChat()} className="btn-ghost text-base">
                <MessageCircle className="h-4 w-4" />
                Chat with our concierge
              </button>
            </Magnetic>
          </motion.div>

          {/* Micro trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-cream/60"
          >
            <span className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-gold-400 text-gold-400"
                />
              ))}
              <span className="ml-1 text-cream/80">4.9/5</span>
            </span>
            <span className="h-4 w-px bg-white/15" />
            <span>
              <strong className="text-cream">480+</strong> books published
            </span>
            <span className="h-4 w-px bg-white/15" />
            <span>100% rights stay yours</span>
          </motion.div>
        </div>

        {/* Floating book cluster */}
        <div className="relative mx-auto hidden h-[460px] w-full max-w-md lg:block">
          {/* Slowly rotating gilded ring behind the stack */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 rounded-full border border-gold-500/15 animate-spin-slow" />
            <div className="absolute inset-8 rounded-full border border-dashed border-gold-500/10 animate-spin-slow [animation-direction:reverse] [animation-duration:38s]" />
          </div>

          {heroBooks.map((book, i) => {
            const positions = [
              "left-0 top-10 z-10 rotate-[-8deg]",
              "left-1/2 top-0 z-30 -translate-x-1/2",
              "right-0 top-16 z-20 rotate-[8deg]",
            ];
            const widths = ["w-44", "w-52", "w-44"];
            return (
              <motion.div
                key={book.title}
                initial={{ opacity: 0, y: 40, rotate: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + i * 0.12 }}
                className={`absolute ${positions[i]} ${widths[i]}`}
              >
                <div className="animate-float" style={{ animationDelay: `${i * 0.8}s` }}>
                  <BookCover book={book} />
                </div>
              </motion.div>
            );
          })}

          {/* Glow under stack */}
          <div className="absolute inset-x-8 bottom-4 h-24 rounded-full bg-gold-500/20 blur-3xl" />
        </div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#services"
        aria-label="Scroll to explore"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-gold-300/60 transition-colors hover:text-gold-200 md:flex"
      >
        <span className="text-[0.6rem] uppercase tracking-[0.35em]">Explore</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}
