"use client";

import { useResponsiveTier } from "@/lib/animation/useResponsiveTier";
import { FlowVariant } from "../variants/FlowVariant";
import { SoftPullVariant } from "../interactive/SoftPullVariant";

/**
 * "More Than a Club" section background — Flow + Soft Pull.
 * Mobile renders the plain ambient Flow (its own cheap GSAP tween, no
 * pointer tracking) rather than a "disabled" interactive component, so
 * mobile still gets a gently animated line instead of a fully frozen one.
 */
export function MoreThanAClubBackground() {
  const tier = useResponsiveTier();
  return tier === "mobile" ? (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }} aria-hidden>
      <FlowVariant tier={tier} />
    </div>
  ) : (
    <SoftPullVariant />
  );
}
