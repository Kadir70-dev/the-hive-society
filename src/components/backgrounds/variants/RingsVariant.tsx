"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animation/gsap";
import { prefersReducedMotion } from "@/lib/animation/reducedMotion";
import type { ResponsiveTier } from "@/lib/animation/useResponsiveTier";

const INK = "#6B1F32";
const INK_DEEP = "#641C2C";

/**
 * Large partial arcs bleeding in from section corners, each drifting a few
 * degrees back and forth — a slow "breathing" rotation (yoyo), never a full
 * spin. Independent durations/delays per arc so they never fall into visual
 * sync with each other.
 */
export function RingsVariant({ tier }: { tier: ResponsiveTier }) {
  const topLeftRef = useRef<SVGGElement>(null);
  const bottomRightRef = useRef<SVGGElement>(null);
  const accentRef = useRef<SVGGElement>(null);
  const showAccent = tier === "desktop";

  useGSAP(() => {
    if (prefersReducedMotion()) return;

    if (topLeftRef.current) {
      gsap.to(topLeftRef.current, {
        rotation: "+=5",
        duration: 16,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "0px 520px",
      });
    }
    if (bottomRightRef.current) {
      gsap.to(bottomRightRef.current, {
        rotation: "-=4",
        duration: 20,
        delay: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "1200px 280px",
      });
    }
    if (accentRef.current) {
      gsap.to(accentRef.current, {
        rotation: "+=3",
        duration: 24,
        delay: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        transformOrigin: "950px -40px",
      });
    }
  }, []);

  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" aria-hidden focusable="false">
      <g ref={topLeftRef}>
        <path
          d="M -60,540 C 40,320 240,90 520,-40"
          fill="none"
          stroke={INK}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeOpacity={0.14}
        />
      </g>
      <g ref={bottomRightRef}>
        <path
          d="M 1260,260 C 1060,480 860,660 620,840"
          fill="none"
          stroke={INK_DEEP}
          strokeWidth={1.3}
          strokeLinecap="round"
          strokeOpacity={0.13}
        />
      </g>
      {showAccent && (
        <g ref={accentRef}>
          <path
            d="M 940,-40 C 1000,150 960,340 800,430"
            fill="none"
            stroke={INK}
            strokeWidth={1}
            strokeLinecap="round"
            strokeOpacity={0.1}
          />
        </g>
      )}
    </svg>
  );
}
