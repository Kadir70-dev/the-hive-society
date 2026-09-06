/** Plain helper, safe to import from client components too (no "server-only"). */
export function resolve(map: Record<string, string>, key: string, fallback: string): string {
  const value = map[key];
  return value && value.trim().length > 0 ? value : fallback;
}
