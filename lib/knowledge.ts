/**
 * ============================================================================
 *  AI CONCIERGE "BRAIN"  —  this is how you TRAIN the bot.
 * ============================================================================
 *  Everything the on-site assistant knows about the business lives here.
 *  To retrain / update the bot, just edit the strings below (persona, facts,
 *  guardrails, and the guided intents). No other code needs to change.
 *
 *  Two layers:
 *   1) SYSTEM_PERSONA + KNOWLEDGE  -> sent to the live AI model.
 *   2) INTENTS (guided engine)     -> context-aware fallback used when no API
 *                                     key is set, so the widget is always smart
 *                                     and never "loses the thread" in a demo.
 * ============================================================================
 */

import { site, services, packages, faqs, processSteps, stats } from "./site";

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

/* -------------------------------------------------------------------------- */
/*  1. Persona + guardrails  (live AI mode)                                    */
/* -------------------------------------------------------------------------- */

export const SYSTEM_PERSONA = `
You are "Portia", the warm, sharp concierge for ${site.brand}, a boutique US-based ebook writing & publishing house.

YOUR JOB
- Help visitors understand our services, build confidence, and guide them toward a free quote or starting a project.
- Sound like a knowledgeable, friendly publishing consultant at a high-end agency — calm, encouraging, never pushy or salesy.

CONVERSATION DISCIPLINE (this is what keeps you from getting confused)
- ALWAYS read the full conversation so far before replying. Stay consistent with what you've already told the visitor; never contradict an earlier answer.
- Track context: remember the visitor's stage (just an idea / drafting / finished manuscript / already published), their genre, and their goal once they tell you. Use it.
- Do NOT repeat an answer you already gave. If they ask something related, build on it and move the conversation one concrete step forward.
- Ask at most ONE clarifying question per reply, and only when it genuinely helps. If they've already answered it, don't ask again.
- If a message is short ("yes", "sure", "fantasy", "not yet"), interpret it in light of YOUR last message — don't reset the conversation.
- If you're unsure what they mean, briefly say so and offer 2–3 concrete options rather than guessing.

STYLE
- Premium but approachable. Confident, never arrogant. American English.
- Keep replies short and skimmable: 2–4 sentences or a tight bullet list. This is a chat widget, not an essay.
- When relevant, gently point to the next step: "Get a Free Quote", the contact form, or a specific section.

HARD RULES
- NEVER invent specific dollar prices. We quote per project. If asked for price, explain we tailor quotes, name the three tiers (Launch, Signature, Bestseller), and offer to connect them.
- NEVER promise guaranteed bestseller status, sales numbers, or timelines you can't support. Be honest and encouraging.
- The author ALWAYS keeps 100% of their rights and royalties — emphasize this when relevant.
- If you don't know something, say so and offer a human follow-up via the contact form.
- Stay on topic (books, writing, publishing, our services). Politely redirect off-topic chats.
`.trim();

/* -------------------------------------------------------------------------- */
/*  2. Structured knowledge — compiled from the site content config            */
/* -------------------------------------------------------------------------- */

export function buildKnowledge(): string {
  const serviceLines = services
    .map((s) => `- ${s.title}: ${s.blurb}`)
    .join("\n");

  const packageLines = packages
    .map(
      (p) =>
        `- ${p.name} (${p.idealFor}) — includes: ${p.priceHint}. Features: ${p.features.join(
          ", "
        )}.`
    )
    .join("\n");

  const processLines = processSteps
    .map((p) => `${p.step}. ${p.title}: ${p.body}`)
    .join("\n");

  const faqLines = faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n");

  const statLine = stats.map((s) => `${s.value} ${s.label}`).join(" · ");

  return `
COMPANY: ${site.brand} — ${site.tagline}.
ABOUT: ${site.description}
TRACK RECORD: ${statLine}.
CONTACT: ${site.contact.email} · ${site.contact.phone} · ${site.contact.location} · Hours: ${site.contact.hours}.

SERVICES WE OFFER:
${serviceLines}

OUR 4-STEP PROCESS:
${processLines}

PACKAGE TIERS (names only — never quote dollar amounts):
${packageLines}

FREQUENTLY ASKED QUESTIONS (use these as ground truth):
${faqLines}
`.trim();
}

