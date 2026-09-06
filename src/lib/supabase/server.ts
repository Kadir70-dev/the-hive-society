import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";

/**
 * Anon-key Supabase client bound to the current request's cookies. Used only
 * to read/refresh the visitor's own auth session (supabase.auth.getUser()) in
 * Server Components and Route Handlers — never to query application data,
 * since RLS denies this role on every table.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component render where cookies can't be
          // mutated; middleware handles session refresh in that case.
        }
      },
    },
  });
}
