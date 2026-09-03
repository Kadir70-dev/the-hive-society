"use client";

import { useMemo, useState } from "react";
import { ActivityCard } from "./ActivityCard";
import { EventModal } from "./EventModal";
import { UtilityRail } from "./UtilityRail";
import type { Experience, ExperienceCategory } from "@/data/types";

const FILTER_CATEGORIES: ExperienceCategory[] = ["Move", "Gather", "Learn", "Celebrate", "Unwind"];

interface ActivityGridProps {
  experiences: Experience[];
}

export function ActivityGrid({ experiences }: ActivityGridProps) {
  const [filter, setFilter] = useState<"All" | ExperienceCategory>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    map.set("All", experiences.length);
    for (const cat of FILTER_CATEGORIES) {
      map.set(cat, experiences.filter((e) => e.category === cat).length);
    }
    return map;
  }, [experiences]);

  const filtered = useMemo(
    () => (filter === "All" ? experiences : experiences.filter((e) => e.category === filter)),
    [experiences, filter]
  );

  const selected = experiences.find((e) => e.id === openId) ?? null;

  return (
    <div className="app-content">
      <div className="app-filters">
        {(["All", ...FILTER_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            className={`app-filter${filter === c ? " is-active" : ""}`}
            onClick={() => setFilter(c)}
          >
            {c}
            <span className="app-filter__count">{counts.get(c) ?? 0}</span>
          </button>
        ))}
      </div>
      <div className="app-layout">
        <div className="event-grid">
          {filtered.map((experience) => (
            <ActivityCard key={experience.id} experience={experience} onSelect={setOpenId} />
          ))}
        </div>
        <UtilityRail />
      </div>
      <EventModal experience={selected} onClose={() => setOpenId(null)} />
    </div>
  );
}
