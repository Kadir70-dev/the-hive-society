"use client";

import { useResponsiveTier } from "@/lib/animation/useResponsiveTier";
import { OrbitVariant } from "../variants/OrbitVariant";
import { OrbitNudgeVariant } from "../interactive/OrbitNudgeVariant";

/**
 * "What Sets Us Apart" section background — Orbit + Orbit Nudge.
 * Mobile renders the plain ambient Orbit (its own slow auto-rotation tween)
 * instead of the interactive version, which would otherwise sit frozen with
 * no pointer to speed it up.
 */
export function WhatSetsUsApartBackground() {
  const tier = useResponsiveTier();
  return tier === "mobile" ? (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }} aria-hidden>
      <OrbitVariant tier={tier} />
    </div>
  ) : (
    <OrbitNudgeVariant />
  );
}
