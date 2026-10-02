"use client";

import Link from "next/link";
import { SparkleIcon } from "@/components/ui/Icons";
import type { Experience } from "@/data/types";
import { useSavedGatherings } from "@/lib/member/savedGatherings";

export function UtilityRail({ experiences }: { experiences: Experience[] }) {
  const { slugs, ready } = useSavedGatherings();
  const saved = experiences.filter((experience) => slugs.includes(experience.slug)).slice(0, 3);
  return (
    <div className="utility-rail">
      <div className="rail-card rail-card--dark">
        <SparkleIcon className="rail-card__icon" />
        <h3>Host an Activity</h3>
        <p>Share what you love. Gather your Hive.</p>
        <Link href="/host" className="rail-card__link">
          Start here →
        </Link>
      </div>
      <div className="rail-card">
        <h3>Your Hive</h3>
        <span className="rail-card__label">Saved gatherings</span>
        <p>{!ready ? "Loading your Hive…" : slugs.length ? `${slugs.length} saved in this browser.` : "Save a gathering that catches your eye and find it here."}</p>
        {saved.length > 0 && <ul className="rail-saved-list">
          {saved.map((experience) => <li key={experience.slug}><Link href={`/app/experiences/${experience.slug}`}>{experience.title}</Link></li>)}
        </ul>}
        <Link href="/app/hive" className="rail-card__link">View My Hive →</Link>
      </div>
      <div className="rail-card">
        <h3>Pre-event chats</h3>
        <p>Coming soon: a space to say hi to other attendees before you arrive.</p>
      </div>
    </div>
  );
}
