import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createZiinaPaymentIntent } from "@/lib/ziina/client";
import { MEMBERSHIP_PLANS, isMembershipPlanId } from "@/data/membershipPlans";
import { siteUrl } from "@/lib/site";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const planId = body.plan;
  const fullName = typeof body.fullName === "string" ? body.fullName.trim().slice(0, 120) : "";
  const email = typeof body.email === "string" ? body.email.trim().slice(0, 200).toLowerCase() : "";

  if (!isMembershipPlanId(planId)) {
    return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
  }
  if (!fullName) {
    return NextResponse.json({ error: "Please provide your name." }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
  }

  const plan = MEMBERSHIP_PLANS[planId];
  const admin = getSupabaseAdmin();

  const { data: member, error: memberError } = await admin
    .from("members")
    .upsert(
      { email, full_name: fullName, plan: plan.id, amount_aed: plan.amountAed, status: "pending" },
      { onConflict: "email" }
    )
    .select("id")
    .maybeSingle();

  if (memberError || !member) {
    console.error("[membership/checkout] member upsert failed");
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }

  let intent;
  try {
    intent = await createZiinaPaymentIntent({
      amountAed: plan.amountAed,
      successUrl: `${siteUrl}/membership/success?pi={PAYMENT_INTENT_ID}`,
      cancelUrl: `${siteUrl}/membership?canceled=1`,
      message: `The Hive Society — ${plan.label}`,
    });
  } catch (err) {
    console.error("[membership/checkout] Ziina intent creation failed", err);
    return NextResponse.json({ error: "Payment could not be started. Please try again shortly." }, { status: 502 });
  }

  const { error: paymentError } = await admin.from("membership_payments").insert({
    member_id: member.id,
    ziina_payment_intent_id: intent.id,
    plan: plan.id,
    amount_aed: plan.amountAed,
    status: "pending",
  });

  if (paymentError) {
    console.error("[membership/checkout] payment row insert failed");
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ redirectUrl: intent.redirect_url });
}