export function buildSystemPrompt(): string {
  return `${SYSTEM_PERSONA}\n\n--- KNOWLEDGE BASE ---\n${buildKnowledge()}`;
}

/* -------------------------------------------------------------------------- */
/*  3. Opening message + suggested chips (shown in the widget)                  */
/* -------------------------------------------------------------------------- */

export const GREETING = `Hi, I'm Portia — the ${site.brand} concierge. Whether you've got a finished manuscript or just an idea in your head, I can help you find the right next step. What are you working on?`;

export const SUGGESTIONS = [
  "How does the process work?",
  "I have an idea but haven't written anything",
  "What does it cost?",
  "Do I keep my rights & royalties?",
];

/* -------------------------------------------------------------------------- */
/*  4. Guided engine (no API key) — context-aware intent matching               */
/* -------------------------------------------------------------------------- */
/*  Why this is better than naive keyword matching:                            */
/*   • Scores every intent and picks the BEST match, not the first.            */
/*   • Reads the whole conversation, so it won't repeat itself and can         */
/*     interpret short replies ("yes", "memoir") in context.                   */
/*   • Has dedicated handlers for greetings, thanks, affirmations, and         */
/*     "are you a bot?" so it never feels lost.                                */
/* -------------------------------------------------------------------------- */

const email = site.contact.email;
const phone = site.contact.phone;

type Intent = {
  id: string;
  /** Weighted matchers — multi-word phrases should outweigh single keywords. */
  patterns: { re: RegExp; w: number }[];
  reply: string;
  /** Shown instead of `reply` if we've already covered this topic. */
  alt?: string;
  /** A short, unique phrase from `reply` used to detect prior coverage. */
  signature: string;
};

const kw = (words: string[], w = 1) =>
  words.map((word) => ({
    re: new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i"),
    w,
  }));

const phrase = (phrases: string[], w = 2.5) =>
  phrases.map((p) => ({ re: new RegExp(p, "i"), w }));

