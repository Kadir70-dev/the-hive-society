/** page_key -> route path, used to revalidate the right page after a save. */
export const PAGE_PATHS: Record<string, string> = {
  home: "/",
  community: "/community",
  membership: "/membership",
  about: "/about",
  explore: "/explore",
  global: "/", // nav/footer/modal content appears on every marketing page
};

export function pathsForPageKey(pageKey: string): string[] {
  if (pageKey === "global") {
    return Object.values(PAGE_PATHS).filter((p, i, arr) => arr.indexOf(p) === i);
  }
  return [PAGE_PATHS[pageKey] ?? "/"];
}
