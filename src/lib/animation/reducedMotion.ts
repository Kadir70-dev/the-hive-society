const QUERY = "(prefers-reduced-motion: reduce)";

/** Client-only check. Always returns false during SSR/first paint to avoid hydration mismatch. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}

/** Subscribes to changes in the user's reduced-motion preference. Returns an unsubscribe fn. */
export function onReducedMotionChange(callback: (reduced: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(QUERY);
  const listener = () => callback(mql.matches);
  mql.addEventListener("change", listener);
  return () => mql.removeEventListener("change", listener);
}
