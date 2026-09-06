"use client";

import Link from "next/link";
import { useEditMode } from "./EditModeProvider";

export function AdminToolbar() {
  const { isAdmin, editMode, setEditMode } = useEditMode();

  if (!isAdmin) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "var(--surface-dark)",
        color: "var(--on-dark)",
        border: "1px solid var(--on-dark-line)",
        borderRadius: 999,
        padding: "8px 8px 8px 16px",
        boxShadow: "var(--shadow-lg)",
        fontSize: ".82rem",
      }}
    >
      <Link
        href="/admin/community"
        style={{ color: "var(--on-dark)", fontWeight: 600, borderRight: "1px solid var(--on-dark-line)", paddingRight: 10 }}
      >
        Community
      </Link>
      <span style={{ fontWeight: 600 }}>Edit Mode</span>
      <button
        type="button"
        onClick={() => setEditMode(!editMode)}
        aria-pressed={editMode}
        aria-label={editMode ? "Turn edit mode off" : "Turn edit mode on"}
        style={{
          position: "relative",
          width: 40,
          height: 22,
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          background: editMode ? "var(--accent)" : "var(--on-dark-line)",
          transition: "background .15s ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: editMode ? 20 : 2,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "var(--cream)",
            transition: "left .15s ease",
          }}
        />
      </button>
    </div>
  );
}
