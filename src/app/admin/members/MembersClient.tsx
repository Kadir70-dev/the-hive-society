"use client";

import { Fragment, useCallback, useEffect, useState } from "react";

interface Payment {
  id: string;
  ziina_payment_intent_id: string;
  amount_aed: number;
  status: "pending" | "completed" | "failed";
  created_at: string;
}

interface Member {
  id: string;
  email: string;
  full_name: string;
  plan: "one_time" | "monthly";
  status: "pending" | "active" | "expired" | "canceled";
  amount_aed: number;
  current_period_end: string | null;
  created_at: string;
  membership_payments: Payment[];
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-AE", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_COLOR: Record<Member["status"], string> = {
  active: "#3E6B4F",
  pending: "#9C7A2E",
  expired: "#8A756C",
  canceled: "#B3261E",
};

export function MembersClient() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/members");
      if (!res.ok) throw new Error("failed");
      const body = await res.json();
      setMembers(body.members ?? []);
    } catch {
      setError("Could not load members. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  async function markActive(id: string) {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/members/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "active" }),
      });
      if (!res.ok) throw new Error("failed");
      const body = await res.json();
      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status: body.member.status } : m)));
    } catch {
      setError("Could not update that member.");
    } finally {
      setSavingId(null);
    }
  }

  const activeCount = members.filter((m) => m.status === "active").length;
  const pendingCount = members.filter((m) => m.status === "pending").length;

  return (
    <div className="stack gap-24">
      <div className="row gap-24" style={{ flexWrap: "wrap" }}>
        <span className="small text-2">
          <strong style={{ color: "var(--text)" }}>{activeCount}</strong> active
        </span>
        <span className="small text-2">
          <strong style={{ color: "var(--text)" }}>{pendingCount}</strong> pending checkout
        </span>
        <span className="small text-2">
          <strong style={{ color: "var(--text)" }}>{members.length}</strong> total
        </span>
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
              {["Name", "Email", "Plan", "Amount", "Status", "Joined", "Renews", ""].map((h) => (
                <th key={h} className="small text-2" style={{ padding: "12px 16px" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="small text-2" style={{ padding: 16 }}>
                  Loading…
                </td>
              </tr>
            )}
            {!loading && members.length === 0 && (
              <tr>
                <td colSpan={8} className="small text-2" style={{ padding: 16 }}>
                  No members yet.
                </td>
              </tr>
            )}
            {!loading &&
              members.map((m) => (
                <Fragment key={m.id}>
                  <tr
                    key={m.id}
                    style={{ borderBottom: "1px solid var(--line)", cursor: "pointer" }}
                    onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
                  >
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>{m.full_name}</td>
                    <td style={{ padding: "12px 16px" }} className="small text-2">{m.email}</td>
                    <td style={{ padding: "12px 16px" }} className="small text-2">{m.plan === "one_time" ? "One-time" : "Monthly"}</td>
                    <td style={{ padding: "12px 16px" }} className="small text-2">AED {m.amount_aed}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className="small" style={{ color: STATUS_COLOR[m.status], fontWeight: 600, textTransform: "capitalize" }}>
                        {m.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }} className="small text-2">{formatDate(m.created_at)}</td>
                    <td style={{ padding: "12px 16px" }} className="small text-2">{formatDate(m.current_period_end)}</td>
                    <td style={{ padding: "12px 16px" }}>
                      {m.status !== "active" && (
                        <button
                          type="button"
                          className="btn btn--outline btn--sm"
                          disabled={savingId === m.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            void markActive(m.id);
                          }}
                        >
                          {savingId === m.id ? "Saving…" : "Mark active"}
                        </button>
                      )}
                    </td>
                  </tr>
                  {expandedId === m.id && (
                    <tr key={`${m.id}-detail`} style={{ borderBottom: "1px solid var(--line)", background: "var(--bg-alt)" }}>
                      <td colSpan={8} style={{ padding: "12px 16px" }}>
                        <div className="stack gap-6">
                          <span className="small text-2" style={{ fontWeight: 600 }}>Payment history</span>
                          {m.membership_payments.length === 0 && <span className="small text-3">No payments recorded.</span>}
                          {m.membership_payments.map((p) => (
                            <div key={p.id} className="row gap-16 small text-2">
                              <span className="mono">{p.ziina_payment_intent_id}</span>
                              <span>AED {p.amount_aed}</span>
                              <span style={{ textTransform: "capitalize" }}>{p.status}</span>
                              <span>{formatDate(p.created_at)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
