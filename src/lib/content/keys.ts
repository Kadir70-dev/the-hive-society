/** content_key prefixes that live under the shared "global" page_key
 * (nav/footer/modal appear on every marketing page, not just one). */
const GLOBAL_PREFIXES = new Set(["nav", "footer", "modal"]);

export function pageKeyForContentKey(key: string): string {
  const prefix = key.split(".")[0] ?? key;
  return GLOBAL_PREFIXES.has(prefix) ? "global" : prefix;
}
