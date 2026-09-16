export type MembershipPlanId = "one_time" | "monthly";

export interface MembershipPlan {
  id: MembershipPlanId;
  label: string;
  amountAed: number;
  cadenceLabel: string;
  description: string;
}

export const MEMBERSHIP_PLANS: Record<MembershipPlanId, MembershipPlan> = {
  one_time: {
    id: "one_time",
    label: "Founding Membership",
    amountAed: 299,
    cadenceLabel: "one-time",
    description: "Pay once — membership never expires.",
  },
  monthly: {
    id: "monthly",
    label: "Monthly Membership",
    amountAed: 49,
    cadenceLabel: "per month",
    description: "Billed monthly — you'll get a fresh payment link each cycle, nothing auto-charges.",
  },
};

export function isMembershipPlanId(value: unknown): value is MembershipPlanId {
  return value === "one_time" || value === "monthly";
}
