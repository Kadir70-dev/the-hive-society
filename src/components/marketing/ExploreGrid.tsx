"use client";

import { useMemo, useState } from "react";
import { ExperienceCard } from "./ExperienceCard";
import { EventModal } from "@/components/product/EventModal";
import { GatheringForm } from "@/components/content/GatheringForm";
import { useEditMode } from "@/components/content/EditModeProvider";
import { gatheringToExperience, experienceToGathering, type Gathering } from "@/data/gatherings";
import type { Experience, ExperienceCategory } from "@/data/types";

const CATEGORIES: ExperienceCategory[] = ["Move", "Gather", "Learn", "Celebrate", "Unwind", "Explore"];

interface ExploreGridProps {
  experiences: Experience[];
}

export function ExploreGrid({ experiences: initialExperiences }: ExploreGridProps) {
  const { isAdmin, editMode } = useEditMode();
  const [experiences, setExperiences] = useState(initialExperiences);
  const [filter, setFilter] = useState<"All" | ExperienceCategory>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [formTarget, setFormTarget] = useState<Experience | "new" | null>(null);

  const filtered = useMemo(
    () => (filter === "All" ? experiences : experiences.filter((e) => e.category === filter)),
    [experiences, filter]
  );

  const selected = experiences.find((e) => e.id === openId) ?? null;

  function handleSaved(saved: Gathering) {
    const next = gatheringToExperience(saved);
    setExperiences((prev) => {
      const exists = prev.some((e) => e.id === next.id);
      return exists ? prev.map((e) => (e.id === next.id ? next : e)) : [...prev, next];
    });
    setFormTarget(null);
  }

  function handleDeleted(id: string) {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    setFormTarget(null);
  }

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
          <ExperienceCard
            key={experience.id}
            experience={experience}
            onSelect={setOpenId}
            adminOverlay={
              isAdmin && editMode ? (
                <div
                  className="cms-image-edit"
                  style={{ bottom: "auto", top: 12 }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Edit gathering: ${experience.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormTarget(experience);
                  }}
                >
                  <span className="cms-image-edit__label">Edit</span>
                </div>
              ) : null
            }
          />
        ))}
        {isAdmin && editMode && (
          <button
            type="button"
            className="activity-card"
            style={{
              border: "1px dashed var(--line)",
              borderRadius: "var(--radius-m)",
              background: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 320,
              color: "var(--text-2)",
              font: "inherit",
            }}
            onClick={() => setFormTarget("new")}
          >
            + Add gathering
          </button>
        )}
      </div>
      <EventModal experience={selected} onClose={() => setOpenId(null)} />
      {formTarget && (
        <GatheringForm
          gathering={formTarget === "new" ? null : experienceToGathering(formTarget)}
          onClose={() => setFormTarget(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
}
