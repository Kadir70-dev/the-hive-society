"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import type { MembershipCadence } from "@/data/membershipPlans";

export interface AdminMembershipPlan {
  id: string;
  key: string;
  name: string;
  tagline: string;
  amount_aed: number;
  currency: string;
  cadence: MembershipCadence;
  features: string[];
  is_active: boolean;
  sort_order: number;
}

interface MembershipPlanFormProps {
  plan: AdminMembershipPlan | null; // null = creating a new one
  onClose: () => void;
  onSaved: (plan: AdminMembershipPlan) => void;
}

export function MembershipPlanForm({ plan, onClose, onSaved }: MembershipPlanFormProps) {
  const isNew = !plan;
  const [key, setKey] = useState(plan?.key ?? "");
  const [name, setName] = useState(plan?.name ?? "");
  const [tagline, setTagline] = useState(plan?.tagline ?? "");
  const [amountAed, setAmountAed] = useState(String(plan?.amount_aed ?? ""));
  const [cadence, setCadence] = useState<MembershipCadence>(plan?.cadence ?? "monthly");
  const [features, setFeatures] = useState((plan?.features ?? []).join("\n"));
  const [isActive, setIsActive] = useState(plan?.is_active ?? true);
  const [sortOrder, setSortOrder] = useState(String(plan?.sort_order ?? 0));
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError("");

    const payload = {
      ...(isNew ? { key } : {}),
      name,
      tagline,
      amount_aed: Number(amountAed),
      cadence,
      features: features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      is_active: isActive,
      sort_order: Number(sortOrder) || 0,
    };

    try {
      const res = await fetch(isNew ? "/api/admin/membership-plans" : `/api/admin/membership-plans/${plan!.id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(body?.error || "Could not save plan.");
        setStatus("error");
        return;
      }
      setStatus("idle");
      onSaved(body.plan as AdminMembershipPlan);
    } catch {
      setError("Network error — nothing was saved.");
      setStatus("error");
    }
  }

  return (
    <Modal open onClose={onClose} labelledBy="plan-form-title">
      <form className="modal__body stack gap-16" onSubmit={handleSubmit}>
        <h2 className="h3" id="plan-form-title">
          {isNew ? "Add plan" : `Edit ${plan!.name}`}
        </h2>

        <div className="row wrap gap-16">
          <div className="field" style={{ flex: "1 1 160px" }}>
            <label htmlFor="mp-name">Name</label>
            <input id="mp-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
          </div>
          {isNew && (
            <div className="field" style={{ flex: "1 1 140px" }}>
              <label htmlFor="mp-key">Key (optional)</label>
              <input id="mp-key" value={key} onChange={(e) => setKey(e.target.value)} placeholder="auto from name" />
            </div>
          )}
        </div>

        <div className="field">
          <label htmlFor="mp-tagline">Tagline</label>
          <input id="mp-tagline" value={tagline} onChange={(e) => setTagline(e.target.value)} maxLength={200} />
        </div>

        <div className="row wrap gap-16">
          <div className="field" style={{ flex: "1 1 140px" }}>
            <label htmlFor="mp-amount">Amount (AED)</label>
            <input
              id="mp-amount"
              type="number"
              min={1}
              step="1"
              value={amountAed}
              onChange={(e) => setAmountAed(e.target.value)}
              required
            />
          </div>
          <div className="field" style={{ flex: "1 1 140px" }}>
            <label htmlFor="mp-cadence">Cadence</label>
            <select id="mp-cadence" value={cadence} onChange={(e) => setCadence(e.target.value as MembershipCadence)}>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
          <div className="field" style={{ flex: "1 1 100px" }}>
            <label htmlFor="mp-sort">Sort order</label>
            <input id="mp-sort" type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="mp-features">Features (one per line)</label>
          <textarea
            id="mp-features"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            rows={6}
            placeholder={"Discover experiences\nJoin circles"}
          />
        </div>

        <label className="row gap-8" style={{ alignItems: "center" }}>
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          <span className="small">Active (shown on the Membership page)</span>
        </label>

        {error && (
          <p className="small" role="alert" style={{ color: "#b3261e" }}>
            {error}
          </p>
        )}

        <div className="row gap-12" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="btn btn--outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={status === "saving"}>
            {status === "saving" ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
