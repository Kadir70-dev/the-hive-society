"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animation/gsap";
import { prefersReducedMotion } from "@/lib/animation/reducedMotion";
import { usePointerPosition } from "@/lib/animation/usePointerPosition";

const INK_DEEP = "#641C2C";

const BASE_POINTS = [
  { x: -50, y: 400 },
  { x: 140, y: 400 },
  { x: 330, y: 400 },
  { x: 520, y: 400 },
  { x: 710, y: 400 },
  { x: 900, y: 400 },
  { x: 1090, y: 400 },
  { x: 1250, y: 400 },
] as const;

const RADIUS = 260;
const PULL = 0.22;
const EASE = 0.05;
const AMBIENT_AMPLITUDE = 9; // viewBox units — the ribbon's own slow idle drift, always present
const AMBIENT_PERIOD = 11; // seconds per idle undulation cycle

function ambientY(base: { y: number }, i: number, t: number) {
  return base.y + Math.sin(t * ((2 * Math.PI) / AMBIENT_PERIOD) + i * 0.85) * AMBIENT_AMPLITUDE;
}

/** Smooth quadratic spline through a point list (Q through each midpoint, T-terminated to land exactly on the last point). */
function buildSmoothPath(points: { x: number; y: number }[]) {
  let d = `M ${points[0]!.x},${points[0]!.y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const curr = points[i]!;
    const next = points[i + 1]!;
    const midX = (curr.x + next.x) / 2;
    const midY = (curr.y + next.y) / 2;
    d += ` Q ${curr.x},${curr.y} ${midX},${midY}`;
  }
  d += ` T ${points[points.length - 1]!.x},${points[points.length - 1]!.y}`;
  return d;
}

/** The resting shape at t=0, no pointer influence — this is what renders under prefers-reduced-motion. */
const STATIC_PATH = buildSmoothPath(BASE_POINTS.map((base, i) => ({ x: base.x, y: ambientY(base, i, 0) })));

/**
 * "Silk Wave" — a long flowing ribbon with a gentle, always-present idle
 * undulation (so it never looks frozen even with no pointer nearby), plus a
 * local bump that follows the pointer as it passes over — like a finger
 * moving through a length of silk. Same pull/relax mechanic as Soft Pull,
 * layered on top of the ambient motion rather than replacing it. Renders
 * `STATIC_PATH` — a real, complete curve, not an empty string — as its
 * default `d`, so it's still a finished piece of art if the animation
 * effect below never runs (prefers-reduced-motion).
 */
export function SilkWaveVariant() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pointerRef = usePointerPosition(containerRef, svgRef);
  const offsets = useRef(BASE_POINTS.map(() => ({ x: 0, y: 0 })));
  const start = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    start.current = performance.now();

    function tick() {
      const pointer = pointerRef.current;
      const t = (performance.now() - start.current) / 1000;

      const resolved = BASE_POINTS.map((base, i) => {
        const off = offsets.current[i]!;
        const y = ambientY(base, i, t);

        let targetX = 0;
        let targetY = 0;
        if (pointer.active) {
          const dx = pointer.x - base.x;
          const dy = pointer.y - y;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS) {
            const falloff = 1 - dist / RADIUS;
            targetX = dx * falloff * PULL;
            targetY = dy * falloff * PULL;
          }
        }

        off.x += (targetX - off.x) * EASE;
        off.y += (targetY - off.y) * EASE;

        return { x: base.x + off.x, y: y + off.y };
      });

      pathRef.current?.setAttribute("d", buildSmoothPath(resolved));
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
        <path
          ref={pathRef}
          d={STATIC_PATH}
          fill="none"
          stroke={INK_DEEP}
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeOpacity={0.18}
        />
      </svg>
    </div>
  );
}
