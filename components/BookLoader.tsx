"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./BookLoader.module.css";

/**
 * Luxury entrance loader — "Gilded Doors".
 *
 * Sequence (~3.5s): a gold monogram crest draws itself stroke-by-stroke across
 * the gilt spine seam where two black-leather covers meet; then the covers swing
 * open on their outer edges like grand book covers. Only once the doors are
 * FULLY open does the homepage come into existence — it never animates during
 * the open.
 *
 * Integration (unchanged contract):
 *   - `ready`         : flip true when the real site has loaded; the doors hold
 *                       shut (crest showing) until this is true.
 *   - `minDuration`   : minimum ms on screen before the site is revealed, so it
 *                       never just flashes.
 *   - `onHandoffStart`: fires the moment the doors are fully open and the site
 *                       should come into existence (EntranceShell reveals it).
 *   - `onComplete`    : fires once the loader has fully faded out.
 *
 * All animation is transform/opacity only (GPU-friendly, 60fps).
 */

type Props = {
  ready?: boolean;
  minDuration?: number;
  onHandoffStart?: () => void;
  onComplete?: () => void;
  /** Debug only: freeze a static end-state for visual QA (skips the timeline). */
  freeze?: "closed" | "open" | null;
};

const OPEN_AT = 1400; // begin the door swing once the crest has drawn
const OPEN_TO_EXIT = 1250; // door swing (1.1s) + a short beat fully-open
const EXIT_DURATION = 1000; // loader fade-out while the site arrives

export default function BookLoader({
  ready = true,
  minDuration = 2200,
  onHandoffStart,
  onComplete,
  freeze = null,
}: Props) {
  const [phase, setPhase] = useState<"closed" | "open" | "exit" | "done">(
    freeze === "open" ? "open" : "closed"
  );

  const startRef = useRef<number>(0);
  const readyRef = useRef(ready);
  const waitingRef = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cbRef = useRef({ onHandoffStart, onComplete });

  useEffect(() => {
    cbRef.current = { onHandoffStart, onComplete };
  }, [onHandoffStart, onComplete]);
  useEffect(() => {
    readyRef.current = ready;
  }, [ready]);

  const after = useCallback((ms: number, fn: () => void) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  // Swings the doors open, then — only after they are fully open and the
  // minimum display time has elapsed — hands off to the homepage and fades out.
  const open = useCallback(() => {
    setPhase("open");
    after(OPEN_TO_EXIT, () => {
      const elapsed =
        typeof performance !== "undefined"
          ? performance.now() - startRef.current
          : minDuration;
      const wait = Math.max(0, minDuration - elapsed);
      after(wait, () => {
        setPhase("exit");
        cbRef.current.onHandoffStart?.(); // site comes into existence now
        after(EXIT_DURATION, () => {
          setPhase("done");
          cbRef.current.onComplete?.();
        });
      });
    });
  }, [after, minDuration]);

  // Master timeline.
  useEffect(() => {
    if (freeze) return; // debug: hold a static state, no animation
    startRef.current =
      typeof performance !== "undefined" ? performance.now() : 0;
    after(OPEN_AT, () => {
      if (readyRef.current) open();
      else waitingRef.current = true; // hold the doors shut until `ready`
    });
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resume the open the moment the app becomes ready (if we were holding).
  useEffect(() => {
    if (ready && waitingRef.current) {
      waitingRef.current = false;
      open();
    }
  }, [ready, open]);

  if (phase === "done") return null;

  const rootClass = [
    styles.root,
    phase === "open" || phase === "exit" ? styles.open : "",
    phase === "exit" ? styles.exit : "",
    freeze ? styles.drawn : "",
    freeze ? styles.frozen : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass} role="dialog" aria-label="Entering Quill & Crown">
      {/* Foil gradients for the monogram (left- & right-lit halves). */}
      <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="qcFoilL" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6b5310" />
            <stop offset="28%" stopColor="#c9a24b" />
            <stop offset="50%" stopColor="#f7ecc0" />
            <stop offset="72%" stopColor="#c9a24b" />
            <stop offset="100%" stopColor="#6b5310" />
          </linearGradient>
          <linearGradient id="qcFoilR" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6b5310" />
            <stop offset="28%" stopColor="#c9a24b" />
            <stop offset="50%" stopColor="#f7ecc0" />
            <stop offset="72%" stopColor="#c9a24b" />
            <stop offset="100%" stopColor="#6b5310" />
          </linearGradient>
        </defs>
      </svg>

      {/* LEFT cover */}
      <div className={`${styles.door} ${styles.leftDoor}`}>
        <div className={styles.leather} aria-hidden />
        <div className={styles.frame} aria-hidden>
          <span className={styles.corner} style={{ top: -5, left: -5 }} />
          <span className={styles.corner} style={{ bottom: -5, left: -5 }} />
        </div>
        <div className={styles.edgeSheen} aria-hidden />
        <div className={styles.seam} aria-hidden />
        <div className={styles.crestWrap} aria-hidden>
          <svg className={styles.crestSvg} viewBox="0 0 200 200">
            <CrestPaths />
          </svg>
          <span className={styles.letters}>
            Q<small>&amp;</small>C
          </span>
        </div>
      </div>

      {/* RIGHT cover */}
      <div className={`${styles.door} ${styles.rightDoor}`}>
        <div className={styles.leather} aria-hidden />
        <div className={styles.frame} aria-hidden>
          <span className={styles.corner} style={{ top: -5, right: -5 }} />
          <span className={styles.corner} style={{ bottom: -5, right: -5 }} />
        </div>
        <div className={styles.edgeSheen} aria-hidden />
        <div className={styles.seam} aria-hidden />
        <div className={styles.crestWrap} aria-hidden>
          <svg className={styles.crestSvg} viewBox="0 0 200 200">
            <CrestPaths />
          </svg>
          <span className={styles.letters}>
            Q<small>&amp;</small>C
          </span>
        </div>
      </div>

      <div className={styles.grain} aria-hidden />
    </div>
  );
}

/** Ornamental gold crest whose strokes draw themselves on (CSS dashoffset). */
function CrestPaths() {
  return (
    <>
      <circle className="c1" cx="100" cy="100" r="86" pathLength={1} />
      <circle className="c2" cx="100" cy="100" r="72" pathLength={1} />
      <path
        className="c3"
        d="M66 64 L76 40 L88 58 L100 34 L112 58 L124 40 L134 64"
        pathLength={1}
      />
      <path className="c4" d="M66 64 H134" pathLength={1} />
      <path className="c5" d="M64 150 C 42 136 42 108 64 92" pathLength={1} />
      <path className="c5" d="M136 150 C 158 136 158 108 136 92" pathLength={1} />
      <path className="c6" d="M78 158 Q100 172 122 158" pathLength={1} />
    </>
  );
}
