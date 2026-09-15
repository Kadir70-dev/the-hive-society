"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { GATHERING_CATEGORIES, type Gathering } from "@/data/gatherings";
import type { ExperienceCategory } from "@/data/types";

interface GatheringFormProps {
  gathering: Gathering | null; // null = creating a new one
  onClose: () => void;
  onSaved: (gathering: Gathering) => void;
  onDeleted?: (id: string) => void;
}

export function GatheringForm({ gathering, onClose, onSaved, onDeleted }: GatheringFormProps) {
  const isNew = !gathering;
  const [title, setTitle] = useState(gathering?.title ?? "");
  const [slug, setSlug] = useState(gathering?.slug ?? "");
  const [category, setCategory] = useState<ExperienceCategory>(gathering?.category ?? "Move");
  const [organiser, setOrganiser] = useState(gathering?.organiser ?? "");
  const [area, setArea] = useState(gathering?.area ?? "");
  const [dateLabel, setDateLabel] = useState(gathering?.date_label ?? "");
  const [timeLabel, setTimeLabel] = useState(gathering?.time_label ?? "");
  const [priceLabel, setPriceLabel] = useState(gathering?.price_label ?? "");
  const [going, setGoing] = useState(String(gathering?.going ?? 0));
  const [attendeeNames, setAttendeeNames] = useState((gathering?.attendee_names ?? []).join(", "));
  const [verified, setVerified] = useState(gathering?.verified ?? false);
  const [description, setDescription] = useState(gathering?.description ?? "");
  const [isPublished, setIsPublished] = useState(gathering?.is_published ?? true);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "deleting" | "error">("idle");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const form = new FormData();
    form.append("title", title);
    if (isNew && slug) form.append("slug", slug);
    form.append("category", category);
    form.append("organiser", organiser);
    form.append("area", area);
    form.append("date_label", dateLabel);
    form.append("time_label", timeLabel);
    form.append("price_label", priceLabel);
    form.append("going", going);
    form.append("attendee_names", attendeeNames);
    form.append("verified", String(verified));
    form.append("description", description);
    form.append("is_published", String(isPublished));
    if (file) form.append("file", file);

    try {
      const res = await fetch(isNew ? "/api/admin/gatherings" : `/api/admin/gatherings/${gathering!.id}`, {
        method: isNew ? "POST" : "PATCH",
        body: form,
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.error || "Could not save gathering.");
        setStatus("error");
        return;
      }
      setStatus("idle");
      onSaved(body.gathering as Gathering);
    } catch {
      setError("Network error — nothing was saved.");
      setStatus("error");
    }
  }

  async function handleDelete() {
    if (!gathering || !onDeleted) return;
    if (!confirm(`Delete "${gathering.title}"? This can't be undone.`)) return;
    setStatus("deleting");
    setError("");
    try {
      const res = await fetch(`/api/admin/gatherings/${gathering.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      onDeleted(gathering.id);
    } catch {
      setError("Could not delete that gathering.");
      setStatus("error");
    }
  }

  const busy = status === "saving" || status === "deleting";

  return (
    <Modal open onClose={onClose} labelledBy="gathering-form-title">
      <form className="modal__body stack gap-16" onSubmit={handleSubmit}>
        <h2 className="h3" id="gathering-form-title">
          {isNew ? "Add gathering" : "Edit gathering"}
        </h2>

        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 8, overflow: "hidden", background: "var(--bg-alt)" }}>
          {(preview ?? gathering?.image_url) ? (
            <Image src={preview ?? gathering!.image_url} alt="" fill sizes="620px" style={{ objectFit: "cover" }} />
          ) : null}
        </div>
        <div className="field">
          <label htmlFor="gf-file">{isNew ? "Image (required)" : "Replace image"} — JPEG/PNG/WEBP, max 8MB</label>
          <input id="gf-file" ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />
        </div>

        <div className="row wrap gap-16">
          <div className="field" style={{ flex: "1 1 220px" }}>
            <label htmlFor="gf-title">Title</label>
            <input id="gf-title" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} />
          </div>
          {isNew && (
            <div className="field" style={{ flex: "1 1 160px" }}>
              <label htmlFor="gf-slug">Slug (optional)</label>
              <input id="gf-slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto from title" />
            </div>
          )}
        </div>

        <div className="row wrap gap-16">
          <div className="field" style={{ flex: "1 1 160px" }}>
            <label htmlFor="gf-category">Category</label>
            <select id="gf-category" value={category} onChange={(e) => setCategory(e.target.value as typeof category)}>
              {GATHERING_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field" style={{ flex: "1 1 160px" }}>
            <label htmlFor="gf-organiser">Organiser</label>
            <input id="gf-organiser" value={organiser} onChange={(e) => setOrganiser(e.target.value)} required maxLength={200} />
          </div>
          <div className="field" style={{ flex: "1 1 160px" }}>
            <label htmlFor="gf-area">Area</label>
            <input id="gf-area" value={area} onChange={(e) => setArea(e.target.value)} required maxLength={200} />
          </div>
        </div>

        <div className="row wrap gap-16">
          <div className="field" style={{ flex: "1 1 140px" }}>
            <label htmlFor="gf-date">Date label</label>
            <input id="gf-date" value={dateLabel} onChange={(e) => setDateLabel(e.target.value)} required placeholder="Sat, 13 Sep" maxLength={100} />
          </div>
          <div className="field" style={{ flex: "1 1 140px" }}>
            <label htmlFor="gf-time">Time label</label>
            <input id="gf-time" value={timeLabel ?? ""} onChange={(e) => setTimeLabel(e.target.value)} placeholder="9:00 AM" maxLength={100} />
          </div>
          <div className="field" style={{ flex: "1 1 140px" }}>
            <label htmlFor="gf-price">Price label</label>
            <input id="gf-price" value={priceLabel} onChange={(e) => setPriceLabel(e.target.value)} required placeholder="AED 60 / Free" maxLength={100} />
          </div>
        </div>

        <div className="row wrap gap-16">
          <div className="field" style={{ flex: "1 1 120px" }}>
            <label htmlFor="gf-going">Going</label>
            <input id="gf-going" type="number" min={0} value={going} onChange={(e) => setGoing(e.target.value)} required />
          </div>
          <div className="field" style={{ flex: "2 1 260px" }}>
            <label htmlFor="gf-attendees">Attendee names (comma-separated)</label>
            <input id="gf-attendees" value={attendeeNames} onChange={(e) => setAttendeeNames(e.target.value)} placeholder="Aisha, Noor, Layla" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="gf-desc">Description</label>
          <textarea id="gf-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={2000} />
        </div>

        <div className="row gap-24">
          <label className="row gap-8" style={{ alignItems: "center" }}>
            <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
            Verified
          </label>
          <label className="row gap-8" style={{ alignItems: "center" }}>
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            Published
          </label>
        </div>

        {status === "error" && (
          <p className="small" role="alert" style={{ color: "#b3261e" }}>
            {error}
          </p>
        )}

        <div className="row gap-8" style={{ justifyContent: "space-between" }}>
          <div className="row gap-8">
            <button type="submit" className="btn btn--primary btn--sm" disabled={busy}>
              {status === "saving" ? "Saving…" : "Save"}
            </button>
            <button type="button" className="btn btn--outline btn--sm" disabled={busy} onClick={onClose}>
              Cancel
            </button>
          </div>
          {!isNew && onDeleted && (
            <button type="button" className="btn btn--outline btn--sm" disabled={busy} onClick={() => void handleDelete()}>
              {status === "deleting" ? "Deleting…" : "Delete"}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
