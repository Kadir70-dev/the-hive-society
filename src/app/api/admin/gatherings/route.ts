import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SITE_IMAGES_BUCKET } from "@/lib/content/getPageMedia";
import { pathsForPageKey } from "@/lib/content/pagePaths";
import type { GatheringSurface } from "@/data/gatherings";
import type { ExperienceCategory } from "@/data/types";

const CATEGORIES: ExperienceCategory[] = ["Move", "Gather", "Learn", "Celebrate", "Unwind", "Explore"];
const SURFACES: GatheringSurface[] = ["marketing", "app"];
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function uniqueSlug(base: string): Promise<string> {
  const admin = getSupabaseAdmin();
  const root = base || "gathering";
  let candidate = root;
  let n = 2;
  for (;;) {
    const { data } = await admin.from("gatherings").select("id").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
    candidate = `${root}-${n++}`;
  }
}

function parseAttendeeNames(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export async function GET() {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("gatherings")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[admin/gatherings] list failed");
    return NextResponse.json({ error: "Could not load gatherings." }, { status: 500 });
  }

  return NextResponse.json({ gatherings: data ?? [] });
}

export async function POST(req: NextRequest) {
  let session;
  try {
    session = await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Invalid submission." }, { status: 400 });

  const title = String(form.get("title") ?? "").trim().slice(0, 200);
  const category = String(form.get("category") ?? "");
  const organiser = String(form.get("organiser") ?? "").trim().slice(0, 200);
  const area = String(form.get("area") ?? "").trim().slice(0, 200);
  const dateLabel = String(form.get("date_label") ?? "").trim().slice(0, 100);
  const timeLabel = String(form.get("time_label") ?? "").trim().slice(0, 100) || null;
  const priceLabel = String(form.get("price_label") ?? "").trim().slice(0, 100);
  const going = Number(form.get("going") ?? 0);
  const attendeeNames = parseAttendeeNames(String(form.get("attendee_names") ?? ""));
  const verified = String(form.get("verified") ?? "") === "true";
  const description = String(form.get("description") ?? "").trim().slice(0, 2000);
  const isPublished = String(form.get("is_published") ?? "true") !== "false";
  const slugInput = slugify(String(form.get("slug") ?? "") || title);
  const surfaceInput = String(form.get("surface") ?? "marketing");
  const surface: GatheringSurface = SURFACES.includes(surfaceInput as GatheringSurface)
    ? (surfaceInput as GatheringSurface)
    : "marketing";
  const file = form.get("file");

  if (!title || !organiser || !area || !dateLabel || !priceLabel) {
    return NextResponse.json({ error: "Title, organiser, area, date and price are required." }, { status: 400 });
  }
  if (!CATEGORIES.includes(category as ExperienceCategory)) {
    return NextResponse.json({ error: "Invalid category." }, { status: 400 });
  }
  if (!Number.isFinite(going) || going < 0) {
    return NextResponse.json({ error: "Going must be a non-negative number." }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "An image is required." }, { status: 400 });
  }
  const ext = ALLOWED_IMAGE_TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Only JPEG, PNG or WEBP images are allowed." }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Image is too large (max 8MB)." }, { status: 400 });
  }

  const slug = await uniqueSlug(slugInput);
  const admin = getSupabaseAdmin();
  const storagePath = `gatherings/${slug}/${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from(SITE_IMAGES_BUCKET)
    .upload(storagePath, buffer, { contentType: file.type, upsert: true });
  if (uploadError) {
    console.error("[admin/gatherings] image upload failed");
    return NextResponse.json({ error: "Could not upload image." }, { status: 500 });
  }
  const { data: pub } = admin.storage.from(SITE_IMAGES_BUCKET).getPublicUrl(storagePath);

  const { count } = await admin
    .from("gatherings")
    .select("id", { count: "exact", head: true })
    .eq("surface", surface);

  const { data: row, error: insertError } = await admin
    .from("gatherings")
    .insert({
      slug,
      title,
      category,
      organiser,
      area,
      date_label: dateLabel,
      time_label: timeLabel,
      price_label: priceLabel,
      going,
      attendee_names: attendeeNames,
      verified,
      image_url: pub.publicUrl,
      description,
      display_order: count ?? 0,
      is_published: isPublished,
      surface,
      updated_by: session.userId,
    })
    .select("*")
    .maybeSingle();

  if (insertError || !row) {
    console.error("[admin/gatherings] insert failed");
    return NextResponse.json({ error: "Could not create gathering." }, { status: 500 });
  }

  for (const path of pathsForPageKey(surface === "app" ? "app-explore" : "explore")) revalidatePath(path);

  return NextResponse.json({ gathering: row });
}
