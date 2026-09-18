import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { pathsForPageKey } from "@/lib/content/pagePaths";
import type { MembershipCadence } from "@/data/membershipPlans";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CADENCES: MembershipCadence[] = ["monthly", "annual"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid plan id." }, { status: 400 });
  }

  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (typeof body.name === "string") update.name = body.name.trim().slice(0, 100);
  if (typeof body.tagline === "string") update.tagline = body.tagline.trim().slice(0, 200);
  if (body.amount_aed !== undefined) {
    const amountAed = Number(body.amount_aed);
    if (!Number.isFinite(amountAed) || amountAed <= 0) {
      return NextResponse.json({ error: "Amount must be a positive number." }, { status: 400 });
    }
    update.amount_aed = amountAed;
  }
  if (body.cadence !== undefined) {
    if (!CADENCES.includes(body.cadence)) {
      return NextResponse.json({ error: "Invalid cadence." }, { status: 400 });
    }
    update.cadence = body.cadence;
  }
  if (Array.isArray(body.features)) {
    update.features = body.features.filter((f: unknown) => typeof f === "string").slice(0, 20);
  }
  if (typeof body.is_active === "boolean") update.is_active = body.is_active;
  if (body.sort_order !== undefined && Number.isFinite(Number(body.sort_order))) {
    update.sort_order = Number(body.sort_order);
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin.from("membership_plans").update(update).eq("id", id).select("*").maybeSingle();

  if (error || !data) {
    console.error("[admin/membership-plans/:id] update failed");
    return NextResponse.json({ error: "Could not update plan." }, { status: 500 });
  }

  for (const path of pathsForPageKey("membership")) revalidatePath(path);

  return NextResponse.json({ plan: data });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid plan id." }, { status: 400 });
  }

  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();

  const { count } = await admin
    .from("members")
    .select("id", { count: "exact", head: true })
    .eq("plan_id", id);

  if (count && count > 0) {
    return NextResponse.json(
      { error: `${count} member(s) are on this plan — deactivate it instead of deleting.` },
      { status: 409 }
    );
  }

  const { error } = await admin.from("membership_plans").delete().eq("id", id);
  if (error) {
    console.error("[admin/membership-plans/:id] delete failed");
    return NextResponse.json({ error: "Could not delete plan." }, { status: 500 });
  }

  for (const path of pathsForPageKey("membership")) revalidatePath(path);

  return NextResponse.json({ ok: true });
}
