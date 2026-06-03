"use client";

import { useEffect, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { navLinks, site } from "@/lib/site";
import { openChat } from "@/lib/chat-events";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-ink-950/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container-content flex h-20 items-center justify-between">
        {/* Brand */}
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold-500/40 bg-ink-800 font-serif text-lg text-gold-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            Q
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg tracking-tight text-cream">
              {site.brand}
            </span>
            <span className="mt-0.5 text-[0.6rem] uppercase tracking-[0.28em] text-gold-300/80">
              {site.tagline}
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-sm text-cream/80 transition-colors hover:text-cream after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-gold-400 after:transition-all hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 lg:flex">
          <button onClick={() => openChat()} className="btn-ghost">
            <MessageCircle className="h-4 w-4" />
            Live Chat
          </button>
          <a href="#contact" className="btn-gold">
            Get a Free Quote
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-white/10 p-2 text-cream lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-ink-950/95 backdrop-blur-xl lg:hidden">
          <div className="container-content flex flex-col gap-1 py-4">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-cream/85 hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setOpen(false);
                  openChat();
                }}
                className="btn-ghost w-full"
              >
                <MessageCircle className="h-4 w-4" /> Live Chat
              </button>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="btn-gold w-full"
              >
                Get a Free Quote
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
