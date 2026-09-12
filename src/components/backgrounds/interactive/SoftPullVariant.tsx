"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animation/gsap";
import { prefersReducedMotion } from "@/lib/animation/reducedMotion";
import { usePointerPosition } from "@/lib/animation/usePointerPosition";
import { useResponsiveTier } from "@/lib/animation/useResponsiveTier";

const INK = "#6B1F32";

/** The path's 7 authored anchor/control points (M + 2×C), in viewBox units. */
const BASE_POINTS = [
  { x: -50, y: 600 },
  { x: 220, y: 460 },
  { x: 380, y: 680 },
  { x: 600, y: 540 },
  { x: 820, y: 400 },
  { x: 960, y: 560 },
  { x: 1250, y: 320 },
] as const;

const RADIUS = 260; // influence radius, viewBox units — closer = stronger, beyond this = no effect
const PULL = 0.42; // fraction of the way toward the pointer a fully-influenced point leans
// Asymmetric easing is the actual "silk" feel: following the pointer reads
// as connected/responsive (faster), while releasing reads as a soft settle
// (slower) — using the same rate for both (as an earlier pass did) made the
// whole thing feel either too sluggish to notice or too snappy throughout.
const EASE_IN = 0.09; // per-tick lerp while influenced — the "clearly noticeable" half
const EASE_OUT = 0.035; // per-tick lerp while relaxing — the "premium, unhurried" half

/**
 * "Soft Pull" — nearby control points on a single flowing line lean gently
 * toward the pointer (linear distance falloff, clamped to a radius so only
 * the local area reacts) and ease back to their resting shape when the
 * pointer moves away or stops. No React re-renders on move: the path's `d`
 * attribute is written directly each tick, and the tick loop itself is
 * skipped entirely once every point has settled back within a fraction of
 * a unit of its base position, so an idle line costs nothing.
 *
 * The reactive layer is mobile-disabled on purpose: on touch, `pointermove`
 * fires continuously *during a scroll gesture*, not just during a
 * deliberate hover the way it does with a mouse — reacting to that would
 * mean the line visibly bends every time someone scrolls past it, which is
 * both a distraction and unnecessary per-frame work on the device class
 * least able to spare it. Mobile always gets the calm static base line.
 */
export function SoftPullVariant() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pointerRef = usePointerPosition(containerRef, svgRef);
  const offsets = useRef(BASE_POINTS.map(() => ({ x: 0, y: 0 })));
  const tier = useResponsiveTier();

  useEffect(() => {
    if (prefersReducedMotion() || tier === "mobile") return;

    function tick() {
      const pointer = pointerRef.current;
      let maxDelta = 0;

      const resolved = BASE_POINTS.map((base, i) => {
        const off = offsets.current[i]!;
        let targetX = 0;
        let targetY = 0;
        let influenced = false;

        if (pointer.active) {
          const dx = pointer.x - base.x;
          const dy = pointer.y - base.y;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS) {
            const falloff = 1 - dist / RADIUS;
            targetX = dx * falloff * PULL;
            targetY = dy * falloff * PULL;
            influenced = true;
          }
        }

        const ease = influenced ? EASE_IN : EASE_OUT;
        off.x += (targetX - off.x) * ease;
        off.y += (targetY - off.y) * ease;
        maxDelta = Math.max(maxDelta, Math.abs(off.x), Math.abs(off.y));

        return { x: base.x + off.x, y: base.y + off.y };
      });

      if (maxDelta > 0.02 && pathRef.current) {
        const [p0, p1, p2, p3, p4, p5, p6] = resolved;
        pathRef.current.setAttribute(
          "d",
          `M ${p0!.x},${p0!.y} C ${p1!.x},${p1!.y} ${p2!.x},${p2!.y} ${p3!.x},${p3!.y} C ${p4!.x},${p4!.y} ${p5!.x},${p5!.y} ${p6!.x},${p6!.y}`,
        );
      }
    }

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [pointerRef, tier]);

  const basePath = `M ${BASE_POINTS[0].x},${BASE_POINTS[0].y} C ${BASE_POINTS[1].x},${BASE_POINTS[1].y} ${BASE_POINTS[2].x},${BASE_POINTS[2].y} ${BASE_POINTS[3].x},${BASE_POINTS[3].y} C ${BASE_POINTS[4].x},${BASE_POINTS[4].y} ${BASE_POINTS[5].x},${BASE_POINTS[5].y} ${BASE_POINTS[6].x},${BASE_POINTS[6].y}`;

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <svg
        ref={svgRef}
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
        aria-hidden
        focusable="false"
      >
        <path ref={pathRef} d={basePath} fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" strokeOpacity={0.22} />
      </svg>
    </div>
  );
}
