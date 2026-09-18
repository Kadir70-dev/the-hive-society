import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { FALLBACK_MEMBERSHIP_PLANS, type MembershipPlan, type MembershipCadence } from "@/data/membershipPlans";

interface MembershipPlanRow {
  id: string;
  key: string;
  name: string;
  tagline: string;
  amount_aed: number;
  currency: string;
  cadence: MembershipCadence;
  features: string[];
  is_active: boolean;
  sort_order: number;
}

function rowToPlan(row: MembershipPlanRow): MembershipPlan {
  return {
    id: row.id,
    key: row.key,
    name: row.name,
    tagline: row.tagline,
    amountAed: row.amount_aed,
    currency: row.currency,
    cadence: row.cadence,
    features: row.features ?? [],
    isActive: row.is_active,
    sortOrder: row.sort_order,
  };
}

/**
 * Fetches the active membership tiers from the DB, ordered for display.
 * Falls back to the hardcoded JOIN/CREATE pair on any failure or if the
 * table has no rows yet — nothing goes blank while the migration/seed is
 * being applied.
 */
export async function getMembershipPlans(): Promise<MembershipPlan[]> {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("membership_plans")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return FALLBACK_MEMBERSHIP_PLANS;

    return (data as MembershipPlanRow[]).map(rowToPlan);
  } catch {
    return FALLBACK_MEMBERSHIP_PLANS;
  }
}
