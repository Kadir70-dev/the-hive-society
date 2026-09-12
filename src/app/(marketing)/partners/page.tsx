import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "Reach women across Abu Dhabi through gatherings and brand experiences.",
};

const WHO_WE_PARTNER_WITH = [
  "Wellness brands",
  "Banks",
  "Retailers",
  "Hotels & venues",
  "Studios",
  "Corporate partners",
  "Government & community organisations",
];

const OPPORTUNITIES = [
  { title: "Sponsored gatherings", desc: "Put your brand behind an experience women already want." },
  { title: "Ladies Days", desc: "Curated days built around your venue or product." },
  { title: "Community series", desc: "A recurring presence across several gatherings." },
  { title: "Member benefits", desc: "Offer perks directly to Hive members." },
  { title: "Venue partnerships", desc: "Host Hive gatherings at your space." },
  { title: "Corporate wellness", desc: "Bring the Hive experience to your team." },
];

export default function PartnersPage() {
  return (
    <>
      <div className="page-hero hex-texture">
        <div className="container stack gap-14">
          <span className="eyebrow">Partners</span>
          <h1 className="h1" style={{ fontSize: "clamp(2rem,4vw + .4rem,3.2rem)" }}>
            Partner with The Hive Society.
          </h1>
          <p className="lede" style={{ color: "var(--on-dark-2)", maxWidth: "58ch" }}>
            Reach women across Abu Dhabi through gatherings and brand experiences.
          </p>
          <Link href="/contact" className="btn btn--on-dark">Partner With Us</Link>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <span className="eyebrow">Who We Partner With</span>
          <h2 className="h2" style={{ margin: "14px 0 28px" }}>
            Brands, venues and organisations building trust with women in the UAE.
          </h2>
          <div className="pill-row">
            {WHO_WE_PARTNER_WITH.map((who) => (
              <span className="area-chip" key={who}>{who}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="section section--alt">
        <div className="container">
          <span className="eyebrow">Partnership Opportunities</span>
          <h2 className="h2" style={{ margin: "14px 0 28px" }}>Ways to show up for the Hive community.</h2>
          <div className="grid grid-3">
            {OPPORTUNITIES.map((o) => (
              <div className="card stack gap-8" style={{ padding: 24 }} key={o.title}>
                <h3 className="h3" style={{ fontSize: "1.05rem" }}>{o.title}</h3>
                <p className="small text-2">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="cta-banner hex-texture">
            <h2 className="h2">Let&rsquo;s build something together.</h2>
            <Link href="/contact" className="btn btn--on-dark" style={{ marginTop: 20 }}>
              Contact the Partnerships Team
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
