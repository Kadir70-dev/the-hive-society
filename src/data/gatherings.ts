import type { Experience, ExperienceCategory } from "./types";

export const GATHERING_CATEGORIES: ExperienceCategory[] = ["Move", "Gather", "Learn", "Celebrate", "Unwind", "Explore"];

/** Shape of a row in the `gatherings` Supabase table — the DB-backed source
 * for the public /explore page, editable via /admin/gatherings and inline
 * on /explore itself (see ExploreGrid.tsx). */
export type GatheringSurface = "marketing" | "app";

export interface Gathering {
  id: string;
  slug: string;
  title: string;
  category: ExperienceCategory;
  organiser: string;
  area: string;
  date_label: string;
  time_label: string | null;
  price_label: string;
  going: number;
  attendee_names: string[];
  verified: boolean;
  image_url: string;
  image_alt: string | null;
  description: string;
  display_order: number;
  is_published: boolean;
  surface: GatheringSurface;
}

export function gatheringToExperience(g: Gathering): Experience {
  return {
    id: g.id,
    slug: g.slug,
    title: g.title,
    category: g.category,
    organiser: g.organiser,
    area: g.area,
    date: g.date_label,
    time: g.time_label ?? undefined,
    price: g.price_label,
    going: g.going,
    attendeeNames: g.attendee_names,
    verified: g.verified,
    image: g.image_url,
    description: g.description,
  };
}

/** Inverse of the above, used to seed the edit form when editing a card
 * inline from /explore or /app/explore, where only the public `Experience`
 * shape is on hand. `is_published` defaults true (the public page only ever
 * shows published rows) and `image_alt`/`display_order` aren't user-editable.
 * `surface` must be passed explicitly by the caller — it decides which page
 * a newly created gathering appears on (see AppExploreGrid vs ExploreGrid). */
export function experienceToGathering(e: Experience, surface: GatheringSurface = "marketing"): Gathering {
  return {
    id: e.id,
    slug: e.slug,
    title: e.title,
    category: e.category,
    organiser: e.organiser,
    area: e.area,
    date_label: e.date,
    time_label: e.time ?? null,
    price_label: e.price,
    going: e.going,
    attendee_names: e.attendeeNames,
    verified: e.verified,
    image_url: e.image,
    image_alt: null,
    description: e.description,
    display_order: 0,
    is_published: true,
    surface,
  };
}
