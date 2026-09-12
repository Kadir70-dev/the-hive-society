"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animation/gsap";
import { prefersReducedMotion } from "@/lib/animation/reducedMotion";
import { usePointerPosition } from "@/lib/animation/usePointerPosition";
import { useResponsiveTier } from "@/lib/animation/useResponsiveTier";

const INK = "#6B1F32";
const INK_DEEP = "#641C2C";
const CENTER = { x: 600, y: 400 };
const RADIUS = 340; // proximity radius around the rings' centre that speeds the orbit up
const BASE_SPEED = 360 / 34; // degrees/sec ambient/idle pace — unchanged, stays slow and premium
const MAX_MULTIPLIER = 3.2; // how much faster the arc spins at the pointer's closest approach
// Asymmetric, same reasoning as Soft Pull: speeding up should read as an
// immediate reaction, slowing back down should read as an unhurried settle.
const RAMP_UP = 0.08;
const RAMP_DOWN = 0.03;

/**
 * "Orbit Nudge" — the same two calm static rings as the ambient Orbit
 * variant, but the orbiting arc speeds up smoothly (never snaps) the closer
 * the pointer gets to the rings' centre, and eases back to its slow base
 * pace once the pointer moves away. The rings themselves never move —
 * only the arc's rotation speed responds. Speed changes are smoothed with
 * a plain per-tick lerp (cheap, one multiply-add) rather than spinning up
 * a new tween every frame.
 */
export function OrbitNudgeVariant() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const pointerRef = usePointerPosition(containerRef, svgRef);
  const state = useRef({ rotation: 0, multiplier: 1 });
  const tier = useResponsiveTier();

  useEffect(() => {
    if (prefersReducedMotion() || tier === "mobile") return;

    let lastTime = performance.now();

    function tick() {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const pointer = pointerRef.current;
      let targetMultiplier = 1;
      if (pointer.active) {
        const dist = Math.hypot(pointer.x - CENTER.x, pointer.y - CENTER.y);
        if (dist < RADIUS) {
          targetMultiplier = 1 + (1 - dist / RADIUS) * (MAX_MULTIPLIER - 1);
        }
      }

      const ramp = targetMultiplier > state.current.multiplier ? RAMP_UP : RAMP_DOWN;
      state.current.multiplier += (targetMultiplier - state.current.multiplier) * ramp;
      state.current.rotation += BASE_SPEED * state.current.multiplier * dt;

      if (groupRef.current) {
        groupRef.current.setAttribute("transform", `rotate(${state.current.rotation} ${CENTER.x} ${CENTER.y})`);
      }
    }

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [pointerRef, tier]);

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
        <circle cx={CENTER.x} cy={CENTER.y} r={260} fill="none" stroke={INK} strokeWidth={1.4} strokeOpacity={0.12} />
        <circle cx={660} cy={350} r={165} fill="none" stroke={INK_DEEP} strokeWidth={1.1} strokeOpacity={0.14} />
        <g ref={groupRef}>
          <path
            d="M 340,400 C 420,220 780,220 860,400 C 780,540 500,560 420,470"
            fill="none"
            stroke={INK}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeOpacity={0.2}
          />
        </g>
      </svg>
    </div>
  );
}
