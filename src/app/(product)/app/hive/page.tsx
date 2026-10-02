import Link from "next/link";
import type { Metadata } from "next";
import { circles } from "@/data/circles";
import { SavedGatherings } from "@/components/product/SavedGatherings";
import { getGatherings } from "@/lib/content/getGatherings";

export const metadata: Metadata = {
  title: "My Hive — The Hive App",
};

export default async function MyHivePage() {
  const suggested = circles.slice(0, 3);
  const [app, marketing] = await Promise.all([getGatherings("app"), getGatherings("marketing")]);

  return (
    <div className="app-content" style={{ paddingTop: 44 }}>
      <div className="app-view-header stack gap-10">
        <span className="eyebrow">My Hive</span>
        <h1 className="h2">The women and circles you&rsquo;re building with.</h1>
      </div>

      <div className="stack gap-32">
        <SavedGatherings experiences={[...app, ...marketing]} />
        <div className="stack gap-14">
          <h3 className="h3" style={{ fontSize: "1.1rem" }}>Your Circles</h3>
          <div className="empty-state">You haven&rsquo;t joined a circle yet. Attend a gathering to start one.</div>
        </div>

        <div className="stack gap-14">
          <h3 className="h3" style={{ fontSize: "1.1rem" }}>Upcoming Together</h3>
          <div className="empty-state">No shared plans yet.</div>
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
                <Link href={`/app/circles/${circle.slug}`} className="btn btn--outline btn--sm" style={{ alignSelf: "flex-start" }}>
                  View circle
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
