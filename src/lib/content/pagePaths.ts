/** page_key -> route path, used to revalidate the right page after a save. */
export const PAGE_PATHS: Record<string, string> = {
  home: "/",
  community: "/community",
  membership: "/membership",
  about: "/about",
  explore: "/explore",
};

/** Every route that renders the shared marketing Header/Footer (nav, footer,
 * sign-in/join modals) — not just the routes with their own page_key above.
 * A "global" content edit must revalidate all of these, or the ones missing
 * from this list keep showing stale nav/footer/modal text until something
 * else happens to rebuild them. Product app routes (/app/...) render their
 * own shell, not this Header/Footer, so they're deliberately excluded. */
const GLOBAL_CHROME_PATHS = [
  "/",
  "/about",
  "/community",
  "/community-guidelines",
  "/contact",
  "/explore",
  "/host",
  "/membership",
  "/partners",
  "/privacy",
  "/terms",
];

export function pathsForPageKey(pageKey: string): string[] {
  if (pageKey === "global") {
    return GLOBAL_CHROME_PATHS;
  }
  return [PAGE_PATHS[pageKey] ?? "/"];
}
