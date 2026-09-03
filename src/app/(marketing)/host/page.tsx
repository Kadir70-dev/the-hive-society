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

export default function HostPage() {
  return (
    <>
      <div className="page-hero hex-texture">
        <div className="container stack gap-14">
          <span className="eyebrow">Host an Activity</span>
          <h1 className="h1" style={{ fontSize: "clamp(2rem,4vw + .4rem,3.2rem)" }}>
            Bring people together.
          </h1>
          <p className="lede" style={{ color: "var(--on-dark-2)", maxWidth: "56ch" }}>
            Host what you love. Build your community. Reach women across Abu Dhabi who are ready
            to show up.
          </p>
          <a href="#host-form" className="btn btn--on-dark">Apply to Host</a>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <span className="eyebrow">Who Can Host</span>
          <h2 className="h2" style={{ margin: "14px 0 28px" }}>If you bring people together, you belong here.</h2>
          <div className="pill-row">
            {WHO_CAN_HOST.map((who) => (
              <span className="area-chip" key={who}>{who}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="section section--alt">
        <div className="container">
          <span className="eyebrow">Why Host With Hive</span>
          <h2 className="h2" style={{ margin: "14px 0 28px" }}>Everything you need to fill the room.</h2>
          <div className="grid grid-4">
            {BENEFITS.map((b) => (
              <div className="icon-tile stack gap-10" key={b.title}>
                <div className="hex">◆</div>
                <h3 className="h3" style={{ fontSize: "1rem" }}>{b.title}</h3>
                <p className="small text-2">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="grid grid-3">
            <div className="step" style={{ flexDirection: "column", gap: 14 }}>
              <div className="hex hex--lg">01</div>
              <h3 className="h3" style={{ fontSize: "1.1rem" }}>Apply</h3>
              <p className="small text-2">Tell us about you and what you host.</p>
            </div>
            <div className="step" style={{ flexDirection: "column", gap: 14 }}>
              <div className="hex hex--lg">02</div>
              <h3 className="h3" style={{ fontSize: "1.1rem" }}>Get verified</h3>
              <p className="small text-2">We review every host before they go live.</p>
            </div>
            <div className="step" style={{ flexDirection: "column", gap: 14 }}>
              <div className="hex hex--lg">03</div>
              <h3 className="h3" style={{ fontSize: "1.1rem" }}>Go live</h3>
              <p className="small text-2">Publish your first gathering and start filling seats.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section section--alt" id="host-form">
        <div className="container" style={{ maxWidth: 760 }}>
          <span className="eyebrow">Apply to Host</span>
          <h2 className="h2" style={{ margin: "14px 0 28px" }}>Tell us about what you&rsquo;d like to host.</h2>
          <div className="card" style={{ padding: 30 }}>
            <HostApplicationForm />
          </div>
        </div>
      </div>
    </>
  );
}
