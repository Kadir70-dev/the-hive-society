"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let registered = false;

/**
 * Registers the GSAP plugins this project uses, exactly once, client-side only.
 * Call from any client component before using ScrollTrigger/SplitText — safe
 * to call repeatedly (no-ops after the first run).
 */
export function ensureGsapPlugins() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  registered = true;
}

export { gsap, ScrollTrigger, SplitText };
export { useGSAP } from "@gsap/react";
