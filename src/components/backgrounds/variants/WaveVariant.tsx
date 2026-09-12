"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animation/gsap";
import { prefersReducedMotion } from "@/lib/animation/reducedMotion";
import type { ResponsiveTier } from "@/lib/animation/useResponsiveTier";

const INK = "#6B1F32";
const INK_DEEP = "#641C2C";

interface Ribbon {
  base: string;
  flexed: string;
  color: string;
  opacity: number;
  width: number;
  duration: number;
  delay: number;
}

/**
 * Several ribbon-like curves, each with its own duration/delay so they
 * drift out of phase with one another — that desync is what keeps this
 * reading as flowing fabric rather than a synchronized audio waveform.
 * Each pair of `base`/`flexed` path strings has the SAME command structure
 * (only Y coordinates differ), which is what lets GSAP tween the `d`
 * attribute as a plain number interpolation — no MorphSVG plugin needed.
 */
const RIBBONS: Ribbon[] = [
  {
    base: "M -50,220 C 220,180 380,260 600,220 C 820,180 980,260 1250,220",
    flexed: "M -50,240 C 220,150 380,290 600,200 C 820,150 980,290 1250,200",
    color: INK,
    opacity: 0.16,
    width: 1.4,
    duration: 13,
    delay: 0,
  },
  {
    base: "M -50,340 C 240,310 360,370 620,340 C 860,310 1000,370 1250,340",
    flexed: "M -50,320 C 240,380 360,300 620,370 C 860,380 1000,300 1250,370",
    color: INK_DEEP,
    opacity: 0.12,
    width: 1.2,
    duration: 16,
    delay: 1.5,
  },
  {
    base: "M -50,460 C 200,430 420,490 660,460 C 880,430 1040,490 1250,460",
    flexed: "M -50,480 C 200,410 420,510 660,430 C 880,410 1040,510 1250,430",
    color: INK,
    opacity: 0.1,
    width: 1,
    duration: 19,
    delay: 3,
  },
];

export function WaveVariant({ tier }: { tier: ResponsiveTier }) {
  const refs = useRef<(SVGPathElement | null)[]>([]);
  const visibleRibbons = tier === "mobile" ? RIBBONS.slice(0, 2) : RIBBONS;

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    visibleRibbons.forEach((ribbon, i) => {
      const el = refs.current[i];
      if (!el) return;
      gsap.to(el, {
        attr: { d: ribbon.flexed },
        duration: ribbon.duration,
        delay: ribbon.delay,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });
  }, [tier]);

  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" aria-hidden focusable="false">
      {visibleRibbons.map((ribbon, i) => (
        <path
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          d={ribbon.base}
          fill="none"
          stroke={ribbon.color}
          strokeWidth={ribbon.width}
          strokeLinecap="round"
          strokeOpacity={ribbon.opacity}
        />
      ))}
    </svg>
  );
}
