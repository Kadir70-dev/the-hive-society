import type { Metadata } from "next";
import { HostApplicationForm } from "@/components/forms/HostApplicationForm";

export const metadata: Metadata = {
  title: "Host an Activity",
  description: "Host what you love. Build your community. Reach women across Abu Dhabi who are ready to show up.",
};

const WHO_CAN_HOST = [
  "Studios",
  "Coaches",
  "Wellness professionals",
  "Creative instructors",
  "Community leaders",
  "Small businesses",
  "Independent hosts",
  "Event organisers",
];

const BENEFITS = [
  { title: "Discovery", desc: "Get found by women actively looking for what you offer." },
  { title: "Bookings", desc: "Simple reservations, no chasing payments manually." },
  { title: "Community", desc: "Build a following that returns gathering after gathering." },
  { title: "Partnerships", desc: "Access to brand and venue opportunities as you grow." },
];

const STEPS = [
  { title: "Apply", desc: "Tell us about you and what you host." },
  { title: "Get verified", desc: "We review every host before they go live." },
  { title: "Go live", desc: "Publish your first gathering and start filling seats." },
];

export default function HostPage() {
  return (
    <>
      <section className="j-pagehero j-pagehero--maroon j-on-dark">
        <div className="j-wrap">
          <span className="j-label">Host an Activity</span>
          <h1 className="j-display j-pagehero__title">Bring people together.</h1>
          <p className="j-lede j-pagehero__lede">
            Host what you love. Build your community. Reach women across Abu Dhabi who are ready
            to show up.
          </p>
          <div className="j-pagehero__actions">
            <a href="#host-form" className="btn btn--primary">Apply to Host</a>
          </div>
        </div>
      </section>

      <section className="j-section jc-who">
        <div className="j-wrap jc-split">
          <div>
            <span className="j-label">Who Can Host</span>
            <h2 className="j-display j-h2">If you bring people together, you belong here.</h2>
            <p className="jc-note">Hosting a gathering requires an active Hive Membership.</p>
          </div>
          <ul className="jc-who__list">
            {WHO_CAN_HOST.map((who) => (
              <li key={who}>{who}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="j-section section--dark jc-why">
        <div className="j-wrap">
          <span className="j-label">Why Host With Hive</span>
          <h2 className="j-display j-h2">Everything you need to fill the room.</h2>
          <div className="jc-why__rows">
            {BENEFITS.map((b) => (
              <div className="jc-why__row" key={b.title}>
                <h3 className="j-display">{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="j-section jc-steps">
        <div className="j-wrap">
          <ol className="jc-steps__list">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span className="jc-steps__n" aria-hidden="true">0{i + 1}</span>
                <h3 className="j-display">{step.title}</h3>
                <p>{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="j-section jc-apply" id="host-form">
        <div className="j-wrap jc-split">
          <div>
            <span className="j-label">Apply to Host</span>
            <h2 className="j-display j-h2">Tell us about what you&rsquo;d like to host.</h2>
          </div>
          <div className="jc-apply__form">
            <HostApplicationForm />
          </div>
        </div>
      </section>
    </>
  );
}
