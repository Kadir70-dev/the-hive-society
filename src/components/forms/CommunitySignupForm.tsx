"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

const EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Fujairah",
  "Umm Al Quwain",
  "Other / Outside UAE",
];

const INTERESTS = [
  "Coffee & Social Meetups",
  "Networking",
  "Professional Community",
  "Wellness & Lifestyle",
  "Workshops",
  "Events & Gatherings",
  "Other",
];

interface CommunitySignupFormProps {
  onClose?: () => void;
}

export function CommunitySignupForm({ onClose }: CommunitySignupFormProps = {}) {
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/community-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          mobile: formData.get("mobile"),
          emirate: formData.get("emirate"),
          area: formData.get("area"),
          interests: formData.getAll("interests"),
          heardFrom: formData.get("heardFrom"),
          message: formData.get("message"),
          consent,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (submitted) {
    return (
      <div className="success-panel">
        <div className="hex hex--lg">✓</div>
        <h3 className="h3">Thank you! Your interest has been registered.</h3>
        <p className="text-2 small">
          Our team will review your details and may contact you with relevant community updates
          or invitations.
        </p>
        {onClose && (
          <button type="button" className="btn btn--outline" onClick={onClose} style={{ marginTop: 8 }}>
            Done
          </button>
        )}
      </div>
    );
  }

  return (
    <form className="form-grid" style={{ gap: 22 }} onSubmit={handleSubmit}>
      <div className="form-grid cols-2">
        <div className="field">
          <label htmlFor="csName">
            Full name<span className="req" aria-hidden="true">*</span>
          </label>
          <input id="csName" name="fullName" autoComplete="name" required placeholder="Fatima Al Mansoori" />
        </div>
        <div className="field">
          <label htmlFor="csEmail">
            Email<span className="req" aria-hidden="true">*</span>
          </label>
          <input id="csEmail" name="email" type="email" autoComplete="email" required placeholder="you@email.com" />
        </div>
      </div>
      <div className="form-grid cols-2">
        <div className="field">
          <label htmlFor="csMobile">
            WhatsApp / mobile number<span className="req" aria-hidden="true">*</span>
          </label>
          <input
            id="csMobile"
            name="mobile"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="+971"
          />
        </div>
        <div className="field">
          <label htmlFor="csEmirate">
            Emirate<span className="req" aria-hidden="true">*</span>
          </label>
          <select id="csEmirate" name="emirate" required defaultValue="">
            <option value="" disabled>
              Select your Emirate
            </option>
            {EMIRATES.map((emirate) => (
              <option key={emirate}>{emirate}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="csArea">Area / city (optional)</label>
        <input id="csArea" name="area" placeholder="e.g. Al Reem, Jumeirah" />
      </div>
      <fieldset className="field">
        <legend>Interests (optional)</legend>
        <div className="checkchip-group">
          {INTERESTS.map((interest) => (
            <label className="chip" key={interest}>
              <input type="checkbox" name="interests" value={interest} className="sr-only" />
              {interest}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="form-grid cols-2">
        <div className="field">
          <label htmlFor="csHeard">How did you hear about us? (optional)</label>
          <input id="csHeard" name="heardFrom" placeholder="Instagram, a friend..." />
        </div>
      </div>
      <div className="field">
        <label htmlFor="csMessage">What are you looking for from the community? (optional)</label>
        <textarea id="csMessage" name="message" placeholder="Tell us what you're hoping to find here" />
      </div>

      <label className="field" style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
        <input
          type="checkbox"
          name="consent"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          style={{ marginTop: 3 }}
        />
        <span className="small text-2">
          I agree that The Hive Society may contact me about community updates, launch updates,
          gatherings, events and relevant WhatsApp community invitations. I can unsubscribe or
          request deletion of my information at any time. Read our{" "}
          <Link href="/privacy" style={{ color: "var(--accent-deep)", fontWeight: 600 }}>
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      <p className="field-hint" style={{ textAlign: "center" }}>
        Community invitations are shared after a brief review to help us keep the space relevant
        and comfortable for women joining The Hive Society.
      </p>

      {status === "error" && (
        <p className="small" role="alert" style={{ color: "#b3261e" }}>
          {error}
        </p>
      )}

      <button
        className="btn btn--primary btn--block"
        type="submit"
        disabled={!consent || status === "submitting"}
      >
        {status === "submitting" ? "Submitting…" : "Join the Community"}
      </button>
    </form>
  );
}
