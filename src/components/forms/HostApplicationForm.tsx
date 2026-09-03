"use client";

import { useState, type FormEvent } from "react";

const ACTIVITY_TYPES = ["Move", "Gather", "Learn", "Celebrate", "Unwind", "Explore"];
const AREAS = ["Saadiyat", "Al Reem", "Yas", "Al Bateen", "Khalifa City", "Al Raha", "Corniche", "Al Maryah", "Hudayriyat"];

export function HostApplicationForm() {
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
        <h3 className="h3">Thank you.</h3>
        <p className="text-2 small">We&rsquo;ll be in touch.</p>
      </div>
    );
  }

  return (
    <form className="form-grid" noValidate onSubmit={handleSubmit}>
      <div className="form-grid cols-2">
        <div className="field">
          <label htmlFor="hName">Name</label>
          <input id="hName" name="name" required />
        </div>
        <div className="field">
          <label htmlFor="hBiz">Business / organisation</label>
          <input id="hBiz" name="business" />
        </div>
      </div>
      <div className="form-grid cols-2">
        <div className="field">
          <label htmlFor="hEmail">Email</label>
          <input id="hEmail" name="email" type="email" required />
        </div>
        <div className="field">
          <label htmlFor="hMobile">Mobile</label>
          <input id="hMobile" name="mobile" type="tel" />
        </div>
      </div>
      <div className="form-grid cols-2">
        <div className="field">
          <label htmlFor="hSocial">Instagram / website</label>
          <input id="hSocial" name="social" />
        </div>
        <div className="field">
          <label htmlFor="hType">Type of activity</label>
          <select id="hType" name="activityType">
            {ACTIVITY_TYPES.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-grid cols-2">
        <div className="field">
          <label htmlFor="hArea">Location</label>
          <select id="hArea" name="area">
            {AREAS.map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="hGroup">Typical group size</label>
          <input id="hGroup" name="groupSize" placeholder="e.g. 8–15" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="hDesc">Description</label>
        <textarea id="hDesc" name="description" placeholder="What will women experience?" />
      </div>
      <div className="form-grid cols-2">
        <div className="field">
          <label htmlFor="hPrice">Price range</label>
          <input id="hPrice" name="priceRange" placeholder="e.g. AED 80–150" />
        </div>
        <div className="field">
          <label htmlFor="hWhy">Why host with Hive?</label>
          <input id="hWhy" name="why" />
        </div>
      </div>
      <button className="btn btn--primary btn--block" type="submit">
        Apply to Host
      </button>
    </form>
  );
}
