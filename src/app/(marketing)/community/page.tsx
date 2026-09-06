import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { circles } from "@/data/circles";
import { JoinCommunityButton } from "@/components/forms/JoinCommunityButton";

export const metadata: Metadata = {
  title: "Community",
  description:
    "The Hive isn't just where you book an activity — it's where relationships and trusted circles grow.",
};

const STEPS = [
  { n: "01", title: "Attend", body: "Show up to a gathering that fits your mood." },
  { n: "02", title: "Reconnect", body: "See familiar faces at the next one — and the one after that." },
  { n: "03", title: "Belong", body: "Your Hive grows every time you show up." },
];

const recurring = [
  { name: "Coffee & Conversations", cadence: "Tuesdays, weekly" },
  { name: "Weekend Padel", cadence: "Saturdays, weekly" },
  { name: "Book Club", cadence: "First Thursday, monthly" },
  { name: "Outdoor Explorers", cadence: "Every other Friday" },
];

export default function CommunityPage() {
  return (
    <>
      <div className="masthead section--dark hex-texture">
        <div className="container stack gap-14">
          <span className="eyebrow">Community</span>
          <p className="pull-quote" style={{ maxWidth: "18ch" }}>
            You come for a gathering. You return for your Hive.
          </p>
          <p className="lede">
            The Hive isn&rsquo;t just where you book an activity — it&rsquo;s where relationships
            and trusted circles grow.
          </p>
        </div>
      </div>

      <div className="section section--intimate">
        <div className="container">
          <div
            className="row wrap gap-16"
            style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}
          >
            <h2 className="h2" style={{ maxWidth: "16ch" }}>Community forms around what you love.</h2>
            <span className="small text-3">Preview — sign in to see your circles</span>
          </div>
          <div className="index-list" style={{ marginTop: 24 }}>
            {circles.map((circle) => (
              <div className="index-list__row" key={circle.slug}>
                <span className="index-list__name">{circle.name}</span>
                <span className="index-list__meta">{circle.members} women · {circle.cadence}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section section--alt section--intimate">
        <div className="container">
          <div className="rule-list rule-list--row rule-list--row-3">
            {STEPS.map((s) => (
              <div className="rule-list__item" key={s.n}>
                <span className="rule-list__num">{s.n}</span>
                <h3 className="h3" style={{ fontSize: "1.1rem" }}>{s.title}</h3>
                <p className="small text-2">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="split split--40-60">
            <div className="stack gap-16">
              <span className="eyebrow">Recurring Gatherings</span>
              <h2 className="h2">Trusted circles that meet again and again.</h2>
              <p className="text-2">
                Beyond one-off events, Hive circles gather on a rhythm — so belonging isn&rsquo;t
                a single night, it&rsquo;s a habit.
              </p>
            </div>
            <div className="index-list">
              {recurring.map((r) => (
                <div className="index-list__row" key={r.name}>
                  <span className="index-list__name" style={{ fontSize: ".98rem" }}>{r.name}</span>
                  <span className="index-list__meta">{r.cadence}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="section section--alt section--intimate">
        <div className="container">
          <div className="row wrap gap-12">
            <span className="badge">Verified organisers</span>
            <span className="badge">Community guidelines</span>
            <span className="badge">Safe reporting</span>
          </div>
          <p className="small text-2" style={{ marginTop: 16, maxWidth: "60ch" }}>
            Every host is reviewed before their gathering goes live, and concerns are reviewed
            quickly and privately.{" "}
            <Link href="/community-guidelines" style={{ color: "var(--accent-deep)", fontWeight: 600 }}>
              Read our guidelines →
            </Link>
          </p>
        </div>
      </div>

      <div className="bleed">
        <Image
          src="/images/a8-wellness.jpg"
          alt="A Hive wellness evening gathering"
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        <div className="bleed__overlay" />
        <div className="bleed__content bleed__content--center">
          <h2 className="h2" style={{ color: "#fff" }}>Ready to find your circle?</h2>
          <div className="row wrap gap-16" style={{ justifyContent: "center", marginTop: 22 }}>
            <Link href="/explore" className="btn btn--on-dark">Explore Gatherings</Link>
            <JoinCommunityButton className="btn btn--ghost-dark" />
          </div>
        </div>
      </div>
    </>
  );
}
