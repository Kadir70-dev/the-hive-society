"use client";

import { useState, type FormEvent } from "react";

const AREAS = ["Saadiyat", "Al Reem", "Yas", "Al Bateen", "Khalifa City", "Al Raha", "Corniche", "Al Maryah", "Hudayriyat", "Other"];
const INTERESTS = ["Wellness", "Active", "Creative", "Social"];

export function MembershipWaitlistForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Static prototype flow — replace with a server action / API call when a backend exists.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="success-panel">
        <div className="hex hex--lg">✓</div>
        <h3 className="h3">You&rsquo;re on the list.</h3>
        <p className="text-2 small">
          We&rsquo;ll be in touch as membership opens — thank you for helping shape the Hive.
        </p>
      </div>
    );
  }

  return (
    <form className="form-grid" noValidate onSubmit={handleSubmit}>
      <div className="form-grid cols-2">
        <div className="field">
          <label htmlFor="wFirst">First name</label>
          <input id="wFirst" name="firstName" required placeholder="Fatima" />
        </div>
        <div className="field">
          <label htmlFor="wEmail">Email</label>
          <input id="wEmail" name="email" type="email" required placeholder="you@email.com" />
        </div>
      </div>
      <div className="form-grid cols-2">
        <div className="field">
          <label htmlFor="wMobile">Mobile</label>
          <input id="wMobile" name="mobile" type="tel" placeholder="+971" />
        </div>
        <div className="field">
          <label htmlFor="wLocation">Location</label>
          <select id="wLocation" name="location">
            {AREAS.map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label>Interests</label>
        <div className="checkchip-group">
          {INTERESTS.map((interest) => (
            <label className="chip" key={interest}>
              <input type="checkbox" name="interests" value={interest} className="sr-only" />
              {interest}
            </label>
          ))}
        </div>
      </div>
      <button className="btn btn--primary btn--block" type="submit">
        Join Membership Waitlist
      </button>
    </form>
  );
}
