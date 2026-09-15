import type { ExperienceCategory } from "@/data/types";

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
}

export const CATEGORIES: ExperienceCategory[] = ["Move", "Gather", "Learn", "Celebrate", "Unwind", "Explore"];
