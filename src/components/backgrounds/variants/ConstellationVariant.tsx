"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/animation/reducedMotion";
import type { ResponsiveTier } from "@/lib/animation/useResponsiveTier";

const INK = "#6B1F32";
const INK_DEEP = "#641C2C";

const NODES = [
  { x: 220, y: 180 },
  { x: 460, y: 320 },
  { x: 340, y: 520 },
  { x: 720, y: 240 },
  { x: 860, y: 460 },
  { x: 1020, y: 200 },
];

// Deterministic, not Math.random() — server and client must render the
// identical value or React flags a hydration mismatch. Hand-picked to feel
// organically desynced: period (seconds) and phase offset (radians) per node.
const PERIODS = [4.2, 5.1, 3.8, 5.6, 4.6, 5.9];
const PHASES = [0.4, 2.6, 1.1, 4.0, 0.8, 3.2];

/** Sparse — a handful of nodes, softly curved (not straight) connectors between a few nearby pairs only, never a dense mesh. */
const CONNECTIONS: [number, number][] = [
  [0, 1],
  [1, 3],
  [3, 5],
  [1, 2],
  [3, 4],
];

function curveBetween(a: { x: number; y: number }, b: { x: number; y: number }) {
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2 - 40;
  return `M ${a.x},${a.y} Q ${midX},${midY} ${b.x},${b.y}`;
}

/**
 * Plain `requestAnimationFrame` — deliberately NOT CSS `@keyframes` (an
 * earlier pass used CSS here, since a plain opacity breathe doesn't need an
 * animation engine and this component lives in the site-wide Footer). CSS
 * `@media (prefers-reduced-motion: reduce)` is a browser-native media query
 * evaluated straight from the OS setting — this project's own global
 * `*{animation:none!important}` rule (globals.css) can't be reasoned about
 * or overridden from JS at all, which made the CSS version untestable
 * during development. A rAF loop writes `opacity` directly (no CSS
 * animation involved at all), so it correctly follows the
 * same `prefersReducedMotion()` check every other piece of this system
 * uses, and still adds zero library weight (`requestAnimationFrame` is a
 * native browser API, not an import).
 */
export function ConstellationVariant({ tier }: { tier: ResponsiveTier }) {
  const nodes = tier === "mobile" ? NODES.slice(0, 4) : NODES;
  const connections = CONNECTIONS.filter(([a, b]) => a < nodes.length && b < nodes.length);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    let frameId: number;
    const start = performance.now();

    function tick(now: number) {
      const t = (now - start) / 1000;
      nodes.forEach((_, i) => {
        const el = nodeRefs.current[i];
        if (!el) return;
        const period = PERIODS[i % PERIODS.length]!;
        const phase = PHASES[i % PHASES.length]!;
        const wave = (Math.sin((t / period) * 2 * Math.PI + phase) + 1) / 2; // 0..1
        el.style.opacity = String(0.45 + wave * 0.5);
      });
      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [nodes]);

  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet" width="100%" height="100%" aria-hidden focusable="false">
      {connections.map(([a, b], i) => (
        <path
          key={i}
          d={curveBetween(nodes[a]!, nodes[b]!)}
          fill="none"
          stroke={INK_DEEP}
          strokeWidth={0.9}
          strokeOpacity={0.14}
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          cx={n.x}
          cy={n.y}
          r={3}
          fill={INK}
          opacity={0.7}
        />
      ))}
    </svg>
  );
}
