import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { marketingExperiences, appExperiences } from "@/data/experiences";
import { gatheringToExperience, type Gathering, type GatheringSurface } from "@/data/gatherings";
import type { Experience } from "@/data/types";

const FALLBACKS: Record<GatheringSurface, Experience[]> = {
  marketing: marketingExperiences,
  app: appExperiences,
};

/**
 * Fetches the published Explore Gatherings cards from the DB for one
 * surface — the public marketing page (default) or the in-app catalogue.
 * Falls back to the matching hardcoded array on any failure or if that
 * surface has no rows yet — nothing goes blank while the table is being
 * set up.
 */
export async function getGatherings(surface: GatheringSurface = "marketing"): Promise<Experience[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("gatherings")
      .select("*")
      .eq("is_published", true)
      .eq("surface", surface)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) return FALLBACKS[surface];

    return (data as Gathering[]).map(gatheringToExperience);
  } catch {
    return FALLBACKS[surface];
  }
}
