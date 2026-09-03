"use client";

import { useMemo, useState } from "react";
import { ExperienceCard } from "./ExperienceCard";
import { EventModal } from "@/components/product/EventModal";
import type { Experience, ExperienceCategory } from "@/data/types";

const CATEGORIES: ExperienceCategory[] = ["Move", "Gather", "Learn", "Celebrate", "Unwind", "Explore"];

interface ExploreGridProps {
  experiences: Experience[];
}

export function ExploreGrid({ experiences }: ExploreGridProps) {
  const [filter, setFilter] = useState<"All" | ExperienceCategory>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(
    () => (filter === "All" ? experiences : experiences.filter((e) => e.category === filter)),
    [experiences, filter]
  );

  const selected = experiences.find((e) => e.id === openId) ?? null;

  return (
    <>
      <div className="pill-row" style={{ marginBottom: 32 }}>
        {(["All", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            className={`chip${filter === c ? " is-active" : ""}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-3">
        {filtered.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} onSelect={setOpenId} />
        ))}
      </div>
      <EventModal experience={selected} onClose={() => setOpenId(null)} />
    </>
  );
}
