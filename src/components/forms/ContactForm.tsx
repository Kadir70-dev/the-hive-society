"use client";

import { useState, type FormEvent } from "react";

const CATEGORIES = ["General enquiries", "Membership", "Organiser enquiries", "Partnerships", "Media", "Support"];

export function ContactForm() {
  const [category, setCategory] = useState(CATEGORIES[0]);
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
        <h3 className="h3">Message sent.</h3>
        <p className="text-2 small">Thank you — our team will reply soon.</p>
      </div>
    );
  }

  return (
    <>
      <div className="pill-row" style={{ marginBottom: 20 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`chip${category === c ? " is-active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <form className="form-grid" noValidate onSubmit={handleSubmit}>
        <div className="form-grid cols-2">
          <div className="field">
            <label htmlFor="cName">Name</label>
            <input id="cName" name="name" required />
          </div>
          <div className="field">
            <label htmlFor="cEmail">Email</label>
            <input id="cEmail" name="email" type="email" required />
          </div>
        </div>
        <div className="form-grid cols-2">
          <div className="field">
            <label htmlFor="cPhone">Phone</label>
            <input id="cPhone" name="phone" type="tel" />
          </div>
          <div className="field">
            <label htmlFor="cSubject">Subject</label>
            <input id="cSubject" name="subject" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="cMessage">Message</label>
          <textarea id="cMessage" name="message" />
        </div>
        <button className="btn btn--primary btn--block" type="submit">
          Send Message
        </button>
      </form>
    </>
  );
}
