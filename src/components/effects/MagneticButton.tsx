"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { isFinePointer } from "@/lib/animation/pointer";
import { prefersReducedMotion } from "@/lib/animation/reducedMotion";

interface MagneticButtonProps {
  children: ReactNode;
  /** 0-1, how strongly the element follows the cursor. Default 0.18 — keep this subtle. */
  strength?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Wraps any child — a button, a Link, a component that doesn't forward
 * refs like JoinCommunityButton — in an inline-block span that pulls
 * gently toward the cursor. The wrapper measures itself, so it never needs
 * the child to expose a ref (earlier versions tried an `asChild`/Radix Slot
 * approach for this; dropped it once a real non-ref-forwarding button
 * surfaced, since a plain wrapper span is simpler and works unconditionally).
 *
 * Desktop, fine-pointer only (checked explicitly, not just inferred from the
 * absence of touch mousemove events) and no-ops entirely under
 * prefers-reduced-motion.
 */
export function MagneticButton({ children, strength = 0.18, className, style }: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 20, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.3 });

  function handleMouseMove(e: MouseEvent<HTMLSpanElement>) {
    if (!isFinePointer() || prefersReducedMotion() || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ ...style, display: "inline-block", x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.span>
  );
}
