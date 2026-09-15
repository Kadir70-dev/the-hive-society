import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SITE_IMAGES_BUCKET } from "@/lib/content/getPageMedia";
import { pathsForPageKey } from "@/lib/content/pagePaths";
import type { ExperienceCategory } from "@/data/types";

const CATEGORIES: ExperienceCategory[] = ["Move", "Gather", "Learn", "Celebrate", "Unwind", "Explore"];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

function parseAttendeeNames(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid gathering id." }, { status: 400 });
  }

  let session;
  try {
    session = await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid submission." }, { status: 400 });

  const update: Record<string, unknown> = { updated_by: session.userId };

  if (form.has("title")) update.title = String(form.get("title")).trim().slice(0, 200);
  if (form.has("category")) {
    const category = String(form.get("category"));
    if (!CATEGORIES.includes(category as ExperienceCategory)) {
      return NextResponse.json({ error: "Invalid category." }, { status: 400 });
    }
    update.category = category;
  }
  if (form.has("organiser")) update.organiser = String(form.get("organiser")).trim().slice(0, 200);
  if (form.has("area")) update.area = String(form.get("area")).trim().slice(0, 200);
  if (form.has("date_label")) update.date_label = String(form.get("date_label")).trim().slice(0, 100);
  if (form.has("time_label")) update.time_label = String(form.get("time_label")).trim().slice(0, 100) || null;
  if (form.has("price_label")) update.price_label = String(form.get("price_label")).trim().slice(0, 100);
  if (form.has("going")) {
    const going = Number(form.get("going"));
    if (!Number.isFinite(going) || going < 0) {
      return NextResponse.json({ error: "Going must be a non-negative number." }, { status: 400 });
    }
    update.going = going;
  }
  if (form.has("attendee_names")) update.attendee_names = parseAttendeeNames(String(form.get("attendee_names")));
  if (form.has("verified")) update.verified = String(form.get("verified")) === "true";
  if (form.has("description")) update.description = String(form.get("description")).trim().slice(0, 2000);
  if (form.has("is_published")) update.is_published = String(form.get("is_published")) !== "false";

  const admin = getSupabaseAdmin();
  const file = form.get("file");
  if (file instanceof File) {
    const ext = ALLOWED_IMAGE_TYPES[file.type];
    if (!ext) {
      return NextResponse.json({ error: "Only JPEG, PNG or WEBP images are allowed." }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image is too large (max 8MB)." }, { status: 400 });
    }
    const storagePath = `gatherings/${id}/${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await admin.storage
      .from(SITE_IMAGES_BUCKET)
      .upload(storagePath, buffer, { contentType: file.type, upsert: true });
    if (uploadError) {
      console.error("[admin/gatherings/:id] image upload failed");
      return NextResponse.json({ error: "Could not upload image." }, { status: 500 });
    }
    const { data: pub } = admin.storage.from(SITE_IMAGES_BUCKET).getPublicUrl(storagePath);
    update.image_url = pub.publicUrl;
  }

  if (Object.keys(update).length <= 1) {
    return NextResponse.json({ error: "No changes provided." }, { status: 400 });
  }

  const { data: row, error } = await admin
    .from("gatherings")
    .update(update)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error || !row) {
    console.error("[admin/gatherings/:id] update failed");
    return NextResponse.json({ error: "Could not update gathering." }, { status: 500 });
  }

  for (const path of pathsForPageKey("explore")) revalidatePath(path);

  return NextResponse.json({ gathering: row });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Invalid gathering id." }, { status: 400 });
  }

  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const { error } = await admin.from("gatherings").delete().eq("id", id);

  if (error) {
    console.error("[admin/gatherings/:id] delete failed");
    return NextResponse.json({ error: "Could not delete gathering." }, { status: 500 });
  }

  for (const path of pathsForPageKey("explore")) revalidatePath(path);

  return NextResponse.json({ ok: true });
}
