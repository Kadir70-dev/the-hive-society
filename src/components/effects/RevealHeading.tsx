"use client";

import { useRef, type ReactNode } from "react";
import { ensureGsapPlugins, gsap, SplitText, useGSAP } from "@/lib/animation/gsap";
import { prefersReducedMotion } from "@/lib/animation/reducedMotion";

interface RevealHeadingProps {
  children: ReactNode;
  /** Seconds. Default 0.9. */
  duration?: number;
  /** Default 0.1. */
  stagger?: number;
}

/**
 * Line-by-line reveal for a CMS-editable heading (`<EditableHeading>` etc.)
 * — those components own their own DOM (admin edit-mode swaps in a whole
 * different subtree) and don't forward refs, so they can't be replaced by
 * <RevealText>, which needs to own the element it splits. This wraps the
 * rendered output instead: a `display: contents` div (invisible to layout —
 * flex/grid treats the real child as if this wrapper weren't there) that
 * finds the first heading/paragraph/span inside it and runs the same
 * GSAP SplitText reveal against that element directly.
 *
 * Plays once immediately on mount (no ScrollTrigger) — for a hero headline
 * that's already in view at load, "reveal on scroll" and "reveal on load"
 * are the same moment; a plain `gsap.from` avoids any edge case around the
 * trigger's viewport check racing the initial paint.
 *
 * Under prefers-reduced-motion, or if the public/admin-editing swap means no
 * matching text element is found, this renders as a no-op passthrough.
 */
export function RevealHeading({ children, duration = 0.9, stagger = 0.1 }: RevealHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      const target = ref.current.querySelector<HTMLElement>("h1, h2, h3, h4, p, span");
      if (!target) return;

      ensureGsapPlugins();
      const split = new SplitText(target, { type: "lines", mask: "lines" });

      gsap.from(split.lines, {
        yPercent: 110,
        opacity: 0,
        duration,
        ease: "power3.out",
        stagger,
      });

      return () => split.revert();
    },
    { scope: ref, dependencies: [duration, stagger] },
  );

  return (
    <div ref={ref} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
