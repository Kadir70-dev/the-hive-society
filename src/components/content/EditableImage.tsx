"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { useEditMode } from "./EditModeProvider";

const POSITION_PRESETS: { label: string; value: string }[] = [
  { label: "Center", value: "center" },
  { label: "Top", value: "center top" },
  { label: "Bottom", value: "center bottom" },
  { label: "Left", value: "left center" },
  { label: "Right", value: "right center" },
];

interface EditableImageProps {
  mediaKey: string;
  src: string;
  alt: string;
  objectPosition: string;
  sizes: string;
  priority?: boolean;
  style?: CSSProperties;
}

/**
 * Renders exactly what the original hardcoded <Image fill .../> did — same
 * props, same container. In edit mode a hover overlay + inline upload panel
 * is added as a sibling; both rely on the same parent's position:relative
 * that already made `fill` work, so no wrapper div is introduced.
 */
export function EditableImage({ mediaKey, src, alt, objectPosition, sizes, priority, style }: EditableImageProps) {
  const { isAdmin, editMode } = useEditMode();
  const [currentSrc, setCurrentSrc] = useState(src);
  const [currentAlt, setCurrentAlt] = useState(alt);
  const [currentPosition, setCurrentPosition] = useState(objectPosition);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [altDraft, setAltDraft] = useState(alt);
  const [positionDraft, setPositionDraft] = useState(objectPosition);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const image = (
    <Image
      src={currentSrc}
      alt={currentAlt}
      fill
      sizes={sizes}
      style={{ ...style, objectFit: "cover", objectPosition: currentPosition }}
      priority={priority}
    />
  );

  if (!isAdmin || !editMode) return image;

  function openPanel() {
    setAltDraft(currentAlt);
    setPositionDraft(currentPosition);
    setFile(null);
    setPreview(null);
    setError("");
    setStatus("idle");
    setOpen(true);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function save() {
    setStatus("saving");
    setError("");
    try {
      if (file) {
        const form = new FormData();
        form.append("media_key", mediaKey);
        form.append("alt_text", altDraft);
        form.append("object_position", positionDraft);
        form.append("file", file);
        const res = await fetch("/api/admin/media", { method: "POST", body: form });
        const body = await res.json().catch(() => null);
        if (!res.ok) {
          setError(body?.error || "Could not upload image.");
          setStatus("error");
          return;
        }
        setCurrentSrc(body.url);
        setCurrentAlt(body.alt);
        setCurrentPosition(body.objectPosition);
      } else {
        const res = await fetch(`/api/admin/media/${encodeURIComponent(mediaKey)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ alt_text: altDraft, object_position: positionDraft }),
        });
        const body = await res.json().catch(() => null);
        if (!res.ok) {
          setError(body?.error || "Could not save changes.");
          setStatus("error");
          return;
        }
        setCurrentAlt(altDraft);
        setCurrentPosition(positionDraft);
      }
      setStatus("idle");
      setOpen(false);
    } catch {
      setError("Network error — nothing was saved.");
      setStatus("error");
    }
  }

  return (
    <>
      {image}
      {!open && (
        <div className="cms-image-edit" onClick={openPanel} role="button" tabIndex={0} aria-label={`Change image: ${mediaKey}`}>
          <span className="cms-image-edit__label">Change image</span>
        </div>
      )}
      {open && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            background: "rgba(20,16,10,.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            className="card stack gap-16"
            style={{ padding: 20, width: "min(340px, 100%)", background: "var(--surface)", maxHeight: "100%", overflow: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 8, overflow: "hidden", background: "var(--bg-alt)" }}>
              <Image
                src={preview ?? currentSrc}
                alt=""
                fill
                sizes="340px"
                style={{ objectFit: "cover", objectPosition: positionDraft }}
              />
            </div>
            <div className="field">
              <label htmlFor={`file-${mediaKey}`}>Replace image (JPEG/PNG/WEBP, max 8MB)</label>
              <input
                id={`file-${mediaKey}`}
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />
            </div>
            <div className="field">
              <label htmlFor={`alt-${mediaKey}`}>Alt text</label>
              <input id={`alt-${mediaKey}`} value={altDraft} onChange={(e) => setAltDraft(e.target.value)} maxLength={300} />
            </div>
            <div className="field">
              <label htmlFor={`pos-${mediaKey}`}>Focal position</label>
              <select id={`pos-${mediaKey}`} value={positionDraft} onChange={(e) => setPositionDraft(e.target.value)}>
                {POSITION_PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            {status === "error" && (
              <p className="small" role="alert" style={{ color: "#b3261e" }}>
                {error}
              </p>
            )}
            <div className="row gap-8">
              <button type="button" className="btn btn--primary btn--sm" disabled={status === "saving"} onClick={() => void save()}>
                {status === "saving" ? "Saving…" : "Save"}
              </button>
              <button type="button" className="btn btn--outline btn--sm" disabled={status === "saving"} onClick={() => setOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
