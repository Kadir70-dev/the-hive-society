"use client";

import { useState, type FormEvent } from "react";

interface MembershipCheckoutFormProps {
  planKey: string;
  amountAed: number;
  ctaLabel?: string;
}

export function MembershipCheckoutForm({ planKey, amountAed, ctaLabel }: MembershipCheckoutFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/membership/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planKey,
          fullName: form.get("fullName"),
          email: form.get("email"),
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.redirectUrl) {
        setError(body?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      window.location.href = body.redirectUrl;
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <form className="stack gap-14" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor={`mcFullName-${planKey}`}>Full name</label>
        <input id={`mcFullName-${planKey}`} name="fullName" required maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor={`mcEmail-${planKey}`}>Email</label>
        <input id={`mcEmail-${planKey}`} name="email" type="email" required maxLength={200} />
      </div>

      {status === "error" && (
        <p className="small" role="alert" style={{ color: "#b3261e" }}>
          {error}
        </p>
      )}

      <button type="submit" className="btn btn--primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting…" : ctaLabel ?? `Join for AED ${amountAed}/mo`}
      </button>
    </form>
  );
}
