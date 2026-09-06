"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import type { ApplicationStatus, CommunityApplication } from "@/lib/admin/types";
import { StatusPill } from "./StatusPill";

interface Props {
  application: CommunityApplication | null;
  onClose: () => void;
  onUpdated: (application: CommunityApplication) => void;
}

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

const STATUS_ACTIONS: { label: string; value: ApplicationStatus }[] = [
  { label: "Approve", value: "approved" },
  { label: "Reject", value: "rejected" },
  { label: "Waitlist", value: "waitlisted" },
  { label: "Return to Pending", value: "pending" },
];

export function ApplicationDetail({ application, onClose, onUpdated }: Props) {
  const [notes, setNotes] = useState(application?.admin_notes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [error, setError] = useState("");

  if (!application) return null;

  async function patch(body: Record<string, unknown>, actionKey: string) {
    setBusyAction(actionKey);
    setError("");
    try {
      const res = await fetch(`/api/admin/applications/${application!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("failed");
      const result = await res.json();
      onUpdated(result.application);
    } catch {
      setError("Could not save changes. Please try again.");
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <Modal open={Boolean(application)} onClose={onClose} labelledBy="application-detail-title">
      <div className="modal__body stack gap-24">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <div className="stack gap-8">
            <h3 className="h3" id="application-detail-title">
              {application.full_name}
            </h3>
            <StatusPill status={application.status} />
          </div>
        </div>

        <div className="stack gap-8">
          <DetailRow label="Email" value={application.email} />
          <DetailRow label="Phone" value={application.phone} />
          <DetailRow label="Emirate" value={application.emirate} />
          <DetailRow label="Area / city" value={application.area_city || "—"} />
          <DetailRow
            label="Interests"
            value={application.interests.length ? application.interests.join(", ") : "—"}
          />
          <DetailRow label="How they heard about us" value={application.heard_about_us || "—"} />
          <DetailRow label="Looking for" value={application.looking_for || "—"} />
        </div>

        <div className="stack gap-8">
          <DetailRow label="Submitted" value={formatDate(application.created_at)} />
          <DetailRow label="Last updated" value={formatDate(application.updated_at)} />
          <DetailRow label="Reviewed" value={formatDate(application.reviewed_at)} />
          <DetailRow
            label="WhatsApp invite"
            value={application.whatsapp_invited_at ? formatDate(application.whatsapp_invited_at) : "Not sent"}
          />
        </div>

        <div className="stack gap-8">
          <label htmlFor="adminNotes" className="small" style={{ fontWeight: 700 }}>
            Internal admin notes
          </label>
          <textarea
            id="adminNotes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ minHeight: 90 }}
          />
          <button
            type="button"
            className="btn btn--outline btn--sm"
            disabled={savingNotes || notes === (application.admin_notes ?? "")}
            onClick={async () => {
              setSavingNotes(true);
              await patch({ admin_notes: notes }, "notes");
              setSavingNotes(false);
            }}
          >
            {savingNotes ? "Saving…" : "Save notes"}
          </button>
        </div>

        {error && (
          <p className="small" role="alert" style={{ color: "#b3261e" }}>
            {error}
          </p>
        )}

        <div className="row gap-8" style={{ flexWrap: "wrap" }}>
          {STATUS_ACTIONS.filter((a) => a.value !== application.status).map((a) => (
            <button
              key={a.value}
              type="button"
              className="btn btn--outline btn--sm"
              disabled={busyAction !== null}
              onClick={() => patch({ status: a.value }, a.value)}
            >
              {busyAction === a.value ? "Saving…" : a.label}
            </button>
          ))}
          <button
            type="button"
            className="btn btn--outline btn--sm"
            disabled={busyAction !== null}
            onClick={() =>
              patch({ whatsapp_invited: !application.whatsapp_invited_at }, "whatsapp")
            }
          >
            {busyAction === "whatsapp"
              ? "Saving…"
              : application.whatsapp_invited_at
                ? "Mark WhatsApp Invite Not Sent"
                : "Mark WhatsApp Invite Sent"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="row" style={{ justifyContent: "space-between", gap: 16 }}>
      <span className="small text-2">{label}</span>
      <span className="small" style={{ fontWeight: 600, textAlign: "right" }}>
        {value}
      </span>
    </div>
  );
}
