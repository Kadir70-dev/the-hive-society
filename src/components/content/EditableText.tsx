"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type MouseEvent } from "react";
import { useEditMode } from "./EditModeProvider";

interface EditableTextProps {
  contentKey: string;
  value: string;
  as?: ElementType;
  multiline?: boolean;
  className?: string;
  style?: CSSProperties;
  maxLength?: number;
  id?: string;
  /** Boldest edit-mode box treatment, for text laid directly over a
   * full-bleed hero photo where the normal box reads too faintly. */
  hero?: boolean;
}

const fieldStyle: CSSProperties = {
  font: "inherit",
  color: "inherit",
  lineHeight: "inherit",
  letterSpacing: "inherit",
  textAlign: "inherit",
  width: "100%",
  background: "var(--surface)",
  border: "1px dashed var(--accent-deep)",
  borderRadius: 4,
  padding: "2px 4px",
  margin: 0,
  resize: "vertical",
};

/**
 * The one editing primitive behind EditableHeading/EditableParagraph/
 * EditableButtonLabel/EditableCaption/EditableLabel (see exports below) —
 * they only preset `as`/`multiline`, so behavior stays identical everywhere.
 *
 * Renders exactly `<Tag className style>{value}</Tag>` for public visitors
 * and non-edit-mode admins — no extra wrapper, no layout difference from the
 * original hardcoded markup. Edit affordances only mount when editMode is on.
 */
export function EditableText({
  contentKey,
  value,
  as: Tag = "span",
  multiline = false,
  className,
  style,
  maxLength = 5000,
  id,
  hero = false,
}: EditableTextProps) {
  const { isAdmin, editMode } = useEditMode();
  const [current, setCurrent] = useState(value);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement & HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    if (multiline && editing && inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [draft, multiline, editing]);

  if (!isAdmin || !editMode) {
    return (
      <Tag id={id} className={className} style={style}>
        {current}
      </Tag>
    );
  }

  function startEditing() {
    setDraft(current);
    setError("");
    setStatus("idle");
    setEditing(true);
  }

  function cancel() {
    setDraft(current);
    setEditing(false);
    setError("");
    setStatus("idle");
  }

  async function save() {
    const trimmed = draft.trim();
    if (trimmed === current) {
      setEditing(false);
      return;
    }
    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: contentKey, value: trimmed }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.error || "Could not save. Please try again.");
        setStatus("error");
        return;
      }
      setCurrent(trimmed);
      setEditing(false);
      setStatus("idle");
    } catch {
      setError("Network error — your edit was not saved.");
      setStatus("error");
    }
  }

  if (editing) {
    const InputTag = multiline ? "textarea" : "input";
    // Save/Cancel are <span role="button"> rather than <button> — this
    // editing UI can render inside a real <button> (e.g. nav/CTA labels),
    // and nested <button> elements are invalid HTML that browsers mangle.
    return (
      <Tag
        id={id}
        className={className}
        style={{ ...style, position: "relative", display: "block" }}
        onClick={(e: MouseEvent) => {
          // preventDefault too, not just stopPropagation — a <summary>
          // ancestor (FAQ accordions) toggles open/closed on its native
          // click default action, which stopPropagation alone doesn't stop.
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <InputTag
          ref={inputRef as never}
          className={className}
          style={fieldStyle}
          value={draft}
          maxLength={maxLength}
          disabled={status === "saving"}
          rows={multiline ? 2 : undefined}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              cancel();
            } else if (e.key === "Enter" && (!multiline || e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              void save();
            }
          }}
        />
        <span className="cms-edit-actions">
          <span
            className="cms-edit-btn cms-edit-btn--save"
            role="button"
            tabIndex={0}
            aria-disabled={status === "saving"}
            onClick={() => status !== "saving" && void save()}
            onKeyDown={(e) => e.key === "Enter" && status !== "saving" && void save()}
          >
            {status === "saving" ? "Saving…" : "Save"}
          </span>
          <span
            className="cms-edit-btn"
            role="button"
            tabIndex={0}
            aria-disabled={status === "saving"}
            onClick={() => status !== "saving" && cancel()}
            onKeyDown={(e) => e.key === "Enter" && status !== "saving" && cancel()}
          >
            Cancel
          </span>
        </span>
        {status === "error" && (
          <span className="cms-edit-error" role="alert">
            {error}
          </span>
        )}
      </Tag>
    );
  }

  // Many editable labels live inside a Link/button (CTAs, nav items). While
  // edit mode is on, swallow single clicks here so admins can double-click
  // to edit without triggering navigation — editing always wins over the
  // wrapped element's own behavior.
  function suppress(e: { preventDefault: () => void; stopPropagation: () => void }) {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <Tag
      id={id}
      className={className}
      style={{ ...style, position: "relative", cursor: "text" }}
      onClick={suppress}
      onDoubleClick={(e: MouseEvent) => {
        suppress(e);
        startEditing();
      }}
      title="Double-click to edit"
    >
      <span className={hero ? "cms-editable cms-editable--hero" : "cms-editable"}>{current}</span>
      <span
        className="cms-edit-badge"
        onClick={(e) => {
          suppress(e);
          startEditing();
        }}
        role="button"
        aria-label={`Edit ${contentKey}`}
      >
        ✎
      </span>
    </Tag>
  );
}

export function EditableHeading(props: Omit<EditableTextProps, "multiline">) {
  return <EditableText as="h2" {...props} multiline={false} />;
}

export function EditableParagraph(props: Omit<EditableTextProps, "multiline">) {
  return <EditableText as="p" {...props} multiline />;
}

export function EditableLabel(props: Omit<EditableTextProps, "multiline">) {
  return <EditableText as="span" {...props} multiline={false} />;
}

export function EditableCaption(props: Omit<EditableTextProps, "multiline">) {
  return <EditableText as="span" {...props} multiline={false} />;
}

export function EditableButtonLabel(props: Omit<EditableTextProps, "multiline">) {
  return <EditableText as="span" {...props} multiline={false} />;
}
