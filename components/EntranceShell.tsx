"use client";

import { useEffect, useState, type ReactNode } from "react";
import BookLoader from "./BookLoader";
import styles from "./BookLoader.module.css";

/**
 * Coordinates the entrance: plays the Gilded Doors loader on EVERY load/refresh,
 * then reveals the homepage once the doors are fully open.
 *
 * Always begins at the very top (first section) on (re)load — scroll
 * restoration is forced to "manual" so the browser never restores the prior
 * position or jumps to a hash. Renders children hidden on first paint (no
 * flash). Honors prefers-reduced-motion (skips the animation, shows the site).
 */

type Mode = "init" | "playing" | "entering" | "shown" | "done";

export default function EntranceShell({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("init");
  const [freeze, setFreeze] = useState<"closed" | "open" | null>(null);

  useEffect(() => {
    // Always begin at the very top on every (re)load: stop the browser from
    // restoring the previous scroll position or jumping to a hash, so the
    // entrance starts from the first section.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    // Debug: ?qcdebug=open|closed (any suffix ok, e.g. open-123 to bust cache)
    // freezes the loader for visual QA.
    const dbg = new URLSearchParams(window.location.search).get("qcdebug") ?? "";
    if (dbg.startsWith("open") || dbg.startsWith("closed")) {
      setFreeze(dbg.startsWith("open") ? "open" : "closed");
      document.body.classList.add("is-loading");
      setMode("playing");
      return;
    }

    // Accessibility always wins: reduced motion skips the animation entirely
    // (the site is shown immediately, still scrolled to the first section).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode("shown");
      return;
    }

    // Play the entrance on EVERY load / refresh — no once-per-session skipping.
    document.body.classList.add("is-loading");
    setMode("playing");
  }, []);

  // Unlock scroll once the loader leaves the screen, and make sure we land on
  // the first section.
  useEffect(() => {
    if (mode === "done" || mode === "shown") {
      document.body.classList.remove("is-loading");
      window.scrollTo(0, 0);
    }
  }, [mode]);

  const hidden = mode === "init" || mode === "playing";
  const siteClass = `${styles.siteWrap} ${
    hidden ? styles.siteHidden : styles.siteShown
  }`;

  return (
    <>
      {(mode === "playing" || mode === "entering") && (
        <BookLoader
          ready
          minDuration={2200}
          freeze={freeze}
          onHandoffStart={() => (freeze ? undefined : setMode("entering"))}
          onComplete={() => (freeze ? undefined : setMode("done"))}
        />
      )}
      <div className={siteClass}>{children}</div>
    </>
  );
}
