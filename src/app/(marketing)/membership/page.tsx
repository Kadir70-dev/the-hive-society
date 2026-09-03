import Link from "next/link";
import type { Metadata } from "next";
import { MembershipWaitlistForm } from "@/components/forms/MembershipWaitlistForm";
import { membershipComparisonRows, membershipFaqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Membership",
  description: "More than access. A place to belong. Hive Membership is built around priority, curation and belonging.",
};

export default function MembershipPage() {
  return (
    <>
      <div className="page-hero hex-texture">
        <div className="container stack gap-14">
          <span className="eyebrow">Membership</span>
          <h1 className="h1" style={{ fontSize: "clamp(2rem,4vw + .4rem,3.2rem)" }}>
            More than access.
            <br />
            A place to belong.
          </h1>
          <p className="lede" style={{ color: "var(--on-dark-2)", maxWidth: "60ch" }}>
            Hive Membership is built around priority, curation and belonging — not a paywall
            between you and the community.
          </p>
          <span className="tag-proposed" style={{ alignSelf: "flex-start" }}>
            Pricing not yet confirmed — join the waitlist for founding member benefits
          </span>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="grid grid-2">
            <div className="card stack gap-14" style={{ padding: 32 }}>
              <span className="eyebrow">Community Access</span>
              <h3 className="h3">Hive Community</h3>
              <p className="text-2 small">Everything you need to start exploring and meeting people, free.</p>
              <ul className="stack gap-10" style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
                <li className="small">✓ Discover experiences</li>
                <li className="small">✓ Join community circles</li>
                <li className="small">✓ Save activities</li>
                <li className="small">✓ Standard booking access</li>
              </ul>
              <Link href="/explore" className="btn btn--outline" style={{ alignSelf: "flex-start", marginTop: 8 }}>
                Start Exploring
              </Link>
            </div>
            <div className="card stack gap-14" style={{ padding: 32, borderColor: "var(--accent-deep)", position: "relative" }}>
              <span className="tag-proposed" style={{ position: "absolute", top: 20, right: 20 }}>Proposed</span>
              <span className="eyebrow">Premium Tier</span>
              <h3 className="h3">Hive Membership</h3>
              <p className="text-2 small">
                Priority and curation for women who want to make the most of every season. Price
                to be announced.
              </p>
              <ul className="stack gap-10" style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
                <li className="small">✓ Everything in Hive Community</li>
                <li className="small">✓ Early access to selected gatherings</li>
                <li className="small">✓ Priority booking</li>
                <li className="small">✓ Member-only experiences &amp; circles</li>
                <li className="small">✓ Partner benefits &amp; seasonal offers</li>
              </ul>
              <a href="#waitlist-form" className="btn btn--primary" style={{ alignSelf: "flex-start", marginTop: 8 }}>
                Join Membership Waitlist
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="section section--alt">
        <div className="container">
          <h2 className="h2" style={{ marginBottom: 24 }}>Compare what&rsquo;s included.</h2>
          <div className="table-wrap">
            <table className="compare">
              <thead>
                <tr>
                  <th>Included</th>
                  <th style={{ textAlign: "center" }}>Community</th>
                  <th style={{ textAlign: "center" }}>Membership</th>
                </tr>
              </thead>
              <tbody>
                {membershipComparisonRows.map((row) => (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    <td className={row.community ? "ck" : "dash"}>{row.community ? "✓" : "—"}</td>
                    <td className={row.membership ? "ck" : "dash"}>{row.membership ? "✓" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small text-3" style={{ marginTop: 14 }}>
            Benefits shown for the Membership tier are proposed and subject to change before
            public launch.
          </p>
        </div>
      </div>

      <div className="section" id="waitlist-form">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: "flex-start" }}>
            <div className="stack gap-16">
              <span className="eyebrow">Register Interest</span>
              <h2 className="h2">Join the membership waitlist.</h2>
              <p className="text-2">
                Be first to know when Hive Membership opens — and lock in founding member
                benefits.
              </p>
            </div>
            <div className="card" style={{ padding: 30 }}>
              <MembershipWaitlistForm />
            </div>
          </div>
        </div>
      </div>

      <div className="section section--alt">
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 className="h2" style={{ marginBottom: 8 }}>Membership questions.</h2>
          <div className="faq">
            {membershipFaqs.map((faq) => (
              <details className="faq-item" key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
