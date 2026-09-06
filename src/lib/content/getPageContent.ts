import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export { resolve } from "./resolve";

/**
 * Fetches all editable text for one page in a single query. Returns an empty
 * map on any failure (missing table, Supabase outage, bad config) so callers
 * always fall back to their hardcoded default text instead of rendering
 * blank sections — see resolve() in ./resolve.ts.
 */
export async function getPageContent(pageKey: string): Promise<Record<string, string>> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("site_content")
      .select("content_key, value")
      .eq("page_key", pageKey)
      .eq("is_published", true);

    if (error || !data) return {};

    const map: Record<string, string> = {};
    for (const row of data) {
      map[row.content_key] = row.value;
    }
    return map;
  } catch {
    return {};
  }
}
