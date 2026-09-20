import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/session";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { pathsForPageKey } from "@/lib/content/pagePaths";
import { pageKeyForContentKey } from "@/lib/content/keys";

// Hyphens are allowed because content-key prefixes mirror page keys like
// "app-explore" (see PAGE_PATHS in src/lib/content/pagePaths.ts and
// pageKeyForContentKey in src/lib/content/keys.ts) — e.g. AppHero.tsx's
// "app-explore.hero.tag" was always a legal key, just rejected here.
const KEY_RE = /^[a-z0-9_-]+(\.[a-z0-9_-]+)+$/i;

// Bearer-token auth (see requireAdminSession) makes this safe to open up:
// unlike a cookie, a bearer token is never sent automatically by the browser
// to a third-party origin, so a permissive origin here can't be used for
// cross-site request forgery. Lets the Expo app's web build (and any other
// non-browser client) call this directly. Admin authorization itself is
// unaffected — still enforced by requireAdminSession() below.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function PATCH(req: NextRequest) {
  let session;
  try {
    session = await requireAdminSession(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: CORS_HEADERS });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const key = typeof body.key === "string" ? body.key.trim() : "";
  const value = typeof body.value === "string" ? body.value.trim() : "";

  if (!key || !KEY_RE.test(key)) {
    return NextResponse.json({ error: "Invalid content key." }, { status: 400, headers: CORS_HEADERS });
  }
  if (value.length > 5000) {
    return NextResponse.json({ error: "That's too long to save." }, { status: 400, headers: CORS_HEADERS });
  }

  const admin = getSupabaseAdmin();
  const pageKey = pageKeyForContentKey(key);

  const { data, error } = await admin
    .from("site_content")
    .upsert(
      { content_key: key, page_key: pageKey, value, updated_by: session.userId },
      { onConflict: "content_key" }
    )
    .select("content_key, value")
    .maybeSingle();

  if (error || !data) {
    console.error("[admin/content] upsert failed");
    return NextResponse.json({ error: "Could not save this change." }, { status: 500, headers: CORS_HEADERS });
  }

  for (const path of pathsForPageKey(pageKey)) {
    revalidatePath(path);
  }

  return NextResponse.json({ contentKey: data.content_key, value: data.value }, { headers: CORS_HEADERS });
}
