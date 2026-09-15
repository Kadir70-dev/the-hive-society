"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { GatheringForm } from "./GatheringForm";
import type { Gathering } from "./types";

export function GatheringsClient() {
  const [gatherings, setGatherings] = useState<Gathering[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Gathering | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/gatherings");
      if (!res.ok) throw new Error("failed");
      const body = await res.json();
      setGatherings(body.gatherings ?? []);
    } catch {
      setError("Could not load gatherings. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  function handleSaved(saved: Gathering) {
    setGatherings((prev) => {
      const exists = prev.some((g) => g.id === saved.id);
      const next = exists ? prev.map((g) => (g.id === saved.id ? saved : g)) : [...prev, saved];
      return next.sort((a, b) => a.display_order - b.display_order);
    });
    setEditing(null);
    setCreating(false);
  }

  async function handleDelete(g: Gathering) {
    if (!confirm(`Delete "${g.title}"? This can't be undone.`)) return;
    setDeletingId(g.id);
    try {
      const res = await fetch(`/api/admin/gatherings/${g.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      setGatherings((prev) => prev.filter((x) => x.id !== g.id));
    } catch {
      setError("Could not delete that gathering.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="stack gap-24">
      <div className="row" style={{ justifyContent: "flex-end" }}>
        <button type="button" className="btn btn--primary btn--sm" onClick={() => setCreating(true)}>
          Add gathering
        </button>
      </div>

      {error && (
        <p className="small" role="alert" style={{ color: "#b3261e" }}>
          {error}
        </p>
      )}

      <div className="table-wrap">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--line)" }}>
              {["", "Title", "Category", "Area", "Date", "Published", ""].map((h) => (
                <th key={h} className="small text-2" style={{ padding: "12px 16px" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="small text-2" style={{ padding: 16 }}>
                  Loading…
                </td>
              </tr>
            )}
            {!loading && gatherings.length === 0 && (
              <tr>
                <td colSpan={7} className="small text-2" style={{ padding: 16 }}>
                  No gatherings yet.
                </td>
              </tr>
            )}
            {!loading &&
              gatherings.map((g) => (
                <tr key={g.id} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "8px 16px" }}>
                    <div style={{ position: "relative", width: 56, height: 40, borderRadius: 6, overflow: "hidden", background: "var(--bg-alt)" }}>
                      <Image src={g.image_url} alt="" fill sizes="56px" style={{ objectFit: "cover" }} />
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{g.title}</td>
                  <td style={{ padding: "12px 16px" }} className="small text-2">{g.category}</td>
                  <td style={{ padding: "12px 16px" }} className="small text-2">{g.area}</td>
                  <td style={{ padding: "12px 16px" }} className="small text-2">{g.date_label}</td>
                  <td style={{ padding: "12px 16px" }} className="small text-2">{g.is_published ? "Yes" : "No"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div className="row gap-8">
                      <button type="button" className="btn btn--outline btn--sm" onClick={() => setEditing(g)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn--outline btn--sm"
                        disabled={deletingId === g.id}
                        onClick={() => void handleDelete(g)}
                      >
                        {deletingId === g.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {(editing || creating) && (
        <GatheringForm
          gathering={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
