"use client";

import { useEffect, useRef, type RefObject } from "react";

export interface PointerPositionRef {
  /** SVG viewBox-space coordinates, not viewport pixels. */
  x: number;
  y: number;
  active: boolean;
  lastMove: number;
}

/**
 * Tracks pointer/touch position mapped into `svgRef`'s own viewBox
 * coordinate space, active only while the pointer is within
 * `containerRef`'s bounds.
 *
 * Listens on `window`, not the container or the SVG — a sibling content
 * overlay (any real heading/button placed over a background, at a higher
 * z-index) would otherwise become the event's hit-test target and the
 * event would never bubble to a sibling container's own listener.
 * `window` is always an ancestor of everything, so this fires regardless of
 * what's on top, and "is the pointer over this section" is decided
 * separately by comparing coordinates against `getBoundingClientRect()` —
 * so it works correctly under real clickable content, not just this
 * preview's plain text.
 *
 * One `pointermove` listener covers mouse AND touch. It's `{ passive: true }`
 * and never calls `preventDefault`, so it can never block scrolling or
 * clicks — real content stays fully interactive regardless of what's
 * layered beneath it.
 *
 * Returns a mutable ref, not React state — consumers read it inside their
 * own `gsap.ticker`/rAF callback, so pointer movement never triggers a
 * React re-render.
 */
export function usePointerPosition(
  containerRef: RefObject<HTMLElement | null>,
  svgRef: RefObject<SVGSVGElement | null>,
) {
  const pointerRef = useRef<PointerPositionRef>({ x: -9999, y: -9999, active: false, lastMove: 0 });

  useEffect(() => {
    function handleMove(e: PointerEvent) {
      const container = containerRef.current;
      const svg = svgRef.current;
      if (!container || !svg) return;

      const bounds = container.getBoundingClientRect();
      const inside =
        e.clientX >= bounds.left && e.clientX <= bounds.right && e.clientY >= bounds.top && e.clientY <= bounds.bottom;

      const p = pointerRef.current;
      if (!inside) {
        p.active = false;
        return;
      }

      const rect = svg.getBoundingClientRect();
      const vb = svg.viewBox.baseVal;
      p.x = ((e.clientX - rect.left) / rect.width) * vb.width + vb.x;
      p.y = ((e.clientY - rect.top) / rect.height) * vb.height + vb.y;
      p.active = true;
      p.lastMove = performance.now();
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [containerRef, svgRef]);

  return pointerRef;
}
