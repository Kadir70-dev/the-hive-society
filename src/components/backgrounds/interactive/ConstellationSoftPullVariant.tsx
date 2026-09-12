"use client";

import { useEffect, useRef } from "react";
import { ensureGsapPlugins, gsap, useGSAP } from "@/lib/animation/gsap";
import { prefersReducedMotion } from "@/lib/animation/reducedMotion";
import { usePointerPosition } from "@/lib/animation/usePointerPosition";
import { useResponsiveTier } from "@/lib/animation/useResponsiveTier";

const INK = "#6B1F32";
const INK_DEEP = "#641C2C";

const NODES = [
  { x: 220, y: 180 },
  { x: 460, y: 320 },
  { x: 340, y: 520 },
  { x: 720, y: 240 },
  { x: 860, y: 460 },
  { x: 1020, y: 200 },
] as const;

const CONNECTIONS: [number, number][] = [
  [0, 1],
  [1, 3],
  [3, 5],
  [1, 2],
  [3, 4],
];

// Deliberately the gentlest of the three interactive backgrounds — "very
// subtle" per design direction, and only the connectors react; the nodes
// themselves never move, only breathe (opacity), so it never reads as
// stars chasing the cursor. Still tuned up from the original pass (0.12/
// 170), which read as close to invisible; this stays noticeably softer
// than Soft Pull's own 0.42/260.
const RADIUS = 190;
const PULL = 0.18;
const EASE_IN = 0.07;
const EASE_OUT = 0.035;

function midpoint(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - 40 };
}

/**
 * "Constellation" with a very subtle Soft Pull on its connectors only.
 * Nodes keep their existing slow opacity breathe (same as the ambient
 * Constellation variant); connectors additionally lean a small amount
 * toward the pointer within a tight radius, easing back when it moves away.
 * Mobile gets the plain ambient behaviour only (no pointer tracking).
 */
export function ConstellationSoftPullVariant() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const connectionRefs = useRef<(SVGPathElement | null)[]>([]);
  const pointerRef = usePointerPosition(containerRef, svgRef);
  const offsets = useRef(CONNECTIONS.map(() => ({ x: 0, y: 0 })));
  const tier = useResponsiveTier();
  const nodes = tier === "mobile" ? NODES.slice(0, 4) : NODES;
  const connections = CONNECTIONS.filter(([a, b]) => a < nodes.length && b < nodes.length);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    ensureGsapPlugins();

    nodes.forEach((_, i) => {
      const el = nodeRefs.current[i];
      if (!el) return;
      gsap.to(el, {
        opacity: gsap.utils.random(0.45, 0.95),
        duration: gsap.utils.random(3.5, 6),
        delay: gsap.utils.random(0, 2),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });
  }, [tier]);

  useEffect(() => {
    if (prefersReducedMotion() || tier === "mobile") return;

    function tick() {
      const pointer = pointerRef.current;

      connections.forEach(([a, b], i) => {
        const nodeA = nodes[a]!;
        const nodeB = nodes[b]!;
        const base = midpoint(nodeA, nodeB);
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

        const el = connectionRefs.current[i];
        if (el) {
          const mid = { x: base.x + off.x, y: base.y + off.y };
          el.setAttribute("d", `M ${nodeA.x},${nodeA.y} Q ${mid.x},${mid.y} ${nodeB.x},${nodeB.y}`);
        }
      });
    }

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [pointerRef, tier, connections, nodes]);

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
        {connections.map(([a, b], i) => {
          const mid = midpoint(nodes[a]!, nodes[b]!);
          return (
            <path
              key={i}
              ref={(el) => {
                connectionRefs.current[i] = el;
              }}
              d={`M ${nodes[a]!.x},${nodes[a]!.y} Q ${mid.x},${mid.y} ${nodes[b]!.x},${nodes[b]!.y}`}
              fill="none"
              stroke={INK_DEEP}
              strokeWidth={1}
              strokeOpacity={0.16}
            />
          );
        })}
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
    </div>
  );
}
