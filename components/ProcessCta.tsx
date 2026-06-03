"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import Reveal from "./Reveal";
import { openChat } from "@/lib/chat-events";

export default function ProcessCta() {
  return (
    <Reveal>
      <div className="mt-16 flex flex-col items-center justify-between gap-5 rounded-2xl border border-gold-500/20 bg-gradient-to-r from-ink-800/60 to-ink-900/60 p-7 text-center sm:flex-row sm:text-left">
        <p className="font-serif text-lg text-cream md:text-xl">
          Not sure which step you&apos;re on? Our concierge will map it out in 2
          minutes.
        </p>
        <div className="flex shrink-0 gap-3">
          <button onClick={() => openChat()} className="btn-ghost">
            <MessageCircle className="h-4 w-4" /> Ask the bot
          </button>
          <a href="#contact" className="btn-gold">
            Start now <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Reveal>
  );
}
