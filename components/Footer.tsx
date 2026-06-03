import { Instagram, Linkedin, Youtube, Mail, Phone } from "lucide-react";
import { site, navLinks, services } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink-950">
      <div className="container-content py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold-500/40 bg-ink-800 font-serif text-lg text-gold-300">
                Q
              </span>
              <div className="leading-none">
                <div className="font-serif text-lg text-cream">{site.brand}</div>
                <div className="mt-0.5 text-[0.6rem] uppercase tracking-[0.28em] text-gold-300/80">
                  {site.tagline}
                </div>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/55">
              A boutique house for authors who want their book made beautifully —
              and sold seriously.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { Icon: Instagram, href: site.social.instagram, label: "Instagram" },
                { Icon: Linkedin, href: site.social.linkedin, label: "LinkedIn" },
                { Icon: Youtube, href: site.social.youtube, label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-cream/60 transition-all hover:border-gold-400/50 hover:text-gold-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <FooterCol title="Explore" links={navLinks.map((l) => ({ label: l.label, href: l.href }))} />

          {/* Services */}
          <FooterCol
            title="Services"
            links={services.map((s) => ({ label: s.title, href: "#services" }))}
          />

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-cream/45">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-cream/65">
              <li>
                <a href={`mailto:${site.contact.email}`} className="flex items-center gap-2 hover:text-gold-300">
                  <Mail className="h-4 w-4 text-gold-400" /> {site.contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 hover:text-gold-300">
                  <Phone className="h-4 w-4 text-gold-400" /> {site.contact.phone}
                </a>
              </li>
              <li className="text-cream/50">{site.contact.location}</li>
              <li className="text-cream/50">{site.contact.hours}</li>
            </ul>
            <a href="#contact" className="btn-gold mt-6">
              Get a Free Quote
            </a>
          </div>
        </div>

        <div className="rule-gold my-10" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-cream/40 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.brand}. All rights reserved. Your
            book, your royalties, always.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-cream/70">Privacy</a>
            <a href="#" className="hover:text-cream/70">Terms</a>
            <a href="#" className="hover:text-cream/70">Author Agreement</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="mb-4 text-xs uppercase tracking-[0.2em] text-cream/45">
        {title}
      </h4>
      <ul className="space-y-3 text-sm">
        {links.map((l, i) => (
          <li key={`${l.label}-${i}`}>
            <a href={l.href} className="text-cream/65 transition-colors hover:text-gold-300">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
