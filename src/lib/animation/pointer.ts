const FINE_POINTER_QUERY = "(pointer: fine)";

/**
 * Client-only. True only for a mouse/trackpad-class pointer. Touch browsers
 * mostly never fire continuous `mousemove` anyway, but this makes
 * "desktop pointer only" an explicit, testable guard rather than an
 * incidental side effect of touch event semantics. Returns false during
 * SSR/first paint.
 */
export function isFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(FINE_POINTER_QUERY).matches;
}
