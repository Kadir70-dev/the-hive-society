import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { APPLICATION_STATUSES, type ApplicationStatus } from "@/lib/admin/types";

// Search/filter params are sent in the request body (not URL query params) so
// applicant names/emails an admin types while searching never land in the
// URL, browser history, or server access logs.
export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const status = typeof body.status === "string" ? body.status : "all";
  const query = typeof body.q === "string" ? body.q.trim().slice(0, 200) : "";

  const admin = getSupabaseAdmin();
  let builder = admin
    .from("community_applications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (APPLICATION_STATUSES.includes(status as ApplicationStatus)) {
    builder = builder.eq("status", status);
  }

  if (query) {
    const escaped = query.replace(/[%_]/g, (m) => `\\${m}`);
    builder = builder.or(
      `full_name.ilike.%${escaped}%,email.ilike.%${escaped}%,phone.ilike.%${escaped}%`
    );
  }

  const { data, error } = await builder;

  if (error) {
    console.error("[admin/applications/list] query failed");
    return NextResponse.json({ error: "Could not load applications." }, { status: 500 });
  }

  return NextResponse.json({ applications: data ?? [] });
}
