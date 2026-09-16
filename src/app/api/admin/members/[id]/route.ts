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
  if (!body || !STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("members")
    .update({ status: body.status })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error || !data) {
    console.error("[admin/members/:id] update failed");
    return NextResponse.json({ error: "Could not update member." }, { status: 500 });
  }

  return NextResponse.json({ member: data });
}
