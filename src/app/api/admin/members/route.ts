import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("members")
    .select("*, membership_payments(*), membership_plans(key, name, amount_aed, cadence)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/members] list failed");
    return NextResponse.json({ error: "Could not load members." }, { status: 500 });
  }

  return NextResponse.json({ members: data ?? [] });
}
