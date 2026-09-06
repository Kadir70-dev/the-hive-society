"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { usernameToEmail } from "@/lib/admin/username";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    // Generic error for both "unknown username" and "wrong password" —
    // never reveal which one, to avoid username enumeration.
    const invalidMessage = "Invalid username or password.";

    const email = usernameToEmail(username);
    if (!email) {
      setError(invalidMessage);
      setStatus("error");
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError(invalidMessage);
        setStatus("error");
        return;
      }

      router.push("/admin/community");
      router.refresh();
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="adminUsername">Username</label>
        <input
          id="adminUsername"
          type="text"
          required
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
        />
      </div>
      <div className="field">
        <label htmlFor="adminPassword">Password</label>
        <input
          id="adminPassword"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      {status === "error" && (
        <p className="small" role="alert" style={{ color: "#b3261e" }}>
          {error}
        </p>
      )}
      <button className="btn btn--primary btn--block" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
