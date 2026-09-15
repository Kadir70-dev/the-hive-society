import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { marketingExperiences } from "@/data/experiences";
import type { Experience } from "@/data/types";

interface GatheringRow {
  id: string;
  slug: string;
  title: string;
  category: Experience["category"];
  organiser: string;
  area: string;
  date_label: string;
  time_label: string | null;
  price_label: string;
  going: number;
  attendee_names: string[];
  verified: boolean;
  image_url: string;
  description: string;
}

function toExperience(row: GatheringRow): Experience {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    organiser: row.organiser,
    area: row.area,
    date: row.date_label,
    time: row.time_label ?? undefined,
    price: row.price_label,
    going: row.going,
    attendeeNames: row.attendee_names,
    verified: row.verified,
    image: row.image_url,
    description: row.description,
  };
}

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
      .select(
        "id, slug, title, category, organiser, area, date_label, time_label, price_label, going, attendee_names, verified, image_url, description"
      )
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) return marketingExperiences;

    return (data as GatheringRow[]).map(toExperience);
  } catch {
    return marketingExperiences;
  }
}
