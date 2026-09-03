export type ExperienceCategory =
  | "Move"
  | "Gather"
  | "Learn"
  | "Celebrate"
  | "Unwind"
  | "Explore";

export interface Experience {
  id: string;
  slug: string;
  title: string;
  category: ExperienceCategory;
  organiser: string;
  area: string;
  date: string;
  time?: string;
  price: string;
  going: number;
  sayHi?: number;
  attendeeNames: string[];
  verified: boolean;
  image: string;
  description: string;
}

export interface Circle {
  slug: string;
  name: string;
  members: number;
  cadence: string;
}

export interface Organizer {
  name: string;
  type: string;
}

export interface Member {
  firstName: string;
  initials: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface MembershipFeature {
  label: string;
  community: boolean;
  membership: boolean;
}

export interface SocialChannel {
  name: string;
  description: string;
}
