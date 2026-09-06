import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { APPLICATION_STATUSES, type ApplicationStatus } from "@/lib/admin/types";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid application id." }, { status: 400 });
  }

  let session;
  try {
    session = await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const update: Record<string, unknown> = {};

  if ("status" in body) {
    if (typeof body.status !== "string" || !APPLICATION_STATUSES.includes(body.status as ApplicationStatus)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    update.status = body.status;
    update.reviewed_at = new Date().toISOString();
    update.reviewed_by = session.userId;
  }

  if ("admin_notes" in body) {
    if (typeof body.admin_notes !== "string") {
      return NextResponse.json({ error: "Invalid notes." }, { status: 400 });
    }
    update.admin_notes = body.admin_notes.slice(0, 4000);
  }

  if ("whatsapp_invited" in body) {
    update.whatsapp_invited_at = body.whatsapp_invited ? new Date().toISOString() : null;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No changes provided." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("community_applications")
    .update(update)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error || !data) {
    console.error("[admin/applications/:id] update failed");
    return NextResponse.json({ error: "Could not update application." }, { status: 500 });
  }

  return NextResponse.json({ application: data });
}