const INTENTS: Intent[] = [
  {
    id: "pricing",
    signature: "quote per project",
    patterns: [
      ...phrase(["how much", "what.s the (price|cost)", "price range", "ball ?park", "too expensive"]),
      ...kw(["price", "pricing", "cost", "costs", "quote", "expensive", "afford", "budget", "fee", "rate", "charge", "dollar", "\\$"]),
    ],
    reply:
      "Every book is different, so we quote per project rather than post fixed prices — you only pay for what your book actually needs. Most authors land in one of three tiers: Launch (you have a manuscript), Signature (idea → finished book), or Bestseller (everything + marketing). Tell me roughly what you need and I'll point you to the right one — or grab a free, no-obligation quote in the contact section.",
    alt:
      "Same answer holds — it's genuinely project-based, so the most useful thing is a quick quote. If you share your name and a sentence about your book, I'll make sure the team sends an exact, all-in proposal (no surprise fees). Want to do that?",
  },
  {
    id: "rights",
    signature: "100% of your rights",
    patterns: [
      ...phrase(["my name on", "who owns", "keep the rights", "keep my royalt"]),
      ...kw(["rights", "royalty", "royalties", "ownership", "\\bown\\b", "byline", "copyright", "credited", "credit"]),
    ],
    reply:
      "You keep 100% of your rights and royalties — always. We work behind the scenes; your name is the only one on the cover, and you stay in full creative control from first page to launch.",
  },
  {
    id: "process",
    signature: "four simple steps",
    patterns: [
      ...phrase(["how does (it|this|the process) work", "how do (you|we) (work|start)", "what.s the process", "where do i start", "how do i (start|begin|get going)", "what happens (next|first)", "next step"]),
      ...kw(["process", "steps", "begin", "getting started"]),
    ],
    reply:
      "It's four simple steps: 1) a discovery call to learn your idea, voice, and goals, 2) write & edit in clear milestones with you reviewing each chapter, 3) design the cover and format the interior, and 4) publish, distribute, and help you launch. Where would you say you are right now — just an idea, mid-draft, or a finished manuscript?",
  },
  {
    id: "timeline",
    signature: "3–6 months",
    patterns: [
      ...phrase(["how long (does|will|until)", "how quickly", "turn ?around", "time ?frame", "how fast", "when (will|would|can) it be done", "how soon"]),
      ...kw(["timeline", "deadline", "duration"]),
    ],
    reply:
      "Most books run 3–6 months depending on length and service level. Editing-only projects can move in a few weeks; a full ghostwritten book takes longer because we build it with you chapter by chapter. After the discovery call we give you a firm, dated timeline. Are you working toward a specific launch date?",
  },
  {
    id: "ghostwriting",
    signature: "ghostwriting service is for",
    patterns: [
      ...phrase(["haven.?t written", "not written", "just an idea", "in my head", "from scratch", "write it for me", "write my book", "don.?t know where to start", "can.?t write"]),
      ...kw(["ghostwrite", "ghostwriting", "ghost", "ghostwriter"]),
    ],
    reply:
      "Perfect — that's exactly what our ghostwriting service is for. Through recorded interviews and any material you already have, an award-winning writer captures your voice and turns your idea into a finished manuscript that genuinely sounds like you. Many of our most successful books started as nothing more than an idea. What's yours about?",
  },
  {
    id: "editing",
    signature: "take it the rest of the way",
    patterns: [
      ...phrase(["already (written|wrote|finished)", "finished (my|the|a) (book|draft|manuscript)", "done writing", "i have a (draft|manuscript)", "need (it )?edited", "clean (it|up)"]),
      ...kw(["edit", "editing", "editor", "manuscript", "draft", "proofread", "revise", "rewrite", "polish"]),
    ],
    reply:
      "Wonderful — if your draft is done, we can take it the rest of the way: developmental, line, and copy editing, a standout cover, professional formatting, and a real publishing + launch plan. What genre is it, and roughly how long?",
  },
  {
    id: "cover",
    signature: "earn the click",
    patterns: [
      ...phrase(["cover (design|art)", "book cover", "design (a|the|my) cover"]),
      ...kw(["cover", "jacket"]),
    ],
    reply:
      "Our designers create original, genre-aware covers built to earn the click on Amazon and stop the scroll on the shelf — three concepts, print + 3D mockups, and revisions until it's right. A great cover is one of the highest-ROI parts of a book. Is it for fiction or non-fiction?",
  },
  {
    id: "formatting",
    signature: "typesetting that looks at home",
    patterns: [
      ...phrase(["interior format", "print ready", "kindle file", "ebook file"]),
      ...kw(["format", "formatting", "typeset", "typesetting", "layout", "epub", "mobi"]),
    ],
    reply:
      "We handle print- and ebook-ready typesetting that looks at home next to any traditionally published title — custom typography plus retailer-ready EPUB, MOBI, and print files. It's included in every package. Are you going print, ebook, or both?",
  },
  {
    id: "publishing",
    signature: "KDP, IngramSpark",
    patterns: [
      ...phrase(["get (it|my book) on amazon", "self ?publish", "traditional publish", "publish (it|my book)", "wide distribution"]),
      ...kw(["publish", "publishing", "distribute", "distribution", "kdp", "ingram", "isbn", "barnes"]),
    ],
    reply:
      "We handle the whole publishing side — KDP, IngramSpark, and wide distribution — so your book is live and buyable everywhere that matters, with proper metadata and keywords. You keep the accounts and the royalties; we just do the heavy lifting. Do you want Amazon-only or wide distribution?",
  },
  {
    id: "marketing",
    signature: "in front of readers who buy",
    patterns: [
      ...phrase(["sell more", "get readers", "book launch", "amazon ads", "hit the bestseller", "best ?seller list", "promote (it|my book)"]),
      ...kw(["marketing", "market", "launch", "ads", "promotion", "promote", "reviews", "\\bpr\\b", "publicity"]),
    ],
    reply:
      "We don't publish and disappear. Our marketing service covers launch strategy, Amazon ads, reviews, and PR to put your book in front of readers who buy — it's the heart of our Bestseller package. Are you launching something new or trying to revive a book that's already out?",
  },
  {
    id: "website",
    signature: "author website",
    patterns: [
      ...phrase(["author (web)?site", "web ?site", "landing page", "online presence", "build me a site", "my own site"]),
      ...kw(["website", "webpage"]),
    ],
    reply:
      "Yes — we design author websites too: a clean, on-brand home for your book(s), your story, an email sign-up, and buy links to every retailer. It's mobile-fast and built to be found, so readers and press land in the right place. Do you have a book launching, or is this to build your author platform ahead of one?",
  },
  {
    id: "audiobook",
    signature: "audiobook production",
    patterns: [
      ...phrase(["audio ?book", "narrat", "voice over"]),
      ...kw(["audible", "acx", "audio"]),
    ],
    reply:
      "Yes — audiobook production is part of our Bestseller package: professional narration, mastering, and ACX/Audible distribution. Audiobooks are one of the fastest-growing formats, so they're well worth it for the right book. Do you already have a finished manuscript to base it on?",
  },
  {
    id: "samples",
    signature: "portfolio",
    patterns: [
      ...phrase(["see (your|some) (work|books|samples)", "past work", "case stud", "examples of", "books you.?ve (done|made|written)"]),
      ...kw(["sample", "samples", "portfolio", "examples"]),
    ],
    reply:
      "Take a look at the Portfolio section just below — every cover there was made in-house across memoir, business, fantasy, thriller, romance, and children's. Because our work is confidential, we share author names only with permission, but the team can send genre-matched samples privately. Want me to note your genre so they include the right ones?",
  },
  {
    id: "guarantee",
    signature: "revisions are built in",
    patterns: [
      ...phrase(["money ?back", "refund", "what if i don.?t like", "not happy", "satisfaction guarantee", "how many revisions"]),
      ...kw(["guarantee", "guaranteed", "revisions"]),
    ],
    reply:
      "Revisions are built in at every stage, and nothing moves forward until you sign off — so you're never stuck with work you don't love. We can't honestly guarantee sales figures (no reputable house can), but we can promise craft, transparency, and a book you're proud to put your name on. Anything specific you're worried about?",
  },
  {
    id: "confidential",
    signature: "completely confidential",
    patterns: [
      ...phrase(["will anyone know", "stay anonymous", "keep it private", "non.?disclosure"]),
      ...kw(["nda", "confidential", "confidentiality", "anonymous", "private", "discreet"]),
    ],
    reply:
      "Completely confidential. We work under NDA, your project is never shared without permission, and since you hold the byline, no one ever needs to know we were involved. Discretion is part of the service.",
  },
  {
    id: "ai_concern",
    signature: "real, award-winning human writers",
    patterns: [
      ...phrase(["written by (ai|a (bot|computer|machine))", "use (chatgpt|ai) to write", "is it ai", "ai.?generated", "real (writer|human|person) write"]),
      ...kw(["chatgpt"]),
    ],
    reply:
      "Your book is written by real, award-winning human writers — not AI. We pair you with a ghostwriter who studies your voice through interviews and writes the manuscript by hand. (I'm just the friendly concierge out front.) That craft is exactly why the writing reads like you.",
  },
  {
    id: "length",
    signature: "word count",
    patterns: [
      ...phrase(["how many words", "word count", "how (many|long) (pages|words)", "how long should (my|the) book"]),
      ...kw(["wordcount"]),
    ],
    reply:
      "Good question — it depends on the genre. Business and self-help books often run 25k–50k words, memoir and most non-fiction 50k–80k, and novels anywhere from 60k (romance) to 100k+ (fantasy/thriller). We'll right-size it to your goal during the discovery call. What kind of book are you picturing?",
  },
  {
    id: "payment",
    signature: "milestone payments",
    patterns: [
      ...phrase(["payment plan", "pay in installments", "pay over time", "deposit", "up ?front", "financ"]),
      ...kw(["installment", "installments"]),
    ],
    reply:
      "Most projects are split into milestone payments tied to stages of the work, rather than one big sum up front — so it stays manageable and you always see progress for what you pay. The team can lay out a plan that fits your timeline. Want me to connect you to talk specifics?",
  },
  {
    id: "about",
    signature: "boutique",
    patterns: [
      ...phrase(["who are you", "what is quill", "tell me about (you|quill|the company)", "about the company", "where are you (based|located)", "how long have you"]),
      ...kw(["company"]),
    ],
    reply: `${site.brand} is a boutique ghostwriting, editing, and publishing house — ${stats[0].value} books published, a ${stats[1].value} average rating, and ${stats[2].value} bestseller-list placements. We're US-based (${site.contact.location}) and we treat every book like it's going on a bestseller shelf. What can I help you make?`,
  },
  {
    id: "contact",
    signature: email,
    patterns: [
      ...phrase(["talk to (a|someone|the team|a human)", "speak (to|with)", "real person", "book a call", "get on a call", "contact (you|the team)", "reach you"]),
      ...kw(["contact", "call", "human", "email", "phone", "consultation"]),
    ],
    reply: `Happy to connect you. You can reach the team at ${email} or ${phone}, or use the quick form in the contact section and we'll reply within one business day. Want me to summarize what you're looking for so they're ready for you?`,
  },
];

