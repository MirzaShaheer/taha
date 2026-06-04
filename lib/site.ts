/**
 * SITE CONTENT CONFIG
 * ----------------------------------------------------------------------------
 * One place to edit nearly all copy & data on the marketing page.
 * Rename the brand, swap stats, edit services/process/testimonials/faqs here
 * and the whole site updates. No component edits needed.
 */

export const site = {
  brand: "Quill & Crown",
  tagline: "Boutique Book Publishing",
  // Used in <title>, meta, footer, and the AI concierge's persona.
  description:
    "Quill & Crown is a boutique ghostwriting, editing, and publishing house that turns your idea into a beautifully made, bestseller-ready book.",
  contact: {
    email: "hello@quillandcrown.com",
    phone: "+1 (415) 555-0188",
    location: "New York · Austin · Remote across the US",
    hours: "Mon–Fri, 9am–7pm ET",
  },
  social: {
    instagram: "#",
    linkedin: "#",
    x: "#",
    youtube: "#",
  },
} as const;

export type NavLink = { label: string; href: string };
export const navLinks: NavLink[] = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

/* ----------------------------- Trust bar -------------------------------- */
export const stats: { value: string; label: string }[] = [
  { value: "480+", label: "Books published" },
  { value: "4.9/5", label: "Average client rating" },
  { value: "37", label: "Bestseller list placements" },
  { value: "12M+", label: "Copies & downloads sold" },
];

/* ------------------------------ Services -------------------------------- */
export type Service = {
  id: string;
  title: string;
  blurb: string;
  bullets: string[];
  icon: string; // lucide icon name
};

export const services: Service[] = [
  {
    id: "ghostwriting",
    title: "Ghostwriting",
    blurb:
      "Award-winning writers turn your voice, story, or expertise into a manuscript that reads like you on your best day.",
    bullets: [
      "Full NDA before we begin",
      "Discovery interviews",
      "Chapter-by-chapter drafts",
      "Your voice, elevated",
    ],
    icon: "PenLine",
  },
  {
    id: "editing",
    title: "Editing",
    blurb:
      "Developmental, line, and copy editing that sharpens structure, pacing, and prose without flattening your style.",
    bullets: ["Developmental edit", "Line & copy edit", "Proofreading pass"],
    icon: "SpellCheck",
  },
  {
    id: "formatting",
    title: "Interior Formatting",
    blurb:
      "Print- and ebook-ready typesetting that looks at home next to any traditionally published title.",
    bullets: ["Print + EPUB/MOBI", "Custom typography", "Retailer-ready files"],
    icon: "AlignLeft",
  },
  {
    id: "cover-design",
    title: "Cover Design",
    blurb:
      "Original, genre-aware cover art designed to earn the click and stop the scroll on Amazon and the shelf.",
    bullets: ["3 original concepts", "Print + 3D mockups", "Unlimited revisions*"],
    icon: "Palette",
  },
  {
    id: "publishing",
    title: "Publishing & Distribution",
    blurb:
      "We handle KDP, IngramSpark, and wide distribution so your book is live and buyable everywhere that matters.",
    bullets: ["Amazon + wide", "Metadata & keywords", "Launch-day setup"],
    icon: "Rocket",
  },
  {
    id: "marketing",
    title: "Marketing & Launch",
    blurb:
      "Pre-orders, reviews, ads, and PR strategy engineered to put your book in front of readers who buy.",
    bullets: ["Launch strategy", "Amazon ads", "Reviews & PR"],
    icon: "Megaphone",
  },
  {
    id: "author-website",
    title: "Author Website",
    blurb:
      "A polished author site that turns curious readers into your audience — your own home for books, story, and sign-ups.",
    bullets: ["Custom, on-brand design", "Mobile-fast & SEO-ready", "Email list + buy links"],
    icon: "Globe",
  },
];

/* ------------------------------ Process --------------------------------- */
export const processSteps: { step: string; title: string; body: string }[] = [
  {
    step: "01",
    title: "Discovery Call",
    body: "We learn your idea, goals, and voice — then map the fastest credible path from concept to finished book.",
  },
  {
    step: "02",
    title: "Write & Edit",
    body: "Your dedicated team drafts and refines in clear milestones, with you reviewing every chapter along the way.",
  },
  {
    step: "03",
    title: "Design & Format",
    body: "We craft a standout cover and bookstore-grade interior for both print and every major ereader.",
  },
  {
    step: "04",
    title: "Publish & Launch",
    body: "We list, distribute, and launch your title — and stay on to help you sell once it's live.",
  },
];

/* ---------------------------- Testimonials ------------------------------ */
export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  genre: string;
  rating: number;
  // Optional: paste a YouTube/Vimeo embed URL to show a video testimonial card.
  videoUrl?: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "I had a story in my head for fifteen years. Quill & Crown got it out of me and made it better than I imagined. It hit #1 in its category in week one.",
    name: "Dana Whitfield",
    role: "Memoir author",
    genre: "Memoir",
    rating: 5,
  },
  {
    quote:
      "As a founder, I had the expertise but zero time. Their ghostwriter nailed my voice. The book is now my best lead-generation asset.",
    name: "Marcus Lee",
    role: "SaaS founder",
    genre: "Business",
    rating: 5,
    videoUrl: "https://www.youtube.com/embed/ysz5S6PUM-U",
  },
  {
    quote:
      "The cover alone tripled my click-through on ads. The whole team treated my little fantasy novel like it was the next big franchise.",
    name: "Priya Nair",
    role: "Debut novelist",
    genre: "Fantasy",
    rating: 5,
  },
  {
    quote:
      "Professional, calm, and genuinely talented. They turned a messy 90,000-word draft into something I'm proud to put my name on.",
    name: "Robert Glassman",
    role: "Thriller author",
    genre: "Thriller",
    rating: 5,
  },
];

