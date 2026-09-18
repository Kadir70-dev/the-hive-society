import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { pathsForPageKey } from "@/lib/content/pagePaths";
import type { MembershipCadence } from "@/data/membershipPlans";

const CADENCES: MembershipCadence[] = ["monthly", "annual"];

function slugifyKey(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);
}

export async function GET() {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin.from("membership_plans").select("*").order("sort_order", { ascending: true });

  if (error) {
    console.error("[admin/membership-plans] list failed");
    return NextResponse.json({ error: "Could not load plans." }, { status: 500 });
  }

  return NextResponse.json({ plans: data ?? [] });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
  const key = slugifyKey(typeof body.key === "string" && body.key ? body.key : name);
  const tagline = typeof body.tagline === "string" ? body.tagline.trim().slice(0, 200) : "";
  const amountAed = Number(body.amount_aed);
  const cadence: MembershipCadence = CADENCES.includes(body.cadence) ? body.cadence : "monthly";
  const features = Array.isArray(body.features) ? body.features.filter((f: unknown) => typeof f === "string").slice(0, 20) : [];
  const isActive = body.is_active !== false;
  const sortOrder = Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0;

  if (!name || !key) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!Number.isFinite(amountAed) || amountAed <= 0) {
    return NextResponse.json({ error: "Amount must be a positive number." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("membership_plans")
    .insert({
      key,
      name,
      tagline,
      amount_aed: amountAed,
      cadence,
      features,
      is_active: isActive,
      sort_order: sortOrder,
    })
    .select("*")
    .maybeSingle();

  if (error || !data) {
    console.error("[admin/membership-plans] create failed");
    const isConflict = error?.code === "23505";
    return NextResponse.json(
      { error: isConflict ? "A plan with that key already exists." : "Could not create plan." },
      { status: isConflict ? 409 : 500 }
    );
  }

  for (const path of pathsForPageKey("membership")) revalidatePath(path);

  return NextResponse.json({ plan: data });
}
