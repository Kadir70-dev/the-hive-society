import Link from "next/link";
import type { Metadata } from "next";
import { circles } from "@/data/circles";

export const metadata: Metadata = {
  title: "My Hive — The Hive App",
};

export default function MyHivePage() {
  const suggested = circles.slice(0, 3);

  return (
    <div className="app-content" style={{ paddingTop: 44 }}>
      <div className="app-view-header stack gap-10">
        <span className="eyebrow">My Hive</span>
        <h1 className="h2">The women and circles you&rsquo;re building with.</h1>
      </div>

      <div className="stack gap-32">
        <div className="stack gap-14">
          <h3 className="h3" style={{ fontSize: "1.1rem" }}>Your Circles</h3>
          <div className="empty-state">You haven&rsquo;t joined a circle yet. Attend a gathering to start one.</div>
        </div>

        <div className="grid grid-2">
          <div className="stack gap-14">
            <h3 className="h3" style={{ fontSize: "1.1rem" }}>Upcoming Together</h3>
            <div className="empty-state">No shared plans yet.</div>
          </div>
          <div className="stack gap-14">
            <h3 className="h3" style={{ fontSize: "1.1rem" }}>Reserved Spots</h3>
            <div className="empty-state">No reservations yet — explore the feed.</div>
          </div>
        </div>

        <div className="stack gap-14">
          <h3 className="h3" style={{ fontSize: "1.1rem" }}>Women From Your Gatherings</h3>
          <div className="empty-state">Attend a gathering to start meeting the women in your Hive.</div>
        </div>

        <div className="stack gap-14">
          <h3 className="h3" style={{ fontSize: "1.1rem" }}>Suggested Circles</h3>
          <div className="grid grid-3">
            {suggested.map((circle) => (
              <div className="circle-card stack gap-10" key={circle.slug}>
                <h3 className="h3" style={{ fontSize: "1.05rem" }}>{circle.name}</h3>
                <p className="small text-2">
                  {circle.members} women · {circle.cadence}
                </p>
                <Link href="/app/explore" className="btn btn--outline btn--sm" style={{ alignSelf: "flex-start" }}>
                  Explore gatherings
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
