"use client";

import { useMemo, useState } from "react";
import { ActivityCard } from "./ActivityCard";
import { EventModal } from "./EventModal";
import { UtilityRail } from "./UtilityRail";
import { GatheringForm } from "@/components/content/GatheringForm";
import { useEditMode } from "@/components/content/EditModeProvider";
import { GATHERING_CATEGORIES, gatheringToExperience, experienceToGathering, type Gathering } from "@/data/gatherings";
import type { Experience, ExperienceCategory } from "@/data/types";

interface ActivityGridProps {
  experiences: Experience[];
}

export function ActivityGrid({ experiences: initialExperiences }: ActivityGridProps) {
  const { isAdmin, editMode } = useEditMode();
  const [experiences, setExperiences] = useState(initialExperiences);
  const [filter, setFilter] = useState<"All" | ExperienceCategory>("All");
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [formTarget, setFormTarget] = useState<Experience | "new" | null>(null);

  const areas = useMemo(() => [...new Set(experiences.map((e) => e.area))].sort(), [experiences]);
  const matches = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return experiences.filter((e) =>
      (!area || e.area === area) &&
      (!search || [e.title, e.description, e.organiser, e.area, e.category].some((value) => value.toLocaleLowerCase().includes(search)))
    );
  }, [experiences, query, area]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    map.set("All", matches.length);
    for (const cat of GATHERING_CATEGORIES) {
      map.set(cat, matches.filter((e) => e.category === cat).length);
    }
    return map;
  }, [matches]);

  const filtered = useMemo(
    () => (filter === "All" ? matches : matches.filter((e) => e.category === filter)),
    [matches, filter]
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
      if (!saved.is_published) return prev.filter((e) => e.id !== next.id);
      return exists ? prev.map((e) => (e.id === next.id ? next : e)) : [...prev, next];
    });
    setFormTarget(null);
  }

  function handleDeleted(id: string) {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
    setFormTarget(null);
  }

  function clearFilters() {
    setQuery("");
    setArea("");
    setFilter("All");
  }

  const hasFilters = Boolean(query || area || filter !== "All");

  return (
    <div className="app-content">
      <div className="app-search" role="search" aria-label="Find gatherings">
        <div className="field">
          <label htmlFor="gathering-search">Find your next gathering</label>
          <input id="gathering-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search gatherings, hosts or interests" />
        </div>
        <div className="field">
          <label htmlFor="gathering-area">Neighbourhood</label>
          <select id="gathering-area" value={area} onChange={(event) => setArea(event.target.value)}>
            <option value="">All neighbourhoods</option>
            {areas.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
      </div>
      <div className="app-filters" role="group" aria-label="Gathering category">
        {(["All", ...GATHERING_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            type="button"
            className={`app-filter${filter === c ? " is-active" : ""}`}
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
          >
            {c}
            <span className="app-filter__count">{counts.get(c) ?? 0}</span>
          </button>
        ))}
      </div>
      <div className="app-results-summary">
        <p className="small text-2" role="status">{filtered.length} {filtered.length === 1 ? "gathering" : "gatherings"}{hasFilters ? " found" : " to explore"}</p>
        {hasFilters && <button type="button" className="btn btn--outline btn--sm" onClick={clearFilters}>Clear filters</button>}
      </div>
      <div className="app-layout">
        <div className="event-grid">
          {filtered.length === 0 && (
            <div className="empty-state event-grid__empty stack gap-10">
              <h2 className="h3">{hasFilters ? "No gatherings match just yet" : "More gatherings are on the way"}</h2>
              <p>{hasFilters ? "Try another neighbourhood, category or search term." : "Check back soon to find your next gathering."}</p>
            </div>
          )}
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
        <UtilityRail experiences={experiences} />
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
