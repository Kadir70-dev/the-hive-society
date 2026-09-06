"use client";

import { useState, type FormEvent } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
          // Admin accounts are provisioned by inviting the user in the Supabase
          // Auth dashboard first — never auto-create an account from this form.
          shouldCreateUser: false,
        },
      });

      // Always show the same "sent" response whether or not the email is a
      // known admin account — this endpoint must not reveal which emails
      // are authorized (avoids account enumeration).
      setStatus("sent");
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="stack gap-8">
        <div className="hex hex--lg">✓</div>
        <p className="text-2 small">
          If <strong>{email}</strong> is an authorized admin address, a sign-in link is on its way.
          Check your inbox.
        </p>
      </div>
    );
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="adminEmail">Email</label>
        <input
          id="adminEmail"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@thehivesociety.ae"
        />
      </div>
      {status === "error" && (
        <p className="small" role="alert" style={{ color: "#b3261e" }}>
          {error}
        </p>
      )}
      <button className="btn btn--primary btn--block" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send sign-in link"}
      </button>
    </form>
  );
}
