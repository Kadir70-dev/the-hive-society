import "server-only";
import { cache } from "react";
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
 * Falls back to the matching hardcoded array if the database is unavailable.
 * A successful empty result stays empty, so unpublishing all events works.
 */
export const getGatherings = cache(async (surface: GatheringSurface = "marketing"): Promise<Experience[]> => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("gatherings")
      .select("*")
      .eq("is_published", true)
      .eq("surface", surface)
      .order("display_order", { ascending: true });

    if (error || !data) return FALLBACKS[surface];

    return (data as Gathering[]).map(gatheringToExperience);
  } catch {
    return FALLBACKS[surface];
  }
});

export const getGatheringBySlug = cache(async (slug: string): Promise<Experience | undefined> => {
  const [app, marketing] = await Promise.all([getGatherings("app"), getGatherings("marketing")]);
  return [...app, ...marketing].find((experience) => experience.slug === slug);
});
