"use client";

import { useState } from "react";

interface MarqueeProps {
  words: string[];
  label: string;
}

/** Slow text marquee. Pausable by button, hover or focus; static under prefers-reduced-motion (CSS). */
export function Marquee({ words, label }: MarqueeProps) {
  const [paused, setPaused] = useState(false);

  return (
    <div className={`hj-marquee${paused ? " is-paused" : ""}`} role="region" aria-label={label}>
      <div className="hj-marquee__track">
        {[0, 1].map((copy) => (
          <ul className="hj-marquee__set" key={copy} aria-hidden={copy === 1 ? "true" : undefined}>
            {words.map((w) => (
              <li key={`${copy}-${w}`}>{w}</li>
            ))}
          </ul>
        ))}
      </div>
      <button
        type="button"
        className="hj-marquee__toggle"
        aria-pressed={paused}
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? "Play motion" : "Pause motion"}
      </button>
    </div>
  );
}
