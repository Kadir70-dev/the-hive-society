"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ApplicationStatus, CommunityApplication } from "@/lib/admin/types";
import { ApplicationDetail } from "./ApplicationDetail";
import { StatusPill } from "./StatusPill";

const FILTERS: { label: string; value: ApplicationStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Waitlisted", value: "waitlisted" },
];

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-AE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ApplicationsClient() {
  const [status, setStatus] = useState<ApplicationStatus | "all">("all");
  const [q, setQ] = useState("");
  const [applications, setApplications] = useState<CommunityApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<CommunityApplication | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (nextStatus: ApplicationStatus | "all", nextQ: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/applications/list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, q: nextQ }),
      });
      if (!res.ok) throw new Error("failed");
      const body = await res.json();
      setApplications(body.applications ?? []);
    } catch {
      setError("Could not load applications. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(status, q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function handleSearchChange(value: string) {
    setQ(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(status, value), 350);
  }

  function handleUpdated(updated: CommunityApplication) {
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setSelected(updated);
  }

  return (
    <div className="stack gap-24">
      <div className="row gap-16" style={{ flexWrap: "wrap", justifyContent: "space-between" }}>
        <div className="row gap-8" style={{ flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`chip${status === f.value ? " is-active" : ""}`}
              onClick={() => setStatus(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search name, email or phone"
          value={q}
          onChange={(e) => handleSearchChange(e.target.value)}
          style={{
            maxWidth: 280,
            padding: "10px 14px",
            borderRadius: "var(--radius-s)",
            border: "1px solid var(--line)",
            background: "var(--surface)",
            color: "var(--text)",
          }}
        />
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
              {["Name", "Email", "Phone", "Emirate", "Status", "Submitted", ""].map((h) => (
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
            {!loading && applications.length === 0 && (
              <tr>
                <td colSpan={7} className="small text-2" style={{ padding: 16 }}>
                  No applications found.
                </td>
              </tr>
            )}
            {!loading &&
              applications.map((app) => (
                <tr
                  key={app.id}
                  style={{ borderBottom: "1px solid var(--line)", cursor: "pointer" }}
                  onClick={() => setSelected(app)}
                >
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{app.full_name}</td>
                  <td style={{ padding: "12px 16px" }} className="small text-2">
                    {app.email}
                  </td>
                  <td style={{ padding: "12px 16px" }} className="small text-2">
                    {app.phone}
                  </td>
                  <td style={{ padding: "12px 16px" }} className="small text-2">
                    {app.emirate}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <StatusPill status={app.status} />
                  </td>
                  <td style={{ padding: "12px 16px" }} className="small text-2">
                    {formatDate(app.created_at)}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button type="button" className="btn btn--outline btn--sm" onClick={() => setSelected(app)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <ApplicationDetail
        key={selected?.id ?? "none"}
        application={selected}
        onClose={() => setSelected(null)}
        onUpdated={handleUpdated}
      />
    </div>
  );
}
