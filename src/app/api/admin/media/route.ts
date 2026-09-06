import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SITE_IMAGES_BUCKET } from "@/lib/content/getPageMedia";
import { pathsForPageKey } from "@/lib/content/pagePaths";

const KEY_RE = /^[a-z0-9_]+(\.[a-z0-9_]+)+$/i;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: NextRequest) {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const mediaKey = String(form.get("media_key") ?? "").trim();
  const altText = String(form.get("alt_text") ?? "").trim().slice(0, 300);
  const objectPosition = String(form.get("object_position") ?? "center").trim().slice(0, 60);
  const file = form.get("file");

  if (!mediaKey || !KEY_RE.test(mediaKey)) {
    return NextResponse.json({ error: "Invalid media key." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Only JPEG, PNG or WEBP images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image is too large (max 8MB)." }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const pageKey = mediaKey.split(".")[0] ?? mediaKey;
  const storagePath = `${mediaKey}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from(SITE_IMAGES_BUCKET)
    .upload(storagePath, buffer, { contentType: file.type, upsert: true });

  if (uploadError) {
    console.error("[admin/media] upload failed");
    return NextResponse.json({ error: "Could not upload image." }, { status: 500 });
  }

  const { data: row, error: dbError } = await admin
    .from("site_media")
    .upsert(
      {
        media_key: mediaKey,
        page_key: pageKey,
        storage_path: storagePath,
        alt_text: altText || null,
        object_position: objectPosition,
        updated_by: session.userId,
      },
      { onConflict: "media_key" }
    )
    .select("media_key, storage_path, alt_text, object_position")
    .maybeSingle();

  if (dbError || !row) {
    console.error("[admin/media] db upsert failed");
    return NextResponse.json({ error: "Image uploaded but could not be saved." }, { status: 500 });
  }

  for (const path of pathsForPageKey(pageKey)) {
    revalidatePath(path);
  }

  const { data: pub } = admin.storage.from(SITE_IMAGES_BUCKET).getPublicUrl(row.storage_path!);
  return NextResponse.json({
    url: pub.publicUrl,
    alt: row.alt_text ?? "",
    objectPosition: row.object_position ?? "center",
  });
}
