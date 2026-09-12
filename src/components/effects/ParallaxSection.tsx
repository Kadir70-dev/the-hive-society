"use client";

import { useRef, type ReactNode } from "react";
import { ensureGsapPlugins, gsap, useGSAP } from "@/lib/animation/gsap";
import { prefersReducedMotion } from "@/lib/animation/reducedMotion";
import { isDesktopViewport } from "@/lib/animation/viewport";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  /** Fraction of scroll distance to translate by. Positive recedes, negative advances. Default 0.2. */
  speed?: number;
}

/**
 * Scrub-linked parallax translate (transform-only — `yPercent`, GPU
 * compositable, never triggers layout), tied to GSAP ScrollTrigger.
 * No-ops under prefers-reduced-motion AND below the 768px tablet
 * cutoff — parallax scrub tends to fight touch-scroll momentum, so it's
 * desktop/tablet-only by design, not just an accessibility fallback.
 */
export function ParallaxSection({ children, className, speed = 0.2 }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !isDesktopViewport() || !ref.current) return;
      ensureGsapPlugins();

      gsap.to(ref.current, {
        yPercent: speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: ref, dependencies: [speed] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
