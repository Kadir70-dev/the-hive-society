const DESKTOP_QUERY = "(min-width: 768px)";

/**
 * Client-only. 768px is not one of globals.css's own breakpoints (those are
 * 640/700/720/900/980/1000/1080px) — it's a deliberately conservative tablet
 * cutoff for gating motion work like ParallaxSection's scrub, which tends to
 * fight touch-scroll momentum below it. Returns false during SSR/first paint.
 */
export function isDesktopViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(DESKTOP_QUERY).matches;
}
