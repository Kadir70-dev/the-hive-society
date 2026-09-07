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

const fieldStyleBase: CSSProperties = {
  font: "inherit",
  lineHeight: "inherit",
  letterSpacing: "inherit",
  textAlign: "inherit",
  // display:block (rather than the input/textarea default of inline-block)
  // guarantees the Save/Cancel actions that follow always wrap onto their
  // own line below the field, instead of sitting beside it when the field
  // is short (e.g. small hero labels) and there's room left on the line.
  display: "block",
  width: "100%",
  border: "1px dashed var(--accent-deep)",
  borderRadius: 4,
  padding: "2px 4px",
  margin: 0,
  resize: "vertical",
  outline: "none",
  boxShadow: "none",
  appearance: "none",
  WebkitAppearance: "none",
};

// Editable fields must never fall back to the browser's native white
// input/textarea background — on dark/photo sections the surrounding text
// is white, and a white field would make it unreadable while typing. Rather
// than guessing from section class names, we read the *actual* rendered
// text color right before switching into edit mode and pick a field theme
// that keeps that same color legible.
const fieldThemeDark: CSSProperties = {
  ...fieldStyleBase,
  background: "rgba(20,16,12,0.82)",
  color: "#fff",
  caretColor: "#fff",
};
const fieldThemeLight: CSSProperties = {
  ...fieldStyleBase,
  background: "var(--surface-2)",
  color: "var(--ink)",
  caretColor: "var(--ink)",
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
  const [fieldOnDark, setFieldOnDark] = useState(false);
  const [wrapperIsPositioned, setWrapperIsPositioned] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement & HTMLInputElement>(null);
  const displayRef = useRef<HTMLElement>(null);

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
    // Read the color this text is actually rendered with (inherited from
    // the section, not guessed from a class name) so the editor field can
    // match its own background/text to it instead of assuming light mode.
    if (displayRef.current) {
      const computed = getComputedStyle(displayRef.current);
      const channels = computed.color.match(/[\d.]+/g)?.map(Number);
      if (channels && channels.length >= 3) {
        const luminance = (0.2126 * channels[0]! + 0.7152 * channels[1]! + 0.0722 * channels[2]!) / 255;
        setFieldOnDark(luminance > 0.5);
      }
      // Some editable labels (hero kicker, photo captions) carry a class
      // that positions THEM absolutely on the page. Forcing position:relative
      // on top of that fights the class's own left/top/transform and blows
      // the box out to full-page width. Only add relative positioning when
      // the element wasn't already taken out of normal flow.
      setWrapperIsPositioned(computed.position !== "static");
    }
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
        style={{
          ...style,
          position: wrapperIsPositioned ? undefined : "relative",
          display: "block",
        }}
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
          // Deliberately NOT reusing the page's semantic `className` here —
          // it's already inherited via `font: inherit` below, and reapplying
          // it to the field would also reapply any position/left/transform
          // that class carries (hero kicker, photo captions), which fights
          // wrapperIsPositioned above and blows the field out to full width.
          className={fieldOnDark ? "cms-field--dark" : "cms-field--light"}
          style={fieldOnDark ? fieldThemeDark : fieldThemeLight}
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
      ref={displayRef as never}
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
