import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "./env";

/**
 * Privileged Supabase client using the service-role key. Bypasses Row Level
 * Security entirely — this must only ever be imported from server-only code
 * (route handlers, server components, middleware), never from a "use client"
 * file or anything that ends up in a browser bundle. The `server-only`
 * import above makes any accidental client-side import a build-time error.
 */
export function getSupabaseAdmin() {
  return createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
