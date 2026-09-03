"use client";

import { useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { AvatarStack } from "@/components/ui/AvatarStack";
import { VerifiedBadge } from "@/components/ui/Badge";
import type { Experience } from "@/data/types";

interface EventModalProps {
  experience: Experience | null;
  onClose: () => void;
}

export function EventModal({ experience, onClose }: EventModalProps) {
  const [reserved, setReserved] = useState(false);

  if (!experience) return null;

  return (
    <Modal open={!!experience} onClose={onClose} labelledBy="event-modal-title">
      <div className="photo" style={{ aspectRatio: "16/9", borderRadius: "24px 24px 0 0", position: "relative" }}>
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          sizes="(min-width: 700px) 620px, 100vw"
          style={{ objectFit: "cover" }}
          priority
        />
        <span className="photo__tag">
          {experience.area}, Abu Dhabi · {experience.date}
        </span>
      </div>
      <div className="modal__body stack gap-16">
        <div className="row wrap gap-12" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <div className="stack gap-6">
            <span className="activity-card__cat">{experience.category}</span>
            <h2 className="h3" id="event-modal-title">
              {experience.title}
            </h2>
            <span className="small text-3">
              Hosted by {experience.organiser}
              {experience.verified && <VerifiedBadge />}
            </span>
          </div>
          <span className="activity-card__price" style={{ fontSize: "1.2rem" }}>
            {experience.price}
          </span>
        </div>

        <p className="text-2 small">{experience.description}</p>

        <div className="row wrap gap-24 small text-2">
          <span>📍 {experience.area}</span>
          <span>🗓 {experience.date}</span>
          {experience.time && <span>🕐 {experience.time}</span>}
        </div>

        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <AvatarStack names={experience.attendeeNames} total={experience.going} />
          <span className="small text-3">{experience.going} women going</span>
        </div>

        <div className="card stack gap-10" style={{ padding: 16, background: "var(--bg-alt)" }}>
          <span className="label-sm">Say hi before you arrive</span>
          <div className="icebreaker">&quot;Hi everyone, looking forward to meeting you.&quot;</div>
          <div className="icebreaker">&quot;Is this beginner friendly?&quot;</div>
          <span className="small text-3">
            Preset icebreakers unlock in the group chat once you book — messaging is limited to
            attendees and moderated by the host.
          </span>
        </div>

        {!reserved ? (
          <button className="btn btn--primary btn--block" onClick={() => setReserved(true)}>
            Reserve Your Place
          </button>
        ) : (
          <div className="success-panel">
            <div className="hex">✓</div>
            <h3 className="h3" style={{ fontSize: "1.1rem" }}>
              You&rsquo;re in!
            </h3>
            <p className="small text-2">
              Your place at {experience.title} is reserved. The pre-event chat unlocks 48 hours
              before.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
