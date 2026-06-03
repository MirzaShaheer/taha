# Quill & Crown — Boutique Book Publishing site

A premium, conversion-focused marketing site for an ebook writing & publishing
service, built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS +
Framer Motion**, with a **full-stack AI concierge** ("Portia") wired to a free,
swappable AI provider.

> "Quill & Crown" / "Portia" are placeholders — rename them anywhere (see
> _Make it yours_ below). Nothing is hard-coded into components.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Production:

```bash
npm run build
npm run start
```

The site runs fully **without any API key** — the chat bot falls back to a
built-in "guided mode" so it's never broken in a demo.

---

## The AI concierge (chat bot)

A real streaming chat assistant lives bottom-right on every page. It opens from
the launcher, the navbar **Live Chat** button, the hero, and several in-page
CTAs.

### Two modes

| Mode | When | Behavior |
|------|------|----------|
| **Live AI** | `AI_API_KEY` is set | Streams real answers from an LLM, grounded in the knowledge base. |
| **Guided** | no key set / provider error | Smart keyword replies from `lib/knowledge.ts`. Always works. |

### Go fully live in 2 minutes — with a FREE provider

The bot talks to any **OpenAI-compatible** endpoint. The default is **Groq**,
which has a generous free tier (no credit card) and runs fast open models.

1. Create a free key at **https://console.groq.com**
2. Open `.env.local` and paste it:
   ```env
   AI_BASE_URL=https://api.groq.com/openai/v1
   AI_API_KEY=gsk_your_key_here
   AI_MODEL=llama-3.3-70b-versatile
   ```
3. Restart `npm run dev`. Done — the widget now streams real AI answers.

**Other free options** (just change the 3 vars — see `.env.example`):
- **Google Gemini** free tier — `gemini-2.0-flash`
- **OpenRouter** free models — `meta-llama/llama-3.3-70b-instruct:free`

Your key stays on the server (`app/api/chat/route.ts`); it is never exposed to
the browser.

### How to "train" the bot

Everything the bot knows is in **`lib/knowledge.ts`**:
- `SYSTEM_PERSONA` — its personality, tone, and hard rules (no fake prices,
  rights stay with the author, etc.)
- `buildKnowledge()` — facts, auto-compiled from your site content
- `GUIDED_REPLIES` — keyword answers used in guided mode
- `GREETING` / `SUGGESTIONS` — the opening message and starter chips

Edit those strings to retrain it. No component changes needed. (You can also
just ask me to update them for you later.)

---

## Make it yours (edit content, not code)

Almost all copy and data lives in **`lib/site.ts`**:

- `site` — brand name, tagline, contact email/phone/location
- `stats` — the trust-bar numbers
- `services`, `processSteps`, `packages`, `faqs` — section content
- `testimonials` — text cards; add a `videoUrl` (YouTube/Vimeo embed URL) to a
  testimonial to turn it into a **video testimonial card**
- `books` + `genres` — the filterable portfolio

### Book covers
Covers are **generated in code** (`components/BookCover.tsx`) from typography +
gradients — no stock art, no clip art. To use **real cover images** instead,
drop files in `public/covers/` and swap the `<BookCover>` for an `<Image>` in
`components/Portfolio.tsx` (and `Hero.tsx`).

### Brand colors & fonts
- Palette: `tailwind.config.ts` → `colors` (`ink`, `gold`, `cream`)
- Fonts: `app/layout.tsx` → Fraunces (serif headings) + Inter (sans body)

---

## Lead capture (the quote form)

`POST /api/quote` (`app/api/quote/route.ts`) validates and currently logs leads
to the server console. To receive them for real, wire one integration at the
marked `TODO` (Resend/SendGrid email, HubSpot/Airtable CRM, Google Sheet, or a
Slack webhook).

---

## Project structure

```
app/
  layout.tsx            # fonts, metadata
  page.tsx              # assembles all sections
  globals.css           # design tokens & component classes
  api/chat/route.ts     # streaming AI proxy (+ guided fallback)
  api/quote/route.ts    # quote-form handler
components/             # Navbar, Hero, Services, Portfolio, … , ChatWidget
lib/
  site.ts               # ← all site content/data
  knowledge.ts          # ← the bot's brain (train it here)
  chat-events.ts        # open-chat event bus
```

## Deploy

Zero-config on **Vercel** (recommended) or any Node host. Add the three `AI_*`
environment variables in your host's dashboard. `npm run build` already passes.
