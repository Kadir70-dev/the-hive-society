"use client";

import { useCallback, useEffect, useState } from "react";
import { MembershipPlanForm, type AdminMembershipPlan } from "@/components/content/MembershipPlanForm";

export function MembershipPlansClient() {
  const [plans, setPlans] = useState<AdminMembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<AdminMembershipPlan | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/membership-plans");
      if (!res.ok) throw new Error("failed");
      const body = await res.json();
      setPlans(body.plans ?? []);
    } catch {
      setError("Could not load plans. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  function handleSaved(saved: AdminMembershipPlan) {
    setPlans((prev) => {
      const exists = prev.some((p) => p.id === saved.id);
      const next = exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [...prev, saved];
      return next.sort((a, b) => a.sort_order - b.sort_order);
    });
    setEditing(null);
    setCreating(false);
  }

  async function handleDelete(plan: AdminMembershipPlan) {
    if (!confirm(`Delete "${plan.name}"? This can't be undone.`)) return;
    setDeletingId(plan.id);
    setError("");
    try {
      const res = await fetch(`/api/admin/membership-plans/${plan.id}`, { method: "DELETE" });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.error || "Could not delete that plan.");
        return;
      }
      setPlans((prev) => prev.filter((p) => p.id !== plan.id));
    } catch {
      setError("Could not delete that plan.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="stack gap-24">
      <div className="row" style={{ justifyContent: "flex-end" }}>
        <button type="button" className="btn btn--primary btn--sm" onClick={() => setCreating(true)}>
          Add plan
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
              {["Key", "Name", "Amount", "Cadence", "Active", "Sort", ""].map((h) => (
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
            {!loading && plans.length === 0 && (
              <tr>
                <td colSpan={7} className="small text-2" style={{ padding: 16 }}>
                  No plans yet.
                </td>
              </tr>
            )}
            {!loading &&
              plans.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "12px 16px" }} className="small text-2 mono">
                    {p.key}
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: "12px 16px" }} className="small text-2">
                    AED {p.amount_aed}
                  </td>
                  <td style={{ padding: "12px 16px", textTransform: "capitalize" }} className="small text-2">
                    {p.cadence}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className="small" style={{ color: p.is_active ? "#3E6B4F" : "#8A756C", fontWeight: 600 }}>
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }} className="small text-2">
                    {p.sort_order}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div className="row gap-8">
                      <button type="button" className="btn btn--outline btn--sm" onClick={() => setEditing(p)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn--outline btn--sm"
                        disabled={deletingId === p.id}
                        onClick={() => void handleDelete(p)}
                      >
                        {deletingId === p.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {(editing || creating) && (
        <MembershipPlanForm
          plan={editing}
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
