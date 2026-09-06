import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { pathsForPageKey } from "@/lib/content/pagePaths";

/** Metadata-only edits (alt text / object position) for an image that has
 * already been uploaded at least once via POST /api/admin/media. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key: mediaKey } = await params;

  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const update: Record<string, unknown> = {};
  if (typeof body.alt_text === "string") update.alt_text = body.alt_text.trim().slice(0, 300);
  if (typeof body.object_position === "string") update.object_position = body.object_position.trim().slice(0, 60);

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No changes provided." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("site_media")
    .update(update)
    .eq("media_key", mediaKey)
    .not("storage_path", "is", null)
    .select("media_key, page_key")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "No uploaded image found for this key yet." }, { status: 404 });
  }

  for (const path of pathsForPageKey(data.page_key)) {
    revalidatePath(path);
  }

  return NextResponse.json({ ok: true });
}