/* ------------------------------ Pricing --------------------------------- */
export type Package = {
  name: string;
  idealFor: string;
  priceHint: string;
  features: string[];
  featured?: boolean;
};

export const packages: Package[] = [
  {
    name: "Launch",
    idealFor: "Authors with a finished manuscript",
    priceHint: "Editing · Formatting · Cover",
    features: [
      "Professional editing pass",
      "Print + ebook formatting",
      "Custom cover design",
      "Amazon KDP setup",
    ],
  },
  {
    name: "Signature",
    idealFor: "Most clients — idea to finished book",
    priceHint: "Ghostwriting · Design · Publishing",
    features: [
      "Full ghostwriting or co-writing",
      "Developmental + line editing",
      "Premium cover & interior",
      "Wide distribution setup",
      "Launch strategy session",
    ],
    featured: true,
  },
  {
    name: "Bestseller",
    idealFor: "Authors going all-in on a launch",
    priceHint: "Everything · Marketing · PR",
    features: [
      "Everything in Signature",
      "90-day marketing campaign",
      "Amazon ads management",
      "Reviews & PR outreach",
      "Audiobook production",
    ],
  },
];

/* -------------------------------- FAQ ----------------------------------- */
export const faqs: { q: string; a: string }[] = [
  {
    q: "Do I keep all the rights and royalties to my book?",
    a: "Always. You own 100% of your rights, royalties, and creative control. We work for you behind the scenes — your name is the only one on the cover.",
  },
  {
    q: "Is my story kept confidential?",
    a: "Completely. Every client and project is covered by a full NDA, which we sign before any work begins. Your identity, your story, and the fact that we wrote it stay strictly between us — we never share, publish, or showcase your project without your written permission.",
  },
  {
    q: "How long does the whole process take?",
    a: "A typical book runs 3–6 months depending on length and service level. Editing-only projects can move in weeks; full ghostwritten books take longer. We give you a firm timeline after the discovery call.",
  },
  {
    q: "How much does it cost?",
    a: "Every book is scoped individually, so we quote per project rather than list fixed prices. After a short call we send a clear, all-in proposal with no surprise fees. Most clients land in one of our three package tiers.",
  },
  {
    q: "Will the writing actually sound like me?",
    a: "Yes — that's the craft. Through recorded interviews and your existing material, your ghostwriter captures your voice so closely that readers (and often you) can't tell it wasn't written by your own hand.",
  },
  {
    q: "Can you help if my book is already written?",
    a: "Absolutely. Many clients come to us with a finished draft and just need editing, a great cover, formatting, and a real publishing and launch plan.",
  },
  {
    q: "What genres do you work in?",
    a: "Memoir, business & self-help, literary and commercial fiction, fantasy, thriller, romance, children's, and more. If it's a book, we've likely made one like it.",
  },
];

/* ----------------------------- Portfolio -------------------------------- */
export type Genre =
  | "Business"
  | "Memoir"
  | "Fantasy"
  | "Thriller"
  | "Romance"
  | "Children";

export type Book = {
  title: string;
  author: string;
  genre: Genre;
  // Visual treatment for the generated cover (no stock art).
  palette: string; // gradient classes
  accent: string; // accent hex for spine/foil
  style: "serif" | "display" | "mono";
};

export const genres: (Genre | "All")[] = [
  "All",
  "Business",
  "Memoir",
  "Fantasy",
  "Thriller",
  "Romance",
  "Children",
];

export const books: Book[] = [
  {
    title: "The Quiet Compounding",
    author: "E. R. Vance",
    genre: "Business",
    palette: "from-[#0d2b2b] to-[#06403a]",
    accent: "#E7CF8E",
    style: "serif",
  },
  {
    title: "Salt & Other Inheritances",
    author: "Dana Whitfield",
    genre: "Memoir",
    palette: "from-[#3a1f2b] to-[#1c0f17]",
    accent: "#D8A7A0",
    style: "serif",
  },
  {
    title: "The Ninth Lantern",
    author: "Priya Nair",
    genre: "Fantasy",
    palette: "from-[#1b1145] to-[#0a0726]",
    accent: "#9C7BFF",
    style: "display",
  },
  {
    title: "Cold Harbor",
    author: "R. Glassman",
    genre: "Thriller",
    palette: "from-[#0a0f1a] to-[#11202e]",
    accent: "#5BD1E0",
    style: "mono",
  },
  {
    title: "Everything After You",
    author: "Mara Quinn",
    genre: "Romance",
    palette: "from-[#43162e] to-[#7a2348]",
    accent: "#FFC8DD",
    style: "serif",
  },
  {
    title: "Luma and the Paper Moon",
    author: "J. Okafor",
    genre: "Children",
    palette: "from-[#13405e] to-[#0c6b8a]",
    accent: "#FFE08A",
    style: "display",
  },
  {
    title: "The Founder's Map",
    author: "Marcus Lee",
    genre: "Business",
    palette: "from-[#102a3c] to-[#0a1726]",
    accent: "#E7CF8E",
    style: "mono",
  },
  {
    title: "What the Tide Took",
    author: "Helena Brooks",
    genre: "Thriller",
    palette: "from-[#16242e] to-[#0a1318]",
    accent: "#9ED0C6",
    style: "serif",
  },
  {
    title: "A Crown of Embers",
    author: "Priya Nair",
    genre: "Fantasy",
    palette: "from-[#3a1206] to-[#1a0703]",
    accent: "#FF9D5C",
    style: "display",
  },
];
