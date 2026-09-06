"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Fallback for the implicit auth flow, where Supabase returns the session as
 * an access_token/refresh_token pair in the URL fragment instead of a `?code`
 * (fragments never reach the server, so /admin/auth/callback's route handler
 * can't see them — this has to run client-side). The normal signInWithOtp
 * call in LoginForm uses PKCE, which the server callback route already
 * handles; this only kicks in if a link ever comes back in the older format.
 *
 * Always renders `children` on the first (server-matching) render — the hash
 * is only readable client-side, so checking it can't happen until after
 * hydration without causing a server/client markup mismatch.
 */
export function AuthHashHandler({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!window.location.hash.includes("access_token")) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPending(true);

    const params = new URLSearchParams(window.location.hash.slice(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      setFailed(true);
      return;
    }

    createSupabaseBrowserClient()
      .auth.setSession({ access_token, refresh_token })
      .then(({ error }) => {
        if (error) {
          setFailed(true);
          return;
        }
        window.history.replaceState(null, "", window.location.pathname);
        router.replace("/admin/community");
      });
  }, [router]);

  if (pending && !failed) {
    return (
      <p className="small text-2" role="status">
        Signing you in…
      </p>
    );
  }

  return <>{children}</>;
}
