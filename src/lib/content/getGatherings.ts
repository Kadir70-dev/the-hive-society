import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { marketingExperiences } from "@/data/experiences";
import { gatheringToExperience, type Gathering } from "@/data/gatherings";
import type { Experience } from "@/data/types";

/**
 * Fetches the published Explore Gatherings cards from the DB. Falls back to
 * the hardcoded `marketingExperiences` array on any failure or if the table
 * is empty — nothing goes blank while the table is being set up.
 */
export async function getGatherings(): Promise<Experience[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("gatherings")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) return marketingExperiences;

    return (data as Gathering[]).map(gatheringToExperience);
  } catch {
    return marketingExperiences;
  }
}
