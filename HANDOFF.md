# Developer Handoff — Quill & Crown site

A complete, working marketing site for an ebook writing/publishing service,
with a full-stack AI concierge. This doc is for the developer taking it to
production. (End-user/run instructions are in `README.md`.)

---

## What this is

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · lucide-react
- **Status:** Builds clean (`npm run build` passes), runs, and is fully wired.
  Smoke-tested: homepage 200, chat streams, quote API validates.
- **Design direction:** boutique creative agency, not a "writing mill."
  Deep navy/charcoal base, warm gold accents, Fraunces (serif) headings + Inter
  (sans) body. Subtle on-scroll reveals, smooth scroll, animated portfolio
  filtering, floating hero book stack. No stock art / clip art anywhere.

## Sections (all requested + extras), in order

1. **Navbar** — sticky, transparent→solid on scroll, mobile menu, dual CTAs
2. **Hero** — headline, subhead, two CTAs (Get a Free Quote + Live Chat),
   floating generated book-cover cluster, inline rating/stat trust line
3. **Trust bar** — animated stats + distribution platforms (Amazon, Apple
   Books, B&N, IngramSpark, Kobo, Google Play)
4. **Services** — 6 cards (ghostwriting, editing, formatting, cover design,
   publishing, marketing) with icons + feature bullets
5. **Portfolio** — genre-filterable grid of generated book covers (animated)
6. **Process** — 4 steps on a connecting timeline + a concierge CTA
7. **Testimonials** — text cards **and** a lazy-loaded video testimonial card
   (add `videoUrl` to any testimonial in `lib/site.ts`)
8. **Pricing teaser** — 3 packages (Launch / Signature / Bestseller), no dollar
   figures — pushes to contact, exactly as requested
9. **FAQ** — accordion, sticky left rail with a "ask the bot" CTA
10. **Contact** — working quote form (validated, async, success state)
11. **Footer** — contact info, link columns, socials, legal row

## The AI concierge ("better idea" delivered in full)

- Floating widget on every page, opens from the launcher + any CTA.
- **Streaming** responses, typing indicator, suggested-question chips,
  persona ("Portia"), online status.
- Backend proxy at `app/api/chat/route.ts` → any **OpenAI-compatible** provider.
- **Default provider is Groq (FREE tier)** per the client's request to not use
  their own paid Claude/OpenAI account. Swappable to Gemini/OpenRouter via env.
- **Guided fallback:** with no API key it answers from a keyword knowledge base,
  so it's never broken in a demo.
- **Trainable** by editing `lib/knowledge.ts` (persona, facts, guardrails,
  canned replies). Guardrails already enforce: never invent prices, never
  promise bestseller status, author keeps 100% rights.

---

## TODO before launch (developer)

1. **Get a free Groq key** → https://console.groq.com → put in `.env.local`
   (and in the host's env vars). Without it the bot runs in guided mode.
2. **Wire the quote form** to email/CRM — single marked `TODO` in
   `app/api/quote/route.ts` (Resend/SendGrid/HubSpot/Airtable/Slack).
3. **Swap brand & copy** — `lib/site.ts` (brand name, contact, all section
   content) and re-train the bot in `lib/knowledge.ts`.
4. **Real book covers (optional)** — covers are generated in
   `components/BookCover.tsx`. To use real artwork, drop images in
   `public/covers/` and swap `<BookCover>` for `next/image` in
   `Portfolio.tsx` / `Hero.tsx`.
5. **Legal pages** — Privacy / Terms / Author Agreement footer links are stubs.
6. **Deploy** — Vercel zero-config; set the three `AI_*` env vars.

## Notes / decisions

- Next pinned to `^14.2.35` (patched; the initial `14.2.15` had an advisory).
- Chat history is trimmed to the last 12 messages server-side to keep token use
  (and cost — though Groq's free tier is generous) low.
- Everything respects `prefers-reduced-motion`.
- No database yet — leads are stateless (delivered via the integration you add).
