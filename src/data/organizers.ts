import type { Organizer } from "./types";
import { marketingExperiences } from "./experiences";

/** Derived from the experience catalogue so organiser names never drift out of sync. */
export const organizers: Organizer[] = Array.from(
  new Map(
    marketingExperiences.map((e) => [e.organiser, { name: e.organiser, type: e.category }])
  ).values()
);
