"use client";

import { useEffect, useState, type ReactNode } from "react";
import BookLoader from "./BookLoader";
import styles from "./BookLoader.module.css";

/**
 * Coordinates the entrance: plays the book loader once per session, then hands
 * off into the homepage with one continuous "fall into the open book" motion —
 * the loader scales up + fades while the site scales 1.07 → 1 and fades in.
 *
 * Renders children hidden on the first paint (no flash), decides on the client
 * whether to play the loader, then reveals. Honors prefers-reduced-motion and
 * skips on repeat visits within the session.
 */

const SESSION_KEY = "qc:entered:v2";

type Mode = "init" | "playing" | "entering" | "shown" | "done";

export default function EntranceShell({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("init");
  const [freeze, setFreeze] = useState<"closed" | "open" | null>(null);

  useEffect(() => {
    // Debug: ?qcdebug=open|closed (any suffix ok, e.g. open-123 to bust cache)
    // freezes the loader for visual QA.
    const dbg = new URLSearchParams(window.location.search).get("qcdebug") ?? "";
    if (dbg.startsWith("open") || dbg.startsWith("closed")) {
      setFreeze(dbg.startsWith("open") ? "open" : "closed");
      document.body.classList.add("is-loading");
      setMode("playing");
      return;
    }

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Accessibility always wins: reduced motion skips the animation entirely.
    if (reduce) {
      setMode("shown");
      return;
    }

    // In production, play once per browser session. In development, always
    // play so the entrance can be iterated on with a simple refresh.
    const isProd = process.env.NODE_ENV === "production";
    const entered =
      isProd && window.sessionStorage.getItem(SESSION_KEY) === "1";
    if (entered) {
      setMode("shown");
      return;
    }
    if (isProd) {
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* private mode — fine */
      }
    }
    document.body.classList.add("is-loading");
    setMode("playing");
  }, []);

  // Keep scroll locked only while the loader is on screen.
  useEffect(() => {
    if (mode === "done" || mode === "shown") {
      document.body.classList.remove("is-loading");
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
