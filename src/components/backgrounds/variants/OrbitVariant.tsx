"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/animation/gsap";
import { prefersReducedMotion } from "@/lib/animation/reducedMotion";
import type { ResponsiveTier } from "@/lib/animation/useResponsiveTier";

const INK = "#6B1F32";
const INK_DEEP = "#641C2C";

/**
 * Two large, calm, STATIC rings (rotating a circle changes nothing visually,
 * so animating them would just burn a frame budget for no effect) with one
 * thin arc slowly revolving through/around them. transform-origin is set to
 * the rings' shared centre in SVG user-space units, matched to the `<g>`'s
 * own coordinate space.
 */
export function OrbitVariant({ tier }: { tier: ResponsiveTier }) {
  const groupRef = useRef<SVGGElement>(null);
  const showInnerRing = tier !== "mobile";

  useGSAP(() => {
    if (prefersReducedMotion() || !groupRef.current) return;

    gsap.to(groupRef.current, {
      rotation: 360,
      duration: 34,
      ease: "none",
      repeat: -1,
      transformOrigin: "600px 400px",
    });
  }, []);

  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" aria-hidden focusable="false">
      <circle cx={600} cy={400} r={260} fill="none" stroke={INK} strokeWidth={1.4} strokeOpacity={0.12} />
      {showInnerRing && (
        <circle cx={660} cy={350} r={165} fill="none" stroke={INK_DEEP} strokeWidth={1.1} strokeOpacity={0.14} />
      )}
      <g ref={groupRef}>
        <path
          d="M 340,400 C 420,220 780,220 860,400 C 780,540 500,560 420,470"
          fill="none"
          stroke={INK}
          strokeWidth={1.3}
          strokeLinecap="round"
          strokeOpacity={0.16}
        />
      </g>
    </svg>
  );
}
