import Link from "next/link";
import type { Metadata } from "next";
import { circles } from "@/data/circles";

export const metadata: Metadata = {
  title: "Community",
  description:
    "The Hive isn't just where you book an activity — it's where relationships and trusted circles grow.",
};

const recurring = [
  { name: "Coffee & Conversations", cadence: "Tuesdays, weekly" },
  { name: "Weekend Padel", cadence: "Saturdays, weekly" },
  { name: "Book Club", cadence: "First Thursday, monthly" },
  { name: "Outdoor Explorers", cadence: "Every other Friday" },
];

export default function CommunityPage() {
  return (
    <>
      <div className="page-hero hex-texture">
        <div className="container stack gap-14">
          <span className="eyebrow">Community</span>
          <h1 className="h1" style={{ fontSize: "clamp(2rem,4vw + .4rem,3.2rem)" }}>
            You come for a gathering.
            <br />
            You return for your Hive.
          </h1>
          <p className="lede" style={{ color: "var(--on-dark-2)" }}>
            The Hive isn&rsquo;t just where you book an activity — it&rsquo;s where relationships
            and trusted circles grow.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div
            className="row wrap gap-16"
            style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}
          >
            <div className="stack gap-14">
              <span className="eyebrow">Your Circles</span>
              <h2 className="h2">Community forms around what you love.</h2>
            </div>
            <span className="tag-proposed">Preview — sign in to see your circles</span>
          </div>
          <div className="grid grid-3">
            {circles.map((circle) => (
              <div className="circle-card stack gap-10" key={circle.slug}>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <h3 className="h3" style={{ fontSize: "1.05rem" }}>{circle.name}</h3>
                  <span className="tag-proposed">Preview</span>
                </div>
                <p className="small text-2">
                  {circle.members} women · {circle.cadence}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section section--alt">
        <div className="container">
          <div className="grid grid-3">
            <div className="stack gap-12" style={{ textAlign: "center" }}>
              <div className="hex hex--lg" style={{ margin: "0 auto" }}>01</div>
              <h3 className="h3" style={{ fontSize: "1.1rem" }}>Attend</h3>
              <p className="small text-2">Show up to a gathering that fits your mood.</p>
            </div>
            <div className="stack gap-12" style={{ textAlign: "center" }}>
              <div className="hex hex--lg" style={{ margin: "0 auto" }}>02</div>
              <h3 className="h3" style={{ fontSize: "1.1rem" }}>Reconnect</h3>
              <p className="small text-2">See familiar faces at the next one — and the one after that.</p>
            </div>
            <div className="stack gap-12" style={{ textAlign: "center" }}>
              <div className="hex hex--lg" style={{ margin: "0 auto" }}>03</div>
              <h3 className="h3" style={{ fontSize: "1.1rem" }}>Belong</h3>
              <p className="small text-2">Your Hive grows every time you show up.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: "start" }}>
            <div className="stack gap-16">
              <span className="eyebrow">Recurring Gatherings</span>
              <h2 className="h2">Trusted circles that meet again and again.</h2>
              <p className="text-2">
                Beyond one-off events, Hive circles gather on a rhythm — so belonging isn&rsquo;t
                a single night, it&rsquo;s a habit.
              </p>
            </div>
            <div className="card" style={{ padding: 8 }}>
              {recurring.map((r, i) => (
                <div
                  className="row"
                  key={r.name}
                  style={{
                    justifyContent: "space-between",
                    padding: "16px 18px",
                    borderBottom: i < recurring.length - 1 ? "1px solid var(--line)" : "none",
                  }}
                >
                  <span className="small" style={{ fontWeight: 600 }}>{r.name}</span>
                  <span className="small text-3">{r.cadence}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="section section--alt">
        <div className="container">
          <div className="grid grid-3">
            <div className="stack gap-10">
              <div className="badge">Verified organisers</div>
              <p className="small text-2">Every host is reviewed before their gathering goes live.</p>
            </div>
            <div className="stack gap-10">
              <div className="badge">Community guidelines</div>
              <p className="small text-2">
                Clear, warm expectations everyone agrees to.{" "}
                <Link href="/community-guidelines" style={{ color: "var(--accent-deep)", fontWeight: 600 }}>
                  Read them →
                </Link>
              </p>
            </div>
            <div className="stack gap-10">
              <div className="badge">Safe reporting</div>
              <p className="small text-2">Concerns are reviewed quickly and privately.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="cta-banner hex-texture">
            <h2 className="h2">Ready to find your circle?</h2>
            <div className="row wrap gap-16" style={{ justifyContent: "center", marginTop: 24 }}>
              <Link href="/explore" className="btn btn--on-dark">Explore Gatherings</Link>
              <Link href="/membership" className="btn btn--ghost-dark">Join the Hive</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
