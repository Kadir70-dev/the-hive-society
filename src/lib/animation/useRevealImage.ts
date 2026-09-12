import { useRef } from "react";
import { ensureGsapPlugins, gsap, useGSAP } from "./gsap";
import { prefersReducedMotion } from "./reducedMotion";

interface UseRevealImageOptions {
  /** ScrollTrigger `start` value. Default "top 88%". */
  start?: string;
  /** Seconds. Default 1.1. */
  duration?: number;
  /** Initial scale it settles down from. Default 1.08. */
  fromScale?: number;
}

/**
 * Same clip-path reveal as the <RevealImage> wrapper component, but as a
 * ref to attach directly to an EXISTING element — for spots (like a CMS
 * page's own `.photo` card markup) where adding another wrapping div would
 * risk disturbing a CSS grid/flex layout that depends on that element being
 * the direct child. Zero extra DOM nodes.
 */
export function useRevealImage<T extends HTMLElement>(options: UseRevealImageOptions = {}) {
  const { start = "top 88%", duration = 1.1, fromScale = 1.08 } = options;
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;
      ensureGsapPlugins();

      gsap.fromTo(
        ref.current,
        { clipPath: "inset(0% 0 100% 0)", scale: fromScale },
        {
          clipPath: "inset(0% 0 0% 0)",
          scale: 1,
          duration,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start, once: true },
        },
      );
    },
    { scope: ref, dependencies: [start, duration, fromScale] },
  );

  return ref;
}
