import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendJoinNotification } from "@/lib/email/sendJoinNotification";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// No payment gateway is called here. Ziina (the site's only gateway) has no
// subscriptions/recurring-billing API, so JOIN/CREATE signups are recorded
// as 'pending' members for an admin to activate manually from
// /admin/members — see supabase/migrations/0006_membership_tiers.sql for
// the plan data this reads.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const planKey = typeof body.plan === "string" ? body.plan : "";
  const fullName = typeof body.fullName === "string" ? body.fullName.trim().slice(0, 120) : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 200).toLowerCase() : "";

  if (!planKey) {
    return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
  }
  if (!fullName) {
    return NextResponse.json({ error: "Please provide your name." }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  const { data: plan, error: planError } = await admin
    .from("membership_plans")
    .select("id, key, name, amount_aed")
    .eq("key", planKey)
    .eq("is_active", true)
    .maybeSingle();

  if (planError || !plan) {
    return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
  }

  const { error: memberError } = await admin.from("members").upsert(
    {
      email,
      full_name: fullName,
      plan: "monthly",
      plan_id: plan.id,
      amount_aed: plan.amount_aed,
      status: "pending",
    },
    { onConflict: "email" }
  );

  if (memberError) {
    console.error("[membership/checkout] member upsert failed");
    return NextResponse.json({ error: "Could not submit your membership. Please try again." }, { status: 500 });
  }

  await sendJoinNotification(`New ${plan.name} membership request — The Hive Society`, {
    Name: fullName,
    Email: email,
    Plan: plan.name,
    Amount: `AED ${plan.amount_aed}/mo`,
  });

  return NextResponse.json({ redirectUrl: `/membership/success?plan=${plan.key}` });
}
