"use client";

import { useMemo, useState } from "react";
import { ActivityCard } from "./ActivityCard";
import { EventModal } from "./EventModal";
import { UtilityRail } from "./UtilityRail";
import { GatheringForm } from "@/components/content/GatheringForm";
import { useEditMode } from "@/components/content/EditModeProvider";
import { gatheringToExperience, experienceToGathering, type Gathering } from "@/data/gatherings";
import type { Experience, ExperienceCategory } from "@/data/types";

const FILTER_CATEGORIES: ExperienceCategory[] = ["Move", "Gather", "Learn", "Celebrate", "Unwind"];

interface ActivityGridProps {
  experiences: Experience[];
}

export function ActivityGrid({ experiences: initialExperiences }: ActivityGridProps) {
  const { isAdmin, editMode } = useEditMode();
  const [experiences, setExperiences] = useState(initialExperiences);
  const [filter, setFilter] = useState<"All" | ExperienceCategory>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [formTarget, setFormTarget] = useState<Experience | "new" | null>(null);

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

  function handleCardClick(id: string) {
    if (isAdmin && editMode) {
      const target = experiences.find((e) => e.id === id);
      if (target) setFormTarget(target);
      return;
    }
    setOpenId(id);
  }

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
            <ActivityCard
              key={experience.id}
              experience={experience}
              onSelect={handleCardClick}
              adminOverlay={
                isAdmin && editMode ? (
                  <div className="cms-image-edit" style={{ bottom: "auto", top: 12, right: "auto", left: 12 }}>
                    <span className="cms-image-edit__label">Edit</span>
                  </div>
                ) : null
              }
            />
          ))}
          {isAdmin && editMode && (
            <button
              type="button"
              className="event-card"
              style={{
                border: "1px dashed var(--line)",
                background: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 280,
                color: "var(--text-2)",
                font: "inherit",
              }}
              onClick={() => setFormTarget("new")}
            >
              + Add gathering
            </button>
          )}
        </div>
        <UtilityRail />
      </div>
      <EventModal experience={selected} onClose={() => setOpenId(null)} />
      {formTarget && (
        <GatheringForm
          gathering={formTarget === "new" ? null : experienceToGathering(formTarget, "app")}
          surface="app"
          onClose={() => setFormTarget(null)}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      )}
    </div>
  );
}