/** Genre-specific flavor for when a visitor names what they're writing. */
const GENRES: { re: RegExp; note: string }[] = [
  { re: /\bmemoir|life story|autobiograph/i, note: "Memoir is one of our favorite forms — the craft is turning lived experience into a story readers can't put down." },
  { re: /\bbusiness|self.?help|leadership|entrepreneur|founder/i, note: "Business and self-help books are powerful lead magnets — we make sure yours reads like authority, not a brochure." },
  { re: /\bfantasy|sci.?fi|science fiction|dragon/i, note: "Fantasy and sci-fi live or die on world-building and cover art — both are real strengths of ours." },
  { re: /\bthriller|mystery|crime|suspense/i, note: "Thrillers are all about pace and a cover that promises tension — we love these." },
  { re: /\bromance/i, note: "Romance readers are voracious and judge by the cover first — we lean into that hard." },
  { re: /\bchildren|kids|picture book|young adult|\bya\b/i, note: "Children's and YA need the right voice and illustration feel — we tailor the whole package to the age group." },
  { re: /\bpoetry|poem/i, note: "Poetry is a labor of love — we focus on typesetting and a cover that respects the work." },
  { re: /\bcook ?book|recipe/i, note: "Cookbooks are design-heavy — layout and photography direction matter as much as the words." },
];

