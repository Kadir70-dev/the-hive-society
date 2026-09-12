import { useEffect, useState } from "react";

export type ResponsiveTier = "mobile" | "tablet" | "desktop";

/**
 * Mirrors the site's own real breakpoints (globals.css's 700px/1000px —
 * where .grid-2/.grid-3 actually reflow) rather than inventing new ones, so
 * "tablet" and "desktop" here match what a visitor's eyes already see
 * change elsewhere on the page. Resize-reactive (unlike most of this
 * project's one-shot mount checks) because a decorative background that
 * doesn't adapt to a resized window reads as visibly broken in a way a
 * one-off scroll effect wouldn't.
 *
 * Always starts at "desktop" — matching what the server renders, since it
 * has no real viewport to check — and corrects itself a frame after mount.
 * A lazy `useState(() => matchMedia(...))` initializer would call the real
 * browser check during the client's OWN hydration render too, which is
 * exactly what caused a hydration mismatch found in visual QA (on mobile,
 * the server's "desktop" and that eager client check's "mobile" disagreed
 * on which sub-elements a variant renders).
 */
export function useResponsiveTier(): ResponsiveTier {
  const [tier, setTier] = useState<ResponsiveTier>("desktop");

  useEffect(() => {
    const desktopMql = window.matchMedia("(min-width: 1000px)");
    const tabletMql = window.matchMedia("(min-width: 700px)");

    const resolve = (): ResponsiveTier => {
      if (desktopMql.matches) return "desktop";
      if (tabletMql.matches) return "tablet";
      return "mobile";
    };

    const frame = requestAnimationFrame(() => setTier(resolve()));
    const update = () => setTier(resolve());

    desktopMql.addEventListener("change", update);
    tabletMql.addEventListener("change", update);
    return () => {
      cancelAnimationFrame(frame);
      desktopMql.removeEventListener("change", update);
      tabletMql.removeEventListener("change", update);
    };
  }, []);

  return tier;
}
