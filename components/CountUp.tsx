"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Animates a stat string like "480+", "4.9/5", "12M+" so the number "runs up"
 * like a meter the first time it scrolls into view. Any prefix/suffix
 * (+, /5, M+, $) is preserved and decimals are detected automatically.
 */
function parse(value: string) {
  const m = value.match(/^(\D*)([\d.,]+)(.*)$/);
  if (!m) return { prefix: "", target: 0, suffix: value, decimals: 0 };
  const [, prefix, numStr, suffix] = m;
  const clean = numStr.replace(/,/g, "");
  const decimals = clean.includes(".") ? clean.split(".")[1].length : 0;
  return { prefix, target: parseFloat(clean) || 0, suffix, decimals };
}

export default function CountUp({
  value,
  duration = 1.9,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const { prefix, target, suffix, decimals } = parse(value);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(target);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      setDisplay(target * easeOutCubic(p));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target, duration]);

  const formatted = display.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
