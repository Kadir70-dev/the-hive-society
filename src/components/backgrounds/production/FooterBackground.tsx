"use client";

import { useResponsiveTier } from "@/lib/animation/useResponsiveTier";
import { ConstellationVariant } from "../variants/ConstellationVariant";

/**
 * Footer background — Constellation only, no interaction. Imports
 * ConstellationVariant directly rather than going through
 * DynamicLineBackground: that dispatcher statically imports all 5 ambient
 * variants (fine for the /bg-lab preview page, which shows all of them at
 * once), and since the Footer is shared by every marketing page, routing
 * through it would ship Flow/Orbit/Rings/Wave's code to every page that
 * only ever needs Constellation.
 */
export function FooterBackground() {
  const tier = useResponsiveTier();
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }} aria-hidden>
      <ConstellationVariant tier={tier} />
    </div>
  );
}
