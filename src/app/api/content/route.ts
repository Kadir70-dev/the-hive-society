import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { SITE_IMAGES_BUCKET } from "@/lib/content/getPageMedia";

/**
 * Public, read-only CMS content endpoint.
 *
 * RLS on site_content/site_media denies the anon key entirely (see
 * supabase/migrations/0002_site_cms.sql) — every existing read in this
 * codebase (getPageContent/getPageMedia) goes through the service-role key
 * from Next.js Server Components, which a non-Next.js client (the React
 * Native / Expo app) cannot do safely. This route is the one place that
 * exposes *published* content over plain HTTP so an external client can read
 * it without ever holding a Supabase credential of any kind. It never
 * returns unpublished site_content rows, and it never touches any table
 * outside site_content/site_media (no member, payment, or booking data is
 * reachable here).
 *
 * GET /api/content?keys=native-home.hero.title,native-home.hero.subtitle
 * GET /api/content?prefix=native-home.
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

interface ContentEntryPayload {
  key: string;
  kind: "text" | "richtext" | "cta" | "image";
  value: { text?: string; imageUrl?: string; altText?: string };
  updatedAt: string;
  updatedBy: string | null;
  version: number;
}

function contentTypeToKind(contentType: string): "text" | "richtext" | "cta" {
  if (contentType === "rich_text") return "richtext";
  if (contentType === "button") return "cta";
  return "text";
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keysParam = searchParams.get("keys");
  const prefix = searchParams.get("prefix");
  const keys = keysParam
    ? keysParam
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean)
    : null;

  if (!keys?.length && !prefix) {
    return NextResponse.json(
      { error: "Provide a `keys` (comma-separated) or `prefix` query parameter." },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const supabase = getSupabaseAdmin();
  const entries: ContentEntryPayload[] = [];

  try {
    let contentQuery = supabase
      .from("site_content")
      .select("content_key, content_type, value, updated_at")
      .eq("is_published", true);
    let mediaQuery = supabase
      .from("site_media")
      .select("media_key, storage_path, alt_text, updated_at");

    if (keys?.length) {
      contentQuery = contentQuery.in("content_key", keys);
      mediaQuery = mediaQuery.in("media_key", keys);
    } else if (prefix) {
      contentQuery = contentQuery.like("content_key", `${prefix}%`);
      mediaQuery = mediaQuery.like("media_key", `${prefix}%`);
    }

    const [{ data: content, error: contentError }, { data: media, error: mediaError }] =
      await Promise.all([contentQuery, mediaQuery]);

    if (contentError || mediaError) {
      return NextResponse.json(
        { error: "Could not load content." },
        { status: 502, headers: CORS_HEADERS }
      );
    }

    for (const row of content ?? []) {
      entries.push({
        key: row.content_key,
        kind: contentTypeToKind(row.content_type),
        value: { text: row.value },
        updatedAt: row.updated_at,
        updatedBy: null,
        version: 1,
      });
    }

    for (const row of media ?? []) {
      if (!row.storage_path) continue;
      const { data: pub } = supabase.storage.from(SITE_IMAGES_BUCKET).getPublicUrl(row.storage_path);
      entries.push({
        key: row.media_key,
        kind: "image",
        value: { imageUrl: pub.publicUrl, altText: row.alt_text ?? undefined },
        updatedAt: row.updated_at,
        updatedBy: null,
        version: 1,
      });
    }
  } catch {
    return NextResponse.json({ error: "Could not load content." }, { status: 502, headers: CORS_HEADERS });
  }

  return NextResponse.json({ entries }, { headers: CORS_HEADERS });
}
