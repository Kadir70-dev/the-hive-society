import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const STATUSES = ["pending", "active", "expired", "canceled"];

// Manual override for the rare case a payment is confirmed in the Ziina
// dashboard but the webhook never arrived — everything else flows through
// src/app/api/webhooks/ziina/route.ts instead.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid member id." }, { status: 400 });
  }

  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const admin = getSupabaseAdmin();
  const update: Record<string, unknown> = {};

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    update.status = body.status;
  }

  if (body.plan_id !== undefined) {
    if (!UUID_RE.test(body.plan_id)) {
      return NextResponse.json({ error: "Invalid plan id." }, { status: 400 });
    }
    const { data: plan, error: planError } = await admin
      .from("membership_plans")
      .select("id, amount_aed")
      .eq("id", body.plan_id)
      .maybeSingle();
    if (planError || !plan) {
      return NextResponse.json({ error: "Plan not found." }, { status: 400 });
    }
    update.plan_id = plan.id;
    update.plan = "monthly";
    update.amount_aed = plan.amount_aed;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const { data, error } = await admin
    .from("members")
    .update(update)
    .eq("id", id)
    .select("*, membership_payments(*), membership_plans(key, name, amount_aed, cadence)")
    .maybeSingle();

  if (error || !data) {
    console.error("[admin/members/:id] update failed");
    return NextResponse.json({ error: "Could not update member." }, { status: 500 });
  }

  return NextResponse.json({ member: data });
}
