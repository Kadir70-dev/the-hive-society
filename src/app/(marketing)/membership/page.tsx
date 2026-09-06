import Link from "next/link";
import type { Metadata } from "next";
import { CommunitySignupForm } from "@/components/forms/CommunitySignupForm";
import { membershipFaqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "Join the Community",
  description:
    "Join The Hive Society's early UAE community and stay connected for gatherings, meetups, events and launch updates.",
};

export default function MembershipPage() {
  return (
    <>
      <div className="masthead section--dark hex-texture">
        <div className="container">
          <div className="split split--60-40" style={{ alignItems: "center" }}>
            <div className="stack gap-14">
              <span className="eyebrow">Join the Community</span>
              <h1 className="h1" style={{ fontSize: "clamp(2rem,4vw + .4rem,3.2rem)" }}>
                Be part of it from day one.
              </h1>
              <p className="lede">
                Stay connected for gatherings, meetups, events and launch updates.
              </p>
            </div>
            <span className="tag-proposed" style={{ justifySelf: "start" }}>
              Pre-launch — paid membership is proposed for later and not yet available
            </span>
          </div>
        </div>
      </div>

      <div className="section section--intimate hex-texture hex-texture--light" id="join-form">
        <div className="container">
          <div className="card popup-card">
            <div className="stack gap-6" style={{ textAlign: "center", marginBottom: 22 }}>
              <h2 className="h3">Join the Community</h2>
              <p className="text-2 small">
                Tell us a little about you — we&rsquo;ll follow up with relevant updates and
                invitations.
              </p>
            </div>
            <CommunitySignupForm />
          </div>
        </div>
      </div>

      <div className="section section--alt hex-texture hex-texture--light">
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
            <div className="card card--warm stack gap-14" style={{ padding: 32, borderColor: "var(--accent-deep)" }}>
              <span className="eyebrow">Premium Tier · Proposed</span>
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
              <a href="#join-form" className="btn btn--primary" style={{ alignSelf: "flex-start", marginTop: 8 }}>
                Join the Community
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="section hex-texture hex-texture--light">
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
