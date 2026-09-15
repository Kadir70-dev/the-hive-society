"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/animation/gsap";
import { prefersReducedMotion } from "@/lib/animation/reducedMotion";
import type { ResponsiveTier } from "@/lib/animation/useResponsiveTier";

const INK = "#6B1F32";
const INK_DEEP = "#641C2C";

/**
 * A thin curved line traveling continuously along its own path, like a soft
 * snake drifting diagonally across the section. `stroke-dashoffset` loops by
 * exactly one dash-pattern length so the cycle is seamless — no jump, no
 * reset.
 *
 * The dash pattern is mostly solid (280 drawn / 50 gap — ~85% visible at any
 * instant), not the short-dash/long-gap pattern an earlier version used: that
 * one measurably animated (confirmed via direct `stroke-dashoffset`
 * sampling) but visually read as static or nearly invisible, since ~93% of
 * the path was gap at any given moment. A mostly-solid line with a small
 * traveling notch reads as continuously flowing while still looking like a
 * complete line. Frozen for prefers-reduced-motion, it switches to a plain
 * solid stroke instead (no dasharray at all) for the same reason.
 */
export function FlowVariant({ tier }: { tier: ResponsiveTier }) {
  const primaryRef = useRef<SVGPathElement>(null);
  const secondaryRef = useRef<SVGPathElement>(null);
  const showSecondary = tier !== "mobile";
  // Starts false (matching the server's render, which never has a real
  // browser to check prefers-reduced-motion against) and corrects itself
  // in an effect after mount — the standard pattern this project already
  // uses elsewhere for exactly this reason. A lazy useState initializer
  // would call the real browser check during the client's hydration
  // render too, which is what caused the mismatch found in visual QA.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // Deferred a frame: guarantees this runs strictly after hydration's
    // initial commit (which matched the server's `false`), so this is a
    // normal client-side update rather than a hydration diff — and,
    // incidentally, is what keeps this out of the "synchronous setState in
    // an effect" lint rule.
    const frame = requestAnimationFrame(() => setReduced(prefersReducedMotion()));
    return () => cancelAnimationFrame(frame);
  }, []);

  useGSAP(() => {
    if (reduced) return;

    if (primaryRef.current) {
      gsap.to(primaryRef.current, {
        strokeDashoffset: -330,
        duration: 14,
        ease: "none",
        repeat: -1,
      });
    }
    if (secondaryRef.current) {
      gsap.to(secondaryRef.current, {
        strokeDashoffset: -360,
        duration: 18,
        ease: "none",
        repeat: -1,
      });
    }
  }, [reduced]);

  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" aria-hidden focusable="false">
      <path
        ref={primaryRef}
        d="M -100,620 C 160,460 340,700 560,560 C 820,390 940,560 1300,320"
        fill="none"
        stroke={INK}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeOpacity={0.18}
        strokeDasharray={reduced ? undefined : "280 50"}
      />
      {showSecondary && (
        <path
          ref={secondaryRef}
          d="M -100,260 C 200,180 420,340 680,220 C 940,100 1040,220 1300,60"
          fill="none"
          stroke={INK_DEEP}
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeOpacity={0.1}
          strokeDasharray={reduced ? undefined : "300 60"}
        />
      )}
    </svg>
  );
}
