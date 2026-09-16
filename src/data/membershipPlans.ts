export type MembershipPlanId = "one_time";

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
};

export function isMembershipPlanId(value: unknown): value is MembershipPlanId {
  return value === "one_time";
}
