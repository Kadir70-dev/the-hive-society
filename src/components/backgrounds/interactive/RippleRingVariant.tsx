"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animation/gsap";
import { prefersReducedMotion } from "@/lib/animation/reducedMotion";
import { usePointerPosition } from "@/lib/animation/usePointerPosition";

const INK = "#6B1F32";
const POOL_SIZE = 5;
const SPAWN_INTERVAL = 320; // ms — throttles ripple spawning while moving, not one per pixel

/**
 * "Ripple Ring" — a small ring appears at the pointer and fades out over
 * about a second, throttled to roughly 3 per second while moving so it
 * reads as an elegant accent rather than a particle trail. A small fixed
 * pool of circles is reused (cycled through) rather than creating/removing
 * DOM nodes per ripple.
 */
export function RippleRingVariant() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pool = useRef<(SVGCircleElement | null)[]>([]);
  const pointerRef = usePointerPosition(containerRef, svgRef);
  const nextIndex = useRef(0);
  const lastSpawn = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    function tick() {
      const pointer = pointerRef.current;
      const recentlyMoving = pointer.active && performance.now() - pointer.lastMove < 80;
      if (!recentlyMoving) return;

      const now = performance.now();
      if (now - lastSpawn.current < SPAWN_INTERVAL) return;
      lastSpawn.current = now;

      const circle = pool.current[nextIndex.current];
      nextIndex.current = (nextIndex.current + 1) % POOL_SIZE;
      if (!circle) return;

      gsap.killTweensOf(circle);
      gsap.set(circle, { attr: { cx: pointer.x, cy: pointer.y, r: 3 }, opacity: 0.3 });
      gsap.to(circle, { attr: { r: 38 }, opacity: 0, duration: 1.1, ease: "power2.out" });
    }

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [pointerRef]);

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0 }}>
      <svg
        ref={svgRef}
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
        aria-hidden
        focusable="false"
      >
        {Array.from({ length: POOL_SIZE }).map((_, i) => (
          <circle
            key={i}
            ref={(el) => {
              pool.current[i] = el;
            }}
            cx={-100}
            cy={-100}
            r={0}
            fill="none"
            stroke={INK}
            strokeWidth={1.2}
            opacity={0}
          />
        ))}
      </svg>
    </div>
  );
}
