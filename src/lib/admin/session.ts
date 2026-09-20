import "server-only";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export interface AdminSession {
  userId: string;
  email: string;
  role: "admin" | "superadmin";
}

/**
 * Resolves the caller's Supabase Auth user id, from either of two sources:
 *  - the request's own cookies (the website itself — every existing caller,
 *    unchanged behavior).
 *  - an `Authorization: Bearer <access_token>` header (a non-browser client
 *    that can't hold a same-site cookie, e.g. the Expo app's CMS sign-in —
 *    see hive-society-app's src/services/content/cmsAuth.ts).
 * Bearer token validation uses the anon-key client's auth.getUser(token),
 * which verifies the JWT itself — no service-role access needed for this
 * step. `req` is optional so existing Server Component callers (which have
 * no request object) keep working exactly as before, cookie-only.
 */
async function resolveAuthUserId(req?: NextRequest): Promise<string | null> {
  const bearer = req?.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (bearer) {
    const anon = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await anon.auth.getUser(bearer);
    if (error || !data.user) return null;
    return data.user.id;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/**
 * Resolves the current request to an authorized admin, or null.
 *
 * Two independent checks, both required: (1) a valid Supabase Auth identity
 * — cookie or Bearer token, see resolveAuthUserId (authentication), and (2)
 * an active row in admin_users for that user (authorization). A Supabase
 * account by itself never grants admin access — see
 * supabase/migrations/0001_community_applications.sql.
 */
export async function getAdminSession(req?: NextRequest): Promise<AdminSession | null> {
  const userId = await resolveAuthUserId(req);
  if (!userId) return null;

  const admin = getSupabaseAdmin();
  const { data: adminRow } = await admin
    .from("admin_users")
    .select("role, is_active, email")
    .eq("user_id", userId)
    .eq("is_active", true)
    .maybeSingle();

  if (!adminRow) return null;

  return { userId, email: adminRow.email, role: adminRow.role };
}

export async function requireAdminSession(req?: NextRequest): Promise<AdminSession> {
  const session = await getAdminSession(req);
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}
