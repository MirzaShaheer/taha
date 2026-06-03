import type { Book } from "@/lib/site";

/**
 * Programmatically generated book-cover mockup — no clip art, no stock images.
 * Each cover is composed from typography, foil lines, and a genre-tuned
 * gradient so the portfolio reads like a real catalog of designed books.
 */

const styleClasses: Record<Book["style"], string> = {
  serif: "font-serif font-light leading-[1.05]",
  display: "font-serif font-normal italic leading-[1.0]",
  mono: "font-sans font-semibold uppercase tracking-[0.18em] leading-tight",
};

export default function BookCover({ book }: { book: Book }) {
  const titleSize =
    book.title.length > 18 ? "text-[1.05rem]" : "text-[1.25rem]";

  return (
    <div className="group/cover relative aspect-[2/3] w-full">
      {/* Drop shadow plate */}
      <div className="absolute inset-0 translate-y-3 scale-[0.97] rounded-r-md rounded-l-sm bg-black/50 blur-xl opacity-60" />

      <div
        className={`relative flex h-full w-full flex-col justify-between overflow-hidden rounded-r-md rounded-l-sm bg-gradient-to-br ${book.palette} p-5 shadow-soft ring-1 ring-white/10`}
      >
        {/* Spine */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-3 w-px bg-white/15" />

        {/* Soft sheen that sweeps on hover */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover/cover:translate-x-full" />

        {/* Top foil mark / imprint */}
        <div className="flex items-center justify-between">
          <span
            className="text-[0.55rem] font-semibold uppercase tracking-[0.3em]"
            style={{ color: book.accent }}
          >
            {book.genre}
          </span>
          <span className="font-serif text-[0.7rem] text-white/50">Q&amp;C</span>
        </div>

        {/* Title block */}
        <div className="pl-1">
          <div
            className="mb-3 h-px w-10"
            style={{ backgroundColor: book.accent }}
          />
          <h4
            className={`${styleClasses[book.style]} ${titleSize} text-white`}
            style={
              book.style === "display"
                ? { textShadow: `0 1px 18px ${book.accent}55` }
                : undefined
            }
          >
            {book.title}
          </h4>
        </div>

        {/* Author */}
        <div className="flex items-center justify-between">
          <span className="text-[0.62rem] uppercase tracking-[0.22em] text-white/65">
            {book.author}
          </span>
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: book.accent }}
          />
        </div>
      </div>
    </div>
  );
}
