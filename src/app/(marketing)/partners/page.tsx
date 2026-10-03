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
      <section className="j-pagehero j-pagehero--maroon j-on-dark">
        <div className="j-wrap">
          <span className="j-label">Partners</span>
          <h1 className="j-display j-pagehero__title je-title-long">Partner with The Hive Society.</h1>
          <p className="j-lede j-pagehero__lede">Reach women across Abu Dhabi through gatherings and brand experiences.</p>
          <div className="j-pagehero__actions">
            <Link href="/contact" className="btn btn--primary">Partner With Us</Link>
          </div>
        </div>
      </section>

      <section className="j-section jc-who">
        <div className="j-wrap jc-split">
          <div>
            <span className="j-label">Who We Partner With</span>
            <h2 className="j-display j-h2">Brands, venues and organisations building trust with women in the UAE.</h2>
          </div>
          <ul className="jc-who__list">
            {WHO_WE_PARTNER_WITH.map((who) => (
              <li key={who}>{who}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="j-section section--dark jc-why">
        <div className="j-wrap">
          <span className="j-label">Partnership Opportunities</span>
          <h2 className="j-display j-h2">Ways to show up for the Hive community.</h2>
          <div className="jc-why__rows">
            {OPPORTUNITIES.map((o) => (
              <div className="jc-why__row" key={o.title}>
                <h3 className="j-display">{o.title}</h3>
                <p>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="je-cta">
        <div className="j-wrap je-cta__inner">
          <h2 className="j-display je-cta__title">Let&rsquo;s build something together.</h2>
          <div className="je-cta__actions">
            <Link href="/contact" className="j-btn j-btn--apricot">Contact the Partnerships Team</Link>
          </div>
        </div>
      </section>
    </>
  );
}
