"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animation/gsap";
import { prefersReducedMotion } from "@/lib/animation/reducedMotion";
import { usePointerPosition } from "@/lib/animation/usePointerPosition";

const INK = "#6B1F32";
const MAX_POINTS = 10;
const MIN_SPACING = 7; // viewBox units — throttles how densely points are recorded along the movement

/**
 * "Flow Trail" — a short, softly-curved trail follows the pointer while it
 * moves, then holds its last shape and fades out over roughly half a
 * second once movement stops (rather than snapping away or continuing to
 * animate with nothing driving it).
 */
export function FlowTrailVariant() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pointerRef = usePointerPosition(containerRef, svgRef);
  const points = useRef<{ x: number; y: number }[]>([]);
  const opacity = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    function tick() {
      const pointer = pointerRef.current;
      const recentlyMoving = pointer.active && performance.now() - pointer.lastMove < 120;

      if (recentlyMoving) {
        const last = points.current[points.current.length - 1];
        if (!last || Math.hypot(pointer.x - last.x, pointer.y - last.y) > MIN_SPACING) {
          points.current.push({ x: pointer.x, y: pointer.y });
          if (points.current.length > MAX_POINTS) points.current.shift();
        }
      }

      const targetOpacity = recentlyMoving ? 0.22 : 0;
      opacity.current += (targetOpacity - opacity.current) * (recentlyMoving ? 0.2 : 0.06);

      const pts = points.current;
      if (pathRef.current) {
        pathRef.current.setAttribute("stroke-opacity", opacity.current.toFixed(3));
        if (pts.length >= 2 && opacity.current > 0.003) {
          let d = `M ${pts[0]!.x},${pts[0]!.y}`;
          for (let i = 1; i < pts.length - 1; i++) {
            const mid = { x: (pts[i]!.x + pts[i + 1]!.x) / 2, y: (pts[i]!.y + pts[i + 1]!.y) / 2 };
            d += ` Q ${pts[i]!.x},${pts[i]!.y} ${mid.x},${mid.y}`;
          }
          d += ` L ${pts[pts.length - 1]!.x},${pts[pts.length - 1]!.y}`;
          pathRef.current.setAttribute("d", d);
        }
      }
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
        <path ref={pathRef} d="" fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" strokeOpacity={0} />
      </svg>
    </div>
  );
}
