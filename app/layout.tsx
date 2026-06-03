import type { Metadata } from "next";
import { Fraunces, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import EntranceShell from "@/components/EntranceShell";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Refined display serif used by the entrance loader (never Inter/system).
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.brand} — ${site.tagline}`,
  description: site.description,
  openGraph: {
    title: `${site.brand} — ${site.tagline}`,
    description: site.description,
    type: "website",
  },
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='7' fill='%23080705'/><rect x='2.5' y='2.5' width='27' height='27' rx='5.5' fill='none' stroke='%23C9A24B' stroke-width='1'/><text x='16' y='22' font-family='Georgia,serif' font-size='18' fill='%23E0BC6B' text-anchor='middle'>Q</text></svg>`
          ),
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${cormorant.variable}`}
    >
      <body className="font-sans">
        {/* Site-wide ambient luxury layers: faint film grain + edge vignette */}
        <div className="pointer-events-none fixed inset-0 z-0 bg-noise opacity-[0.035]" />
        <div className="pointer-events-none fixed inset-0 z-0 vignette" />
        <EntranceShell>{children}</EntranceShell>
      </body>
    </html>
  );
}
