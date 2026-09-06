import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export interface AdminSession {
  userId: string;
  email: string;
  role: "admin" | "superadmin";
}

/**
 * Resolves the current request to an authorized admin, or null.
 *
 * Two independent checks, both required: (1) a valid Supabase Auth session
 * (authentication), and (2) an active row in admin_users for that user
 * (authorization). A Supabase account by itself never grants admin access —
 * see supabase/migrations/0001_community_applications.sql.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const admin = getSupabaseAdmin();
  const { data: adminRow } = await admin
    .from("admin_users")
    .select("role, is_active, email")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!adminRow) return null;

  return { userId: user.id, email: adminRow.email, role: adminRow.role };
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}
