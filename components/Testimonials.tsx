"use client";

import { useState } from "react";
import { Quote, Star, Play } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { testimonials } from "@/lib/site";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(n)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <section className="relative py-24 md:py-32">
      <div className="container-content">
        <SectionHeading
          eyebrow="Loved by authors"
          title={
            <>
              They trusted us with their{" "}
              <span className="text-gilt italic">life&apos;s work</span>
            </>
          }
          subtitle="And we treated it that way. Here's what it feels like to publish with a team that actually cares about your book."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => {
            const isVideo = Boolean(t.videoUrl);
            return (
              <Reveal
                key={t.name}
                delay={(i % 3) * 0.08}
                className={isVideo ? "md:row-span-1 lg:col-span-1" : ""}
              >
                <figure className="card flex h-full flex-col p-7">
                  {isVideo && t.videoUrl ? (
                    <div className="relative mb-5 aspect-video overflow-hidden rounded-xl bg-ink-950">
                      {playing === t.name ? (
                        <iframe
                          className="h-full w-full"
                          src={`${t.videoUrl}?autoplay=1`}
                          title={`${t.name} testimonial`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <button
                          onClick={() => setPlaying(t.name)}
                          className="group relative flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-700 to-ink-950"
                          aria-label="Play video testimonial"
                        >
                          <span className="absolute inset-0 bg-grid opacity-30" />
                          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-ink-950 shadow-glow transition-transform group-hover:scale-110">
                            <Play className="ml-0.5 h-6 w-6 fill-ink-950" />
                          </span>
                          <span className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-[0.65rem] uppercase tracking-wide text-cream/80 backdrop-blur">
                            Video · {t.genre}
                          </span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <Quote className="mb-4 h-7 w-7 text-gold-500/50" />
                  )}

                  <blockquote className="flex-1 text-[0.95rem] leading-relaxed text-cream/80">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  <figcaption className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                    <div>
                      <div className="font-serif text-cream">{t.name}</div>
                      <div className="text-xs text-cream/50">{t.role}</div>
                    </div>
                    <Stars n={t.rating} />
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
