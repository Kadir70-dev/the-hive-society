"use client";

import { useState } from "react";
import { ExperienceCard } from "./ExperienceCard";
import { EventModal } from "@/components/product/EventModal";
import type { Experience } from "@/data/types";

export function FeaturedExperiences({ experiences }: { experiences: Experience[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const selected = experiences.find((e) => e.id === openId) ?? null;

  return (
    <>
      <div className="grid-feature">
        {experiences.map((experience, i) => (
          <ExperienceCard
            key={experience.id}
            experience={experience}
            onSelect={setOpenId}
            featured={i === 0}
          />
        ))}
      </div>
      <EventModal experience={selected} onClose={() => setOpenId(null)} />
    </>
  );
}
