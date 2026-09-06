import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { ResolvedMedia } from "./types";

export const SITE_IMAGES_BUCKET = "site-images";

/**
 * Fetches all editable image overrides for one page. Returns an empty map on
 * any failure — callers fall back to the image already shipped in the repo.
 */
export async function getPageMedia(pageKey: string): Promise<Record<string, ResolvedMedia>> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("site_media")
      .select("media_key, storage_path, alt_text, object_position")
      .eq("page_key", pageKey);

    if (error || !data) return {};

    const map: Record<string, ResolvedMedia> = {};
    for (const row of data) {
      if (!row.storage_path) continue;
      const { data: pub } = supabase.storage.from(SITE_IMAGES_BUCKET).getPublicUrl(row.storage_path);
      map[row.media_key] = {
        url: pub.publicUrl,
        alt: row.alt_text ?? "",
        objectPosition: row.object_position ?? "center",
      };
    }
    return map;
  } catch {
    return {};
  }
}

export function resolveMedia(
  map: Record<string, ResolvedMedia>,
  key: string,
  fallback: { url: string; alt: string; objectPosition?: string }
): ResolvedMedia {
  const override = map[key];
  if (override) return override;
  return { url: fallback.url, alt: fallback.alt, objectPosition: fallback.objectPosition ?? "center" };
}
