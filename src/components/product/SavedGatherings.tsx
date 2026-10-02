"use client";

import Link from "next/link";
import { useState } from "react";
import type { Experience } from "@/data/types";
import { useSavedGatherings } from "@/lib/member/savedGatherings";
import { ActivityCard } from "./ActivityCard";
import { EventModal } from "./EventModal";

export function SavedGatherings({ experiences }: { experiences: Experience[] }) {
  const { slugs, ready, toggleSaved } = useSavedGatherings();
  const [openId, setOpenId] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const selected = experiences.find((experience) => experience.id === openId) ?? null;
  const bySlug = new Map(experiences.map((experience) => [experience.slug, experience]));

  return (
    <section className="stack gap-14" aria-labelledby="saved-gatherings-heading">
      <div className="stack gap-6">
        <h2 id="saved-gatherings-heading" className="h3">Saved gatherings{ready ? ` (${slugs.length})` : ""}</h2>
        <p className="small text-2">Your shortlist, saved in this browser. Saving a gathering does not reserve a place.</p>
      </div>
      {!ready ? <div className="empty-state" role="status">Loading your saved gatherings…</div> : slugs.length === 0 ? (
        <div className="empty-state stack gap-16">
          <p>A coffee morning, a new skill, a little time for you. Save something you&rsquo;d love to try.</p>
          <Link href="/app/explore" className="btn btn--primary" style={{ alignSelf: "center" }}>Explore gatherings</Link>
        </div>
      ) : (
        <div className="event-grid">
          {slugs.map((slug) => {
            const experience = bySlug.get(slug);
            return <div key={slug} className="stack gap-10 saved-gathering">
              {experience ? <ActivityCard experience={experience} onSelect={setOpenId} /> : (
                <div className="empty-state stack gap-10">
                  <h3 className="h3">Gathering unavailable</h3>
                  <p>This gathering is no longer in the published catalogue.</p>
                </div>
              )}
              <button type="button" className="btn btn--outline btn--sm" aria-label={`Remove ${experience?.title ?? "unavailable gathering"} from My Hive`} onClick={() => setError(!toggleSaved(slug))}>
                Remove from My Hive
              </button>
            </div>;
          })}
        </div>
      )}
      {error && <p className="small text-2" role="alert">Your browser couldn&rsquo;t update your saved gatherings. Allow site storage and try again.</p>}
      <EventModal experience={selected} onClose={() => setOpenId(null)} />
    </section>
  );
}