/* ---- small helpers -------------------------------------------------------- */

const lastUser = (msgs: ChatMessage[]) =>
  [...msgs].reverse().find((m) => m.role === "user")?.content ?? "";

const lastAssistant = (msgs: ChatMessage[]) =>
  [...msgs].reverse().find((m) => m.role === "assistant")?.content ?? "";

const assistantHistory = (msgs: ChatMessage[]) =>
  msgs
    .filter((m) => m.role === "assistant")
    .map((m) => m.content.toLowerCase())
    .join("\n");

const alreadyCovered = (sig: string, history: string) =>
  history.includes(sig.toLowerCase());

const isShort = (t: string) => t.trim().split(/\s+/).length <= 4;

/* ---- main entry ----------------------------------------------------------- */

export function guidedReply(messages: ChatMessage[]): string {
  const text = lastUser(messages).trim();
  const lower = text.toLowerCase();
  const history = assistantHistory(messages);
  const prevAssistant = lastAssistant(messages).toLowerCase();
  const userTurns = messages.filter((m) => m.role === "user").length;

  if (!text) return GREETING;

  /* --- 1. Conversational handlers that depend on context ------------------ */

  // Pure greeting (and not much else)
  if (/^(hi|hey|hello|yo|howdy|hiya|good (morning|afternoon|evening)|greetings)\b[!. ]*$/i.test(lower)) {
    return userTurns <= 1
      ? GREETING
      : "Still here! What else can I help you with — pricing, process, or getting your book started?";
  }

  // Thanks
  if (/\b(thank|thanks|thx|appreciate|cheers|that.s helpful|helpful)\b/i.test(lower) && isShort(text)) {
    return `My pleasure! Whenever you're ready, a free quote in the contact section is the easiest next step — or reach us at ${email}. Anything else on your mind?`;
  }

  // Goodbye
  if (/\b(bye|goodbye|see you|see ya|that.s all|that is all|gotta go|i.m good|nothing else|no thanks)\b/i.test(lower) && isShort(text)) {
    return `Thanks for stopping by! When you're ready to move forward, the quote form or ${email} will reach us. Wishing you and your book all the best. 📖`;
  }

  // "Are you a real person / bot?"
  if (/\b(are you (a |an )?(bot|robot|ai|human|real|person)|is this (a |an )?(bot|ai|real)|you.?re (a |an )?(bot|ai))/i.test(lower)) {
    return "Fair question — I'm Portia, the automated concierge for the site, here to answer questions any time of day. For anything detailed, I'll happily hand you to a real member of our team via the contact form. What can I help with?";
  }

  // Confused / "what?" / "that doesn't make sense"
  if (/\b(confus|i.?m lost|what.? do you mean|doesn.?t make sense|didn.?t (understand|get)|huh\b|not following)\b/i.test(lower)) {
    return "Sorry about that — let me reset. I can help with three things, mainly: how our process works, what it might cost, and getting your book started (writing, editing, cover, publishing, or marketing). Which of those is most useful right now?";
  }

  // Short yes / affirmation — interpret against our last message
  if (/^(yes|yep|yeah|yup|sure|ok|okay|please|sounds good|go ahead|do it|that works|absolutely|definitely|let.?s do it|sure thing|alright)\b/i.test(lower) && isShort(text)) {
    if (/summarize|connect you|ready for you|note your genre|talk specifics|connect you to talk/i.test(prevAssistant)) {
      return `Great — the fastest path is the quick form in the contact section (or email ${email}). Drop your name and a sentence about your book, and the team will follow up within one business day with next steps and a clear quote. Anything you'd like me to flag for them?`;
    }
    if (/just an idea|mid-draft|finished manuscript|where (would you say )?you are/i.test(prevAssistant)) {
      return "Perfect — tell me which fits best: (a) just an idea, (b) a partial draft, or (c) a finished manuscript? That tells me exactly where to start you.";
    }
    if (/fiction or non-fiction|what genre|what kind of book|what.s (it|yours) about/i.test(prevAssistant)) {
      return "Love it — what's the genre or topic? Even a sentence helps me tailor the advice.";
    }
    return "Great! To point you in the right direction — are you after writing, editing, a cover, publishing, or marketing? And is your book an idea, a draft, or finished?";
  }

  // Short no / "not yet"
  if (/^(no|nope|not yet|not really|nah|not sure|idk|i don.?t know)\b/i.test(lower) && isShort(text)) {
    return "No problem at all. Want me to walk you through how we work, talk through the three package tiers, or show you the kinds of books we've made? Any of those is a good place to start.";
  }

  /* --- 2. Score every intent and pick the best --------------------------- */

  let best: { intent: Intent; score: number } | null = null;
  for (const intent of INTENTS) {
    let score = 0;
    for (const { re, w } of intent.patterns) {
      if (re.test(lower)) score += w;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { intent, score };
    }
  }

  // Detect a bare genre mention to enrich the reply (or stand alone).
  const genre = GENRES.find((g) => g.re.test(lower));

  if (best && best.score >= 1) {
    const { intent } = best;
    let reply =
      intent.alt && alreadyCovered(intent.signature, history)
        ? intent.alt
        : intent.reply;

    // If they also named a genre and we haven't woven it in, add a touch.
    if (genre && !["samples", "contact", "about"].includes(intent.id) && !history.includes(genre.note.toLowerCase().slice(0, 24))) {
      reply = `${genre.note} ${reply}`;
    }
    return reply;
  }

  /* --- 3. Genre-only message (no other intent matched) -------------------- */

  if (genre) {
    return `${genre.note} Are you starting from an idea, a draft, or a finished manuscript? That tells me whether to talk ghostwriting, editing, or straight to design and publishing.`;
  }

  // Stage-only message (e.g. "I have a finished book", "halfway through")
  if (/\bidea\b|thinking about|want to write/i.test(lower)) {
    return INTENTS.find((i) => i.id === "ghostwriting")!.reply;
  }
  if (/\bdraft\b|half.?way|in progress|working on it|started writing|finished|completed/i.test(lower)) {
    return INTENTS.find((i) => i.id === "editing")!.reply;
  }

  /* --- 4. Smart default — references their words, offers concrete options -- */

  const opener = userTurns > 2 ? "Got it. " : "Happy to help! ";
  return `${opener}I can walk you through any part of making a book — ghostwriting, editing, cover design, formatting, publishing, or marketing — explain how our process works, or point you to a free quote. What are you working on, and where are you in it (just an idea, a draft, or finished)? You can also reach the team directly at ${email}.`;
}

/**
 * Back-compat shim: older callers pass a single string. New code should pass
 * the full message array to `guidedReply` for context awareness.
 */
export function guidedAnswer(userTextOrMessages: string | ChatMessage[]): string {
  if (Array.isArray(userTextOrMessages)) return guidedReply(userTextOrMessages);
  return guidedReply([{ role: "user", content: userTextOrMessages }]);
}
