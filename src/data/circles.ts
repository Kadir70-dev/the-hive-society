import type { Circle } from "./types";

export const circles: Circle[] = [
  { slug: "coffee-and-conversations", name: "Coffee & Conversations", members: 86, cadence: "Meets Tuesdays, weekly" },
  { slug: "weekend-padel", name: "Weekend Padel", members: 54, cadence: "Meets Saturdays, weekly" },
  { slug: "wellness-circle", name: "Wellness Circle", members: 71, cadence: "Meets fortnightly" },
  { slug: "book-club", name: "Book Club", members: 39, cadence: "First Thursday, monthly" },
  { slug: "outdoor-explorers", name: "Outdoor Explorers", members: 63, cadence: "Every other Friday" },
  { slug: "creative-women-abu-dhabi", name: "Creative Women Abu Dhabi", members: 48, cadence: "Monthly workshop" },
];

export function findCircle(slug: string): Circle | undefined {
  return circles.find((c) => c.slug === slug);
}
