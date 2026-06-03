import type { ReactNode } from "react";

/**
 * Monochrome brand lockups (glyph + wordmark) rendered in `currentColor`, so
 * they pick up the site's gold/cream and glow on hover — the premium
 * "available everywhere" retailer strip you see on luxury storefronts.
 * Drawn as inline SVG/text (not trademark image assets) and kept single-tone.
 */

export type Platform = { name: string; node: ReactNode };

const wm = "font-sans text-base md:text-lg tracking-tight whitespace-nowrap";

export const platforms: Platform[] = [
  {
    name: "Amazon",
    node: (
      <span className={`relative inline-block ${wm} font-semibold lowercase`}>
        amazon
        <svg
          className="absolute -bottom-1.5 left-1"
          width="58"
          height="11"
          viewBox="0 0 58 11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M1 2.5C18 9.5 40 9.5 54 3" />
          <path d="M49.5 5 54 3l.2 4.6" />
        </svg>
      </span>
    ),
  },
  {
    name: "Apple Books",
    node: (
      <span className="flex items-center gap-2">
        <svg width="18" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M17.6 12.8c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.8-2.1-1.6-.2-3.1.9-3.9.9s-2-.9-3.4-.9C7 6.8 5.3 7.9 4.4 9.5c-1.9 3.3-.5 8.2 1.4 10.9.9 1.3 1.9 2.7 3.3 2.6 1.3-.1 1.8-.8 3.4-.8s2 .8 3.4.8 2.3-1.3 3.2-2.6c1-1.5 1.4-2.9 1.4-3-.1 0-2.6-1-2.5-3.6z" />
          <path d="M15 4.9c.7-.9 1.2-2.1 1.1-3.3-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.1.1 2.3-.6 3-1.5z" />
        </svg>
        <span className={wm}>
          <span className="font-medium">Apple</span> Books
        </span>
      </span>
    ),
  },
  {
    name: "Barnes & Noble",
    node: (
      <span className="flex items-center gap-2">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 6c-1.8-1.2-4-1.5-6-1v12c2-.5 4.2-.2 6 1 1.8-1.2 4-1.5 6-1V5c-2-.5-4.2-.2-6 1z" />
          <path d="M12 6v13" />
        </svg>
        <span className="whitespace-nowrap font-serif text-base md:text-lg">
          Barnes &amp; Noble
        </span>
      </span>
    ),
  },
  {
    name: "IngramSpark",
    node: (
      <span className="flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2l1.7 7.5L21 11l-7.3 1.5L12 20l-1.7-7.5L3 11l7.3-1.5z" />
        </svg>
        <span className={wm}>
          Ingram<span className="font-semibold">Spark</span>
        </span>
      </span>
    ),
  },
  {
    name: "Kobo",
    node: (
      <span className="flex items-center gap-2">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
        </svg>
        <span className={`${wm} font-semibold lowercase`}>kobo</span>
      </span>
    ),
  },
  {
    name: "Google Play",
    node: (
      <span className="flex items-center gap-2">
        <svg width="17" height="19" viewBox="0 0 18 20" fill="currentColor" aria-hidden>
          <path d="M1 1.4 15.6 10 1 18.6 8 10z" />
        </svg>
        <span className={wm}>Google Play</span>
      </span>
    ),
  },
];
