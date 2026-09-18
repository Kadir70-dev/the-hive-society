export type MembershipCadence = "monthly" | "annual";

export interface MembershipPlan {
  id: string;
  key: string;
  name: string;
  tagline: string;
  amountAed: number;
  currency: string;
  cadence: MembershipCadence;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

// Used when the DB has no rows yet (or is unreachable) — see getMembershipPlans.ts.
export const FALLBACK_MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "",
    key: "join",
    name: "JOIN",
    tagline: "Discover, connect, and book.",
    amountAed: 140,
    currency: "AED",
    cadence: "monthly",
    features: [
      "Discover experiences",
      "Connect with circles",
      "Join circles",
      "Save favourites",
      "Reserve & book experiences",
    ],
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "",
    key: "create",
    name: "CREATE",
    tagline: "Everything in JOIN, plus host your own.",
    amountAed: 299,
    currency: "AED",
    cadence: "monthly",
    features: [
      "Everything in JOIN",
      "Create & publish experiences",
      "Host experiences",
      "Creator Studio access",
    ],
    isActive: true,
    sortOrder: 2,
  },
];
