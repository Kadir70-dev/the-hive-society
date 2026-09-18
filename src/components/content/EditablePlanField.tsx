"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { useEditMode } from "./EditModeProvider";

const fieldStyle: CSSProperties = {
  font: "inherit",
  lineHeight: "inherit",
  display: "block",
  width: "100%",
  border: "1px dashed var(--accent-deep)",
  borderRadius: 4,
  padding: "2px 4px",
  margin: 0,
  outline: "none",
  boxShadow: "none",
  background: "var(--surface-2)",
  color: "var(--ink)",
};

interface EditActionsProps {
  status: "idle" | "saving" | "error";
  error: string;
  onSave: () => void;
  onCancel: () => void;
}

function EditActions({ status, error, onSave, onCancel }: EditActionsProps) {
  return (
    <>
      <span className="cms-edit-actions">
        <span
          className="cms-edit-btn cms-edit-btn--save"
          role="button"
          tabIndex={0}
          aria-disabled={status === "saving"}
          onClick={() => status !== "saving" && onSave()}
          onKeyDown={(e) => e.key === "Enter" && status !== "saving" && onSave()}
        >
          {status === "saving" ? "Saving…" : "Save"}
        </span>
        <span
          className="cms-edit-btn"
          role="button"
          tabIndex={0}
          aria-disabled={status === "saving"}
          onClick={() => status !== "saving" && onCancel()}
          onKeyDown={(e) => e.key === "Enter" && status !== "saving" && onCancel()}
        >
          Cancel
        </span>
      </span>
      {status === "error" && (
        <span className="cms-edit-error" role="alert">
          {error}
        </span>
      )}
    </>
  );
}

async function patchPlan(planId: string, patch: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/admin/membership-plans/${planId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const body = await res.json().catch(() => null);
    if (!res.ok) return { ok: false, error: body?.error || "Could not save. Please try again." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error — your edit was not saved." };
  }
}

interface EditablePlanValueProps {
  planId: string;
  field: "name" | "tagline" | "amount_aed";
  value: string | number;
  as?: "span" | "h3" | "p";
  className?: string;
  style?: CSSProperties;
}

/** Double-click-to-edit for a single scalar plan field (name/tagline/price) — same interaction as EditableText, but PATCHes membership_plans instead of site_content, since that table (not the freeform CMS) is what checkout actually reads. */
export function EditablePlanValue({ planId, field, value, as: Tag = "span", className, style }: EditablePlanValueProps) {
  const { isAdmin, editMode } = useEditMode();
  const isNumber = field === "amount_aed";
  const [current, setCurrent] = useState(value);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  // No real row to save against (e.g. the hardcoded fallback plans shown
  // when the DB table is empty/unreachable) — never editable.
  if (!isAdmin || !editMode || !planId) {
    return <Tag className={className} style={style}>{current}</Tag>;
  }

  function startEditing() {
    setDraft(String(current));
    setError("");
    setStatus("idle");
    setEditing(true);
  }

  function cancel() {
    setDraft(String(current));
    setEditing(false);
    setError("");
    setStatus("idle");
  }

  async function save() {
    const trimmed = draft.trim();
    if (trimmed === String(current)) {
      setEditing(false);
      return;
    }
    if (isNumber && (!Number.isFinite(Number(trimmed)) || Number(trimmed) <= 0)) {
      setError("Enter a valid amount.");
      setStatus("error");
      return;
    }
    setStatus("saving");
    setError("");
    const parsed: string | number = isNumber ? Number(trimmed) : trimmed;
    const result = await patchPlan(planId, { [field]: parsed });
    if (!result.ok) {
      setError(result.error!);
      setStatus("error");
      return;
    }
    setCurrent(parsed);
    setEditing(false);
    setStatus("idle");
  }

  if (editing) {
    return (
      <Tag
        className={className}
        style={{ ...style, position: "relative", display: "block" }}
        onClick={(e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <input
          ref={inputRef}
          type={isNumber ? "number" : "text"}
          min={isNumber ? 1 : undefined}
          style={fieldStyle}
          value={draft}
          disabled={status === "saving"}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              cancel();
            } else if (e.key === "Enter") {
              e.preventDefault();
              void save();
            }
          }}
        />
        <EditActions status={status} error={error} onSave={() => void save()} onCancel={cancel} />
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      style={{ ...style, position: "relative", cursor: "text" }}
      onClick={(e: MouseEvent) => e.preventDefault()}
      onDoubleClick={(e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        startEditing();
      }}
      title="Double-click to edit"
    >
      <span className="cms-editable">{current}</span>
      <span
        className="cms-edit-badge"
        role="button"
        aria-label={`Edit ${field}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          startEditing();
        }}
      >
        ✎
      </span>
    </Tag>
  );
}

interface EditablePlanFeaturesProps {
  planId: string;
  features: string[];
}

/** Same double-click UX as EditablePlanValue, but for the features list — edits as one benefit per line, saved back as an array. */
export function EditablePlanFeatures({ planId, features }: EditablePlanFeaturesProps) {
  const { isAdmin, editMode } = useEditMode();
  const [current, setCurrent] = useState(features);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(features.join("\n"));
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  const listStyle: CSSProperties = { listStyle: "none", padding: 0, marginTop: 8 };

  if (!isAdmin || !editMode || !planId) {
    return (
      <ul className="stack gap-10" style={listStyle}>
        {current.map((feature) => (
          <li className="small" key={feature}>
            ✓ {feature}
          </li>
        ))}
      </ul>
    );
  }

  function startEditing() {
    setDraft(current.join("\n"));
    setError("");
    setStatus("idle");
    setEditing(true);
  }

  function cancel() {
    setDraft(current.join("\n"));
    setEditing(false);
    setError("");
    setStatus("idle");
  }

  async function save() {
    const parsed = draft
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
    setStatus("saving");
    setError("");
    const result = await patchPlan(planId, { features: parsed });
    if (!result.ok) {
      setError(result.error!);
      setStatus("error");
      return;
    }
    setCurrent(parsed);
    setEditing(false);
    setStatus("idle");
  }

  if (editing) {
    return (
      <div style={{ position: "relative", marginTop: 8 }}>
        <textarea
          ref={textareaRef}
          rows={Math.max(3, draft.split("\n").length)}
          style={fieldStyle}
          value={draft}
          disabled={status === "saving"}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              cancel();
            } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              void save();
            }
          }}
        />
        <EditActions status={status} error={error} onSave={() => void save()} onCancel={cancel} />
      </div>
    );
  }

  return (
    <div style={{ position: "relative", cursor: "text" }} onDoubleClick={startEditing} title="Double-click to edit">
      <ul className="stack gap-10" style={listStyle}>
        {current.map((feature) => (
          <li className="small" key={feature}>
            ✓ {feature}
          </li>
        ))}
      </ul>
      <span
        className="cms-edit-badge"
        role="button"
        aria-label="Edit features"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          startEditing();
        }}
      >
        ✎
      </span>
    </div>
  );
}
