"use client";

import { useResponsiveTier } from "@/lib/animation/useResponsiveTier";
import { FlowVariant } from "./variants/FlowVariant";
import { OrbitVariant } from "./variants/OrbitVariant";
import { RingsVariant } from "./variants/RingsVariant";
import { WaveVariant } from "./variants/WaveVariant";
import { ConstellationVariant } from "./variants/ConstellationVariant";

export type LineBackgroundVariant = "flow" | "orbit" | "rings" | "wave" | "constellation";

interface DynamicLineBackgroundProps {
  variant: LineBackgroundVariant;
  className?: string;
}

/**
 * Decorative, always-behind-content line-art background. Fills its parent —
 * mount it as the FIRST child of a `position: relative` section, and give
 * the section's actual content wrapper `position: relative; z-index: 1`
 * (an element that's merely later in DOM order is NOT guaranteed to paint
 * above a `position: absolute` sibling; explicit z-index on both sides is
 * what actually guarantees it — the same fix this project already made once
 * for SpotlightCard's own overlay).
 *
 * `pointer-events: none` here means it can never intercept clicks/taps —
 * everything above it stays fully interactive.
 *
 * Every variant is authored as a complete, self-sufficient static image;
 * under prefers-reduced-motion each one silently skips its GSAP timeline
 * and renders that same artwork motionless, rather than being hidden.
 */
export function DynamicLineBackground({ variant, className }: DynamicLineBackgroundProps) {
  const tier = useResponsiveTier();

  return (
    <div
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {variant === "flow" && <FlowVariant tier={tier} />}
      {variant === "orbit" && <OrbitVariant tier={tier} />}
      {variant === "rings" && <RingsVariant tier={tier} />}
      {variant === "wave" && <WaveVariant tier={tier} />}
      {variant === "constellation" && <ConstellationVariant tier={tier} />}
    </div>
  );
}
